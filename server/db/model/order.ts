import {each} from "../common";
import {formatDate, isNotUndefined} from "../../util";
import util = require("util");
const {promisify} = util;
import md5 = require("js-md5");
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
const getOrderListKey = companyId => {
    return "orderList-" + companyId;
}
/**
 * 订单数据结构 
 * {
 *     [orderNo]: {
 *         baseInfo: {payment, createDate, updateDate, tableNo},
 *         goodsArray: [
 *             {
 *                 baseInfo: {createDate, tableNo},
 *                 goods: {
 *                     goodsId: {count, price, goodsTitle}
 *                 }
 *             }
 *         ]
 *     }
 * }
 * @param ctx 
 * @param param1 
 */
//将订单数据放到redis中
const insertOrderToRedis = async (ctx, {order, companyId}) => {
    let key = getOrderListKey(companyId);
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let orderList = await get(key);
    if (orderList) {
        orderList = JSON.parse(orderList);//一个对象
        if (orderList[order.orderNo]) {
            let _order = orderList[order.orderNo];
            _order.baseInfo = {
                ..._order.baseInfo,
                payment: order.payment,
                updateDate: order.updateDate
            }
            _order.goodsArray.push({
                baseInfo: {
                    createDate: order.updateDate,
                    tableNo: order.tableNo
                },
                goods: {
                    ...order.goods
                }
            });
        } else { 
            orderList[order.orderNo] = {
                baseInfo: {
                    payment: order.payment,
                    createDate: order.createDate,
                    updateDate: order.updateDate,
                    tableNo: order.tableNo
                },
                goodsArray: [
                    {
                        baseInfo: {
                            createDate: order.updateDate,
                            tableNo: order.tableNo
                        },
                        goods: {
                            ...order.goods
                        }
                    }
                ]
            };
        }
    } else {
        orderList = {
            [order.orderNo]: {
                baseInfo: {
                    payment: order.payment,
                    createDate: order.createDate,
                    updateDate: order.updateDate,
                    tableNo: order.tableNo
                },
                goodsArray: [
                    {
                        baseInfo: {
                            createDate: order.updateDate,
                            tableNo: order.tableNo
                        },
                        goods: {
                            ...order.goods
                        }
                    }
                ]
            }
        };
    }
    ctx.redis.set(key, JSON.stringify(orderList));
}
interface handleRedisOrderParams {
    companyId: string,
    orderNo?: string
}
const getOrderFromRedis = async (ctx, params: handleRedisOrderParams) => {
    let {companyId, orderNo} = params;
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let key = getOrderListKey(companyId);
    let orderList = await get(key);
    return isNotUndefined(orderNo) ? JSON.parse(orderList)[orderNo] : JSON.parse(orderList);
}

