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
const updateRedisSaleInfo = (ctx, { orderList }) => __awaiter(this, void 0, void 0, function* () {
    const { companyId, orderNo } = ctx.params;
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let saleInfoKey = "saleInfo-" + companyId;
    let info = yield get(saleInfoKey);
    if (info) {
        info = JSON.parse(info);
        /**
         * {
         *  total: 0,
         *  goodsArray: {
         *      goodsId: {count: 0, title: ""}
         * }
         * }
         */
        //获取该笔支付的订单的信息
        info.total = (Number(info.total) + Number(orderList[orderNo].baseInfo.payment)).toFixed(2);
        let goodsArray = orderList[orderNo].goodsArray;
        //对其商品信息进行汇总
        goodsArray.forEach(item => {
            for (let key in item.goods) {
                if (info.goodsArray[key]) {
                    info.goodsArray[key].count += item.goods[key].count;
                }
                else {
                    info.goodsArray[key] = {
                        count: item.goods[key].count,
                        title: item.goods[key].title
                    };
                }
            }
        });
    }
});
exports.updateOrderInfo = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { orderNo, companyId } = ctx.params;
    // let get = promisify(ctx.redis.get).bind(ctx.redis);
    //开启事务操作
    yield mysql.query("START TRANSACTION");
    try {
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
        let result = yield mysql.query("COMMIT");
        console.log("事务操作", result);
    }
    catch (err) {
        console.log("err-执行回滚操作", err);
        yield mysql.query("ROLLBACK");
    }
});
