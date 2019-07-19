"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const util_1 = require("../../util");
const util = require("util");
const { promisify } = util;
exports.getGoodsInfo = (ctx) => __awaiter(this, void 0, void 0, function* () {
    //
});
//获取最后一条公司记录
const getLastCompany = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let sql = "select id from company order by id desc limit 0, 1";
    let [rows] = yield mysql.execute(sql);
    return common_1.each[rows][0];
});
//缓存写入持久化存储
const saveCache = (ctx) => __awaiter(this, void 0, void 0, function* () {
    console.log("开始执行缓存写入数据库任务");
    let mysql = ctx.db;
    let { companyId } = yield getLastCompany(ctx);
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let i = -1;
    //开启遍历
    while (i++ <= companyId) {
        let goodsDataKey = ctx.getGoodsDataKey(i);
        let goodsData = yield get(goodsDataKey);
        if (goodsData) {
            // 有该条缓存记录
            // 将其与mysql数据进行合并
            goodsData = JSON.parse(goodsData);
            for (let goodsId in goodsData) {
                if (goodsId === "merge")
                    continue;
                let id = Number(goodsId);
                let sql = "update goods set sale_num = ? where id = ?";
                yield mysql.execute(sql, [goodsData[goodsId].count, id]);
            }
            // goodsData.merge = true;
            // ctx.redis.set(goodsDataKey, JSON.stringify(goodsData));
        }
        //将昨天的营业额写入数据库
        let saleInfoKey = ctx.getSaleInfoKey(i);
        let saleInfo = yield get(saleInfoKey);
        let yestoady = new Date(Date.now() - 1000 * 60 * 60 * 24);
        let yCreateDate2 = util_1.formatDate(yestoady.getTime(), "yymmdd");
        let [year, month, day] = yCreateDate2.split("-");
        let date = Date.now();
        if (saleInfo) {
            saleInfo = JSON.parse(saleInfo);
            let infoItem = saleInfo.arr.find(item => item.createDate2 === yCreateDate2);
            //找到该天的销售额纪录，将其写入数据库
            let money = 0;
            if (infoItem) {
                money = infoItem.money;
            }
            let sql = "insert into turnover(id, year, month, day, money, create_date, company_id) values(?, ?, ?, ?, ?, ?, ?)";
            yield mysql.execute(sql, [null, year, month, day, money, date, companyId]);
        }
        else {
            //没有缓存，营业额就直接存0
            let sql = "insert into turnover(id, year, month, day, money, create_date, company_id) values(?, ?, ?, ?, ?, ?, ?)";
            yield mysql.execute(sql, [null, year, month, day, 0, date, companyId]);
        }
    }
});
exports.startInterval = (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    //从数据库中查询菜品数据做初始化使用
    //持久化存储到mysql数据库中
    // 开启一个定时任务，每天凌晨三点钟更新当天营业额记录和菜品销量纪录
    // 这个定时任务通过一个延时器开启
    //获取当前距离第二天凌晨三点的时间
    let date = new Date();
    let now = date.getTime();
    date.setDate(date.getDate() + 1);
    let future = date.setHours(3, 0, 0, 0);
    let time = future - now;
    setTimeout(() => {
        //开启定时任务
        //执行周期是一天
        let time2 = 1000 * 60 * 60 * 24;
        setInterval(() => {
            saveCache(ctx);
        }, time2);
    }, time);
    yield next();
});
