import {each} from "../common";
import {formatDate} from "../../util";
import util = require("util");
const {promisify} = util;
//根据企业号、桌号(和日期)查找订单
export const getOrder = async ctx => {
    let mysql = ctx.db;
    let {companyId, tableNo, createDate2} = ctx.query;
    let code = createDate2 ? " and create_date2 = ?" : "";
    let params = createDate2 ? [companyId, tableNo, createDate2] : [companyId, tableNo]; 
    let sql = `select * from m_order where company_id = ? and table_no = ?${code}`;
    let [rows] = await mysql.execute(sql, params);
    return each(rows);
}

let setNo = (ctx, {key, no}) => {
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
}
//生成订单号
const generateOrderNo = async (ctx, {companyId}) => {
    //拿到年月日时分秒，例如：20191023123234
    let time = formatDate(Date.now());
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
    let no = await get(key);
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
    setNo(ctx, {key, no});
    let orderNo = time + id + no;
    return orderNo;

}

//插入订单
export const insertOrder = async ctx => {
    let mysql = ctx.db;
    let {companyId, tableNo, foodType, goods} = ctx.params;
    let payment = 0;
    let orderNo = await generateOrderNo(ctx, {companyId});
    //生成订单详细记录
    for (let item of goods) {
        const {goodsId, title, price, img, count} = item;
        //叠加订单总价
        payment += Number(price) * count;
        let sql_detail = "insert into order_detail(id, order_no, goods_id, goods_title, goods_price, goods_count, goods_img) values(?, ?, ?, ?, ?, ?, ?)";
        await mysql.execute(sql_detail, [null, orderNo, goodsId, title, price, count, img]);
    }
    //生成订单记录
    let date = Date.now();
    let createDate2 = formatDate(date).split(" ")[0];
    let sql = `insert into m_order(id, order_no, company_id, food_type, payment, table_no, status, create_date, create_date2, update_date, payment_date) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await mysql.execute(sql, [null, orderNo, companyId, foodType, payment, tableNo, 1, date, createDate2, date, null]);
}

//查询订单列表
export const getOrderList = async ctx => {
    let mysql = ctx.db;
    let {companyId, createDate2} = ctx.query;
    let code = createDate2 ? " and create_date2 = ?" : "";
    let params = createDate2 ? [companyId, createDate2] : [companyId]; 
    let sql = `select * from m_order where company_id = ?${code}`;
    let [rows] = await mysql.execute(sql, params);
    return each(rows);
}

//查询订单详情
export const getOrderDetail = async ctx => {
    let mysql = ctx.db;
    let {orderNo} = ctx.query;
    let sql = `select * from order_detail where order_no = ?`;
    let [rows] = await mysql.execute(sql, [orderNo]);
    return each(rows);
}

//重置订单桌牌号
export const resetTableNo = async ctx => {
    let mysql = ctx.db;
    let {orderNo, tableNo} = ctx.query;
    let sql = `update m_order set table_no = ? where order_no = ?`;
    let [rows] = await mysql.execute(sql, [tableNo, orderNo]);
    return each(rows);
}