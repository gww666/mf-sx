import {each} from "../common";
import {formatDate, isNotUndefined} from "../../util";
import util = require("util");
const {promisify} = util;
import {getOrderFromRedis} from "./order";

// const getOrderListKey = companyId => {
//     return "orderList-" + companyId;
// }

//每次支付动作动作完成时更新缓存
const updateRedisSaleInfo = async (ctx, {orderList}) => {
    const {companyId, orderNo} = ctx.params;
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let saleInfoKey = ctx.getSaleInfoKey(companyId);
    let goodsDataKey = ctx.getGoodsDataKey(companyId);
    let info = await get(saleInfoKey);
    let goodsData = await get(goodsDataKey);
    if (!info) {
        info = {
            arr: [
                {
                    createDate2: formatDate(Date.now()),
                    money: ""
                }
            ]
        }
    } else {
        info = JSON.parse(info);
    }
    let createDate2 = formatDate(Date.now(), "yymmdd");
    let index = info.arr.findIndex(item => item.createDate2 === createDate2);
    if (index > -1) {
        //直接修改
        info.arr[index].money = (Number(info.arr[index].money) + Number(orderList[orderNo].baseInfo.payment)).toFixed(2)
    } else {
        //向数组末尾推入一个新的元素
        if (info.arr.length > 7) {
            //删除开头的元素
            info.arr.shift();
            info.arr.push({
                createDate2: formatDate(Date.now()),
                money: orderList[orderNo].baseInfo.payment
            });
        }
    }

    if (!goodsData) {
        goodsData = {
            merge: false
        };
    } else {
        goodsData = JSON.parse(goodsData);
    }
    //更新缓存
    let goodsArray = orderList[orderNo].goodsArray;
    //对其商品信息进行汇总
    goodsArray.forEach(item => {
        for (let goodsItem of item.goods) {
            // goodsData[goodsItem.id] = goodsData[goodsItem.id] ? 
            if (goodsData[goodsItem.id]) {
                goodsData[goodsItem.id].count += goodsItem.count;
            } else {
                goodsData[goodsItem.id] = {
                    count: goodsItem.count,
                    title: goodsItem.title
                }
            }
        }
    });
    ctx.redis.set(saleInfoKey, JSON.stringify(orderList));
    ctx.redis.set(goodsDataKey, JSON.stringify(orderList));

}
export const updateOrderInfo = async ctx => {
    let mysql = ctx.db;
    let {orderNo, companyId} = ctx.params;
    // let get = promisify(ctx.redis.get).bind(ctx.redis);
    //开启事务操作
    await mysql.query("START TRANSACTION");
    try {
        //获取支付的金额
        // let payment = orderData.baseInfo.payment;
        let date = Date.now();
        let sql = "update m_order set payment_date = ?, status = ? where order_no = ?";
        await mysql.execute(sql, [date, 2, orderNo]);
        
        let orderList = await getOrderFromRedis(ctx, {companyId});
        //将该订单信息的数据统计写入缓存
        await updateRedisSaleInfo(ctx, {orderList});
        //删除缓存中的数据
        delete orderList[orderNo];
        //更新缓存
        let orderListKey = ctx.getOrderListKey(companyId);
        ctx.redis.set(orderListKey, JSON.stringify(orderList));
        //通知客户端更新订单数据
        let _io = global["mIo"];
        _io.in(`room-${companyId}`).emit("orderChange", JSON.stringify(orderList));
        let result = await mysql.query("COMMIT");
        console.log("事务操作", result);
    } catch (err) {
        console.log("err-执行回滚操作", err);
        await mysql.query("ROLLBACK");
    }
    
}