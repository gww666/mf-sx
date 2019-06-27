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
const util = require("util");
const { promisify } = util;
const order_1 = require("./order");
const getOrderListKey = companyId => {
    return "orderList-" + companyId;
};
exports.updateOrderInfo = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { orderNo, companyId } = ctx.params;
    // let get = promisify(ctx.redis.get).bind(ctx.redis);
    //获取支付的金额
    // let payment = orderData.baseInfo.payment;
    let date = Date.now();
    let sql = "update m_order set payment_date = ?, status = ? where order_no = ?";
    yield mysql.execute(sql, [date, 2, orderNo]);
    //删除缓存中的数据
    let orderList = yield order_1.getOrderFromRedis(ctx, { companyId });
    delete orderList[orderNo];
    //更新缓存
    let orderListKey = getOrderListKey(companyId);
    ctx.redis.set(orderListKey, JSON.stringify(orderList));
    //通知客户端更新订单数据
    let _io = global["mIo"];
    _io.in(`room-${companyId}`).emit("orderChange", JSON.stringify(orderList));
});
