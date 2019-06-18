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
//根据企业号、桌号(和日期)查找订单
exports.getOrder = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { companyId, tableNo, createDate2 } = ctx.query;
    let code = createDate2 ? " and create_date2 = ?" : "";
    let params = createDate2 ? [companyId, tableNo, createDate2] : [companyId, tableNo];
    let sql = `select * from m_order where company_id = ? and table_no = ?${code}`;
    let [rows] = yield mysql.execute(sql, params);
    return common_1.each(rows);
});
let setNo = (ctx, { key, no }) => {
    //存到redis中，默认当天24：00
    //获取当前到24：00剩余的毫秒数
    let current = Date.now();
    let today24Oclock = new Date().setHours(24, 0, 0, 0);
    let restTime = today24Oclock - current;
    // if (current - todayThreeOclock < 0) {
    //     //在当天00:00 ~ 03:00之内
    //     restTime = todayThreeOclock - current;
    // } else {
    //     //已经超过了当天凌晨3点，所以过期时间为次天凌晨三点
    //     let d = new Date();
    //     d.setDate(new Date().getDate() + 1);
    //     restTime = d.setHours(3, 0, 0, 0) - current;
    // }
    ctx.redis.set(key, no, "PX", restTime);
};
//生成订单号
const generateOrderNo = (ctx, { companyId }) => __awaiter(this, void 0, void 0, function* () {
    //拿到年月日时分秒，例如：20191023123234
    let time = util_1.formatDate(Date.now());
    let arr = time.split(" ");
    time = arr[0].split("-").join("") + arr[1].split(":").join("");
    //两位随机码
    let code = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D"];
    let id = code[parseInt(Math.random() * code.length + "")] + code[parseInt(Math.random() * code.length + "")];
    //拿到当天流水号
    //获取当前企业id在缓存中的当天流水号
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let suffix = "-no";
    let key = companyId + suffix;
    let no = yield get(key);
    if (!no) {
        //如果没有no，证明这是当天第一单
        no = "0000";
    }
    //加一操作
    no = (Number(no) + 1) + "";
    let length = 4 - no.length;
    for (let i = 0; i < length; i++) {
        no = "0" + no;
    }
    setNo(ctx, { key, no });
    let orderNo = time + id + no;
    return orderNo;
});
//插入订单
exports.insertOrder = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { companyId, tableNo, foodType, goods } = ctx.params;
    let payment = 0;
    let orderNo = yield generateOrderNo(ctx, { companyId });
    //生成订单详细记录
    for (let item of goods) {
        const { goodsId, title, price, img, count } = item;
        //叠加订单总价
        payment += Number(price) * count;
        let sql_detail = "insert into order_detail(id, order_no, goods_id, goods_title, goods_price, goods_count, goods_img) values(?, ?, ?, ?, ?, ?, ?)";
        yield mysql.execute(sql_detail, [null, orderNo, goodsId, title, price, count, img]);
    }
    //生成订单记录
    let date = Date.now();
    let createDate2 = util_1.formatDate(date).split(" ")[0];
    let sql = `insert into m_order(id, order_no, company_id, food_type, payment, table_no, status, create_date, create_date2, update_date, payment_date) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    yield mysql.execute(sql, [null, orderNo, companyId, foodType, payment, tableNo, 1, date, createDate2, date, null]);
});
//查询订单列表
exports.getOrderList = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { companyId, createDate2 } = ctx.query;
    let code = createDate2 ? " and create_date2 = ?" : "";
    let params = createDate2 ? [companyId, createDate2] : [companyId];
    let sql = `select * from m_order where company_id = ?${code}`;
    let [rows] = yield mysql.execute(sql, params);
    return common_1.each(rows);
});
//查询订单详情
exports.getOrderDetail = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { orderNo } = ctx.query;
    let sql = `select * from order_detail where order_no = ?`;
    let [rows] = yield mysql.execute(sql, [orderNo]);
    return common_1.each(rows);
});
