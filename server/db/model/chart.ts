import {each} from "../common";
import {formatDate, isNotUndefined} from "../../util";
import util = require("util");
const {promisify} = util;

export const getGoodsData = async ctx => {
    const {companyId} = ctx.query;
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let key = ctx.getGoodsDataKey(companyId);
    let goodsData = await get(key);
    let mysql = ctx.db;
    // {
    //     merge: false,
    //     [goodsId]: {count: 0, title: 0}
    // }
    //判断有无缓存
    if (goodsData) {
        //判断有无与mysql数据合并过
        goodsData = JSON.parse(goodsData);
        if (goodsData.merge) {
            //已经合并过
            //更新缓存
            return goodsData;
        } else {
            //查询数据库
            let sql = "select id, sale_num from goods where company_id = ?";
            let [rows] = await mysql.execute(sql, [companyId]);
            let list = each(rows);
            list.forEach(item => {
                goodsData[item.id] = goodsData[item.id] ? goodsData[item.id].count + item.sale_num : item.sale_num;
            });
            //标志更新为已经合并过
            goodsData.merge = true;
            //更新缓存
            ctx.redis.set(key, JSON.stringify(goodsData));
            return goodsData;
        }
    } else {
        goodsData = {};
        //没有缓存
        //查询数据库
        let sql = "select id, title, sale_num from goods where company_id = ?";
        let [rows] = await mysql.execute(sql, [companyId]);
        let list = each(rows);
        list.forEach(item => {
            goodsData[item.id] = {
                count: item.saleNum,
                title: item.title
            };
        });
        // console.log("goods-list", list);
        //标志更新为已经合并过
        goodsData.merge = true;
        //更新缓存
        ctx.redis.set(key, JSON.stringify(goodsData));
        return goodsData;
    }
}

/**
 * 判断某个时间戳是否在10分钟内
 * @param time 时间戳
 */
const in10Minutes = (time: number): boolean => {
    let t = Date.now();
    return t - time <= 1000 * 60 * 10;
}
export const getTurnover = async ctx => {
    const {companyId} = ctx.query;
    let mysql = ctx.db;
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    //从缓存中获取
    let saleInfoKey = ctx.getSaleInfoKey(companyId);
    let saleInfo = await get(saleInfoKey);
    if (saleInfo) {
        saleInfo = JSON.parse(saleInfo);
        //判断缓存有无与数据库的数据合并过
        if (saleInfo.merge) {
            return saleInfo;
        } else {
            //没合并过
            let select_sql = "select money, create_date from turnover where company_id = ? order by create_date desc limit 0, 7";
            let [rows] = await mysql.execute(select_sql, [companyId]);
            let data = each(rows);
            let currentLength = saleInfo.arr.length;
            let temp = data.slice(0, 7 - currentLength);
            temp.forEach(item => {
                saleInfo.arr.unshift({
                    money: item.money,
                    createDate2: formatDate(item.createDate, "yymmdd")
                });
            });
            //标志更新为已经合并过
            saleInfo.merge = true;
            //更新缓存
            ctx.redis.set(saleInfoKey, JSON.stringify(saleInfo));
            return saleInfo;
        }
    } else {
        saleInfo = {
            merge: true,
            arr: []
        };
        //没有缓存，把数据库7天内的营业额放到缓存里
        let select_sql = "select money, create_date from turnover where company_id = ? order by create_date desc limit 0, 7";
        let [rows] = await mysql.execute(select_sql, [companyId]);
        let data = each(rows);
        data.forEach(item => {
            saleInfo.arr.unshift({
                money: item.money,
                createDate2: formatDate(item.createDate, "yymmdd")
            });
        });
        //放置到缓存中
        ctx.redis.set(saleInfoKey, JSON.stringify(saleInfo));
        return saleInfo;
    }
}