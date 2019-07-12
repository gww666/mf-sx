import {each} from "../common";
import {formatDate, isNotUndefined} from "../../util";
import util = require("util");
const {promisify} = util;

export const getGoodsData = async ctx => {
    const {companyId} = ctx.params;
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
            let sql = "select id, sale_num from goods where companyId = ?";
            let [rows] = await mysql.execute(sql, companyId);
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
        //没有缓存
        //查询数据库
        let sql = "select id, title, sale_num from goods where companyId = ?";
        let [rows] = await mysql.execute(sql, companyId);
        let list = each(rows);
        list.forEach(item => {
            goodsData[item.id] = {
                count: item.sale_num,
                title: item.title
            };
        });
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
    const {companyId} = ctx.params;
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    //从缓存中获取
    let saleInfoKey = ctx.getSalInfoKey(companyId);
    let saleInfo = await get(saleInfoKey);
    if (saleInfo) {
        saleInfo = JSON.parse(saleInfo);
        return saleInfo;
        // //有缓存，查看时间戳是否在10分钟内重复请求
        
        // if (isNotUndefined(saleInfo.time) && in10Minutes(saleInfo.time)) {
        //     //重复请求，直接返回缓存
        //     return saleInfo;
        // } else {
        //     //没有时间戳或时间戳已经超过了10分钟
        //     //从服务器中取得数据
        // }
    }
    return null;
}