const updateOrderFromRedis = async (ctx) => {

}
//生成订单号
const generateOrderNo = async (ctx, {companyId}) => {
    //拿到年月日时分，例如：201910231232
    let time = formatDate(Date.now());
    let arr = time.split(" ");
    time = arr[0].split("-").join("") + arr[1].split(":").join("");
    //去掉前两位，拿到一个10位数的时间值
    time = time.slice(2);
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
    //中间6位随机数随机码
    let id = md5(time + no + companyId).slice(0, 6);
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
    //要插入redis中的订单对象所包含的数据
    let order = {
        orderNo,
        goods: {},
        createDate: 0,
        payment: 0,
        updateDate: 0,
        tableNo
    };
    //生成订单详细记录
    for (let item of goods) {
        const {goodsId, title, price, img, count} = item;
        //叠加订单总价
        payment += Number(price) * count;
        //往缓存对象中追加一条商品记录，只保留必需的字段
        order.goods[goodsId] = {
            count,
            price,
            title
        };
        let sql_detail = "insert into order_detail(id, order_no, goods_id, goods_title, goods_price, goods_count, goods_img) values(?, ?, ?, ?, ?, ?, ?)";
        await mysql.execute(sql_detail, [null, orderNo, goodsId, title, price, count, img]);
    }
    //生成订单记录
    let date = Date.now();
    let createDate2 = formatDate(date).split(" ")[0];
    //补充order对象
    order.createDate = date;
    order.updateDate = date;
    order.payment = payment;
    //存入redis中
    insertOrderToRedis(ctx, {companyId, order});
    let sql = `insert into m_order(id, order_no, company_id, food_type, payment, table_no, status, create_date, create_date2, update_date, payment_date) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await mysql.execute(sql, [null, orderNo, companyId, foodType, payment, tableNo, 1, date, createDate2, date, null]);
    return {
        orderNo,
        tableNo,
        payment,
        companyId,
        foodType,
        createDate2,
        createDate: date,
        updateDate: date,
        paymentDate: null
    }
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

//加菜操作
export const addGoodsForOrder = async ctx => {
    let mysql = ctx.db;
    let {goods, orderNo, companyId} = ctx.params;
    //从缓存中取得该订单号的商品数组
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let orderListKey = getOrderListKey(companyId);
    let value = await get(orderListKey);
    let cache = null;
    let payment = 0;
    //需要往redis中追加的菜品对象
    let goodsForRedis = {};
    let tableNo = "";
    //如果有缓存记录，判断哪些是新增，哪些是更新
    if (value) {
        cache = (JSON.parse(value))[orderNo];//是一个对象
        tableNo = cache.baseInfo.tableNo;
        //设置一个记录缓存原有的菜品的数量
        let countInfo = {};
        //原有菜的钱
        cache.goodsArray.forEach(item => {
            for (let id in item.goods) {
                let {price, count} = item.goods[id];
                // console.log("原有菜", count);
                countInfo[id] = countInfo[id] ? countInfo[id] + count : count;
                payment += Number(price) * count;
            }
        });
        //生成订单详细记录
        for (let item of goods) {
            let {goodsId, title, price, img, count} = item;
            goodsForRedis[goodsId] = {
                title,
                price,
                count
            }
            //判断该订单下有没有该商品
            let exist = false;
            for (let oldItem of cache.goodsArray) {
                for (let id in oldItem.goods) {
                    if (id == goodsId) {
                        exist = true;
                        break;
                    }
                }
            }
            if (!exist) {
                //新增记录
                let sql_detail = "insert into order_detail(id, order_no, goods_id, goods_title, goods_price, goods_count, goods_img) values(?, ?, ?, ?, ?, ?, ?)";
                await mysql.execute(sql_detail, [null, orderNo, goodsId, title, price, count, img]);
            } else {
                //更新数据库
                let sql_detail = "update order_detail set goods_count = ?, goods_price = ? where order_no = ? and goods_id = ?";
                await mysql.execute(sql_detail, [countInfo[goodsId] + count, price, orderNo, goodsId]);
            }
            //新增菜的钱
            payment += Number(price) * count;
        }
    } else {
        console.log("缓存中没有该订单");
        //逻辑待写
    }
    //生成订单记录
    let date = Date.now();
     //更新缓存
    if (cache) {
        let order = {
            orderNo,
            payment,
            updateDate: date,
            goods: goodsForRedis,
            tableNo
        }
        insertOrderToRedis(ctx, {order, companyId});
        // ctx.redis.set(orderNo, JSON.stringify(cache));
    }
    let sql = `update m_order set update_date = ?, payment = ? where order_no = ?`;
    await mysql.execute(sql, [date, payment, orderNo]);
    return {
        orderNo,
        payment,
        updateDate: date
    }
}

//重置订单桌牌号
export const resetTableNo = async ctx => {
    let mysql = ctx.db;
    let {orderNo, tableNo} = ctx.query;
    let sql = `update m_order set table_no = ? where order_no = ?`;
    let result = await mysql.execute(sql, [tableNo, orderNo]);
    console.log("调桌", result);
}

//更新订单信息
export const updateOrder = async ctx => {
    let mysql = ctx.db;
    let {orderNo, tableNo, payment, goods, companyId} = ctx.params;
    let orderList = await getOrderFromRedis(ctx, {companyId});
    let orderData = orderList[orderNo];
    if (!orderData) throw new Error("查无此订单");
    let date = Date.now();
    //根据传的参数进行不同处理
    if (isNotUndefined(payment)) {
        //修改订单金额
        //更新redis里的数据
        let value = orderData.baseInfo.payment = (payment - 0).toFixed(2);
        //更新数据库数据
        let sql = `update m_order set payment = ?, update_date = ? where order_no = ?`;
        await mysql.execute(sql, [value, date, orderNo]);
    } else if (isNotUndefined(tableNo)) {
        //修改桌号
        //更新redis里的数据
        orderData.baseInfo.tableNo = tableNo;
        orderData.goodsArray.forEach(item => {
            item.baseInfo.tableNo = tableNo;
        });
        //更新数据库数据
        let sql = `update m_order set table_no = ?, update_date = ? where order_no = ?`;
        await mysql.execute(sql, [tableNo, date, orderNo]);
    } else if (isNotUndefined(goods)) {
        //修改菜品数据
        //更新redis里的数据
        //type代表操作类型，reduce，replace
        const {index, count, type, goodsId, title, price, img, newGoodsId} = goods;
        //先判断缓存中有无该次加菜
        if (orderData.goodsArray[index]) {
            let goodsObject = orderData.goodsArray[index].goods;
            let goodsItem = goodsObject[goodsId];
            if (type === "reduce") {
                //减菜
                if (goodsItem.count === 1) {
                    //删除该商品
                    delete goodsObject[goodsId];
                    let sql = "delete from order_detail where order_no = ? and goods_id = ?";
                    await mysql.execute(sql, [orderNo, goodsId]);
                } else {
                    goodsItem.count -= 1;
                    let sql = "update order_detail set count = ? where order_no = ? and goods_id = ?";
                    await mysql.execute(sql, [goodsItem.count, orderNo, goodsId]);
                }
            } else if (type === "replace") {
                //先删除要替换的菜品
                delete goodsObject[goodsId];
                goodsObject[newGoodsId] = {
                    count,
                    title,
                    price
                }
                let deltetSql = "delete from order_detail where order_no = ? and goods_id = ?";
                await mysql.execute(deltetSql, [orderNo, goodsId]);
                let insertSql = "insert into order_detail(id, order_no, goods_id, goods_title, goods_count, goods_price, goods_img) values(?, ?, ?, ?, ?, ?, ?)";
                await mysql.execute(insertSql, [null, orderNo, newGoodsId, title, count, price, img || null]);
            }
        }
    }
    //更新修改日期
    orderData.baseInfo.updateDate = date;
    //更新缓存
    let orderListKey = getOrderListKey(companyId);
    ctx.redis.set(orderListKey, JSON.stringify(orderList));
    //通知客户端更新订单数据
    let _io = global["mIo"];
    _io.in(`room-${companyId}`).emit("orderChange", JSON.stringify(orderList));
}