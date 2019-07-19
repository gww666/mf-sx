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
const util_1 = require("../../util");
const util = require("util");
const { promisify } = util;
const order_1 = require("./order");
// const getOrderListKey = companyId => {
//     return "orderList-" + companyId;
// }
//每次支付动作动作完成时更新缓存
const updateRedisSaleInfo = (ctx, { orderList }) => __awaiter(this, void 0, void 0, function* () {
    const { companyId, orderNo } = ctx.params;
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let saleInfoKey = ctx.getSaleInfoKey(companyId);
    let goodsDataKey = ctx.getGoodsDataKey(companyId);
    let info = yield get(saleInfoKey);
    // console.log("从redis中获取的缓存", info);
    let goodsData = yield get(goodsDataKey);
    if (!info) {
        // console.log("没有缓存，新建一个对象");
        info = {
            merge: false,
            arr: [
                {
                    createDate2: util_1.formatDate(Date.now(), "yymmdd"),
                    money: ""
                }
            ]
        };
    }
    else {
        info = JSON.parse(info);
    }
    let createDate2 = util_1.formatDate(Date.now(), "yymmdd");
    let index = info.arr.findIndex(item => item.createDate2 === createDate2);
    // console.log("index", index);
    if (index > -1) {
        //直接修改
        info.arr[index].money = (Number(info.arr[index].money) + Number(orderList[orderNo].baseInfo.payment)).toFixed(2);
        // console.log("价格", info.arr[index].money);
    }
    else {
        //向数组末尾推入一个新的元素
        if (info.arr.length > 7) {
            //删除开头的元素
            info.arr.shift();
        }
        info.arr.push({
            createDate2: util_1.formatDate(Date.now(), "yymmdd"),
            money: Number(orderList[orderNo].baseInfo.payment).toFixed(2)
        });
    }
    if (!goodsData) {
        goodsData = {
            merge: false
        };
    }
    else {
        goodsData = JSON.parse(goodsData);
    }
    //更新缓存
    let goodsArray = orderList[orderNo].goodsArray;
    //对其商品信息进行汇总
    goodsArray.forEach(item => {
        for (let goodsItem of item.goods) {
            // goodsData[goodsItem.id] = goodsData[goodsItem.id] ? 
            if (goodsData[goodsItem.goodsId]) {
                goodsData[goodsItem.goodsId].count += goodsItem.count;
            }
            else {
                goodsData[goodsItem.goodsId] = {
                    count: goodsItem.count,
                    title: goodsItem.title
                };
            }
        }
    });
    ctx.redis.set(saleInfoKey, JSON.stringify(info));
    ctx.redis.set(goodsDataKey, JSON.stringify(goodsData));
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
        let orderList = yield order_1.getOrderFromRedis(ctx, { companyId });
        //将该订单信息的数据统计写入缓存
        yield updateRedisSaleInfo(ctx, { orderList });
        //删除缓存中的数据
        delete orderList[orderNo];
        //更新缓存
        let orderListKey = ctx.getOrderListKey(companyId);
        ctx.redis.set(orderListKey, JSON.stringify(orderList));
        //通知客户端更新订单数据
        let _io = global["mIo"];
        _io.in(`room-${companyId}`).emit("orderChange", JSON.stringify(orderList));
        let result = yield mysql.query("COMMIT");
        // console.log("事务操作", result);
    }
    catch (err) {
        console.log("err-执行回滚操作", err);
        yield mysql.query("ROLLBACK");
    }
});
