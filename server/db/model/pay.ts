import {each} from "../common";
import {formatDate, isNotUndefined} from "../../util";
import util = require("util");
const {promisify} = util;
import {getOrderFromRedis} from "./order";

const getOrderListKey = companyId => {
    return "orderList-" + companyId;
}
export const updateOrderInfo = async ctx => {
    let mysql = ctx.db;
    let {orderNo, companyId} = ctx.params;
    // let get = promisify(ctx.redis.get).bind(ctx.redis);
    
    //获取支付的金额
    // let payment = orderData.baseInfo.payment;
    let date = Date.now();
    let sql = "update m_order set payment_date = ?, status = ? where order_no = ?";
    await mysql.execute(sql, [date, 2, orderNo]);
    //删除缓存中的数据
    let orderList = await getOrderFromRedis(ctx, {companyId});
    delete orderList[orderNo];
    //更新缓存
    let orderListKey = getOrderListKey(companyId);
    ctx.redis.set(orderListKey, JSON.stringify(orderList));
    //通知客户端更新订单数据
    let _io = global["mIo"];
    _io.in(`room-${companyId}`).emit("orderChange", JSON.stringify(orderList));
}