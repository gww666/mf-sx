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
const md5 = require("js-md5");
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
const getOrderListKey = companyId => {
    return "orderList-" + companyId;
};
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
const insertOrderToRedis = (ctx, { order, companyId }) => __awaiter(this, void 0, void 0, function* () {
    let key = getOrderListKey(companyId);
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let orderList = yield get(key);
    if (orderList) {
        orderList = JSON.parse(orderList); //一个对象
        if (orderList[order.orderNo]) {
            let _order = orderList[order.orderNo];
            _order.baseInfo = Object.assign({}, _order.baseInfo, { payment: order.payment, updateDate: order.updateDate });
            _order.goodsArray.push({
                baseInfo: {
                    createDate: order.updateDate,
                    tableNo: order.tableNo
                },
                // goods: {
                //     ...order.goods
                // }
                goods: [
                    ...order.goods
                ]
            });
        }
        else {
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
                        // goods: {
                        //     ...order.goods
                        // }
                        goods: [
                            ...order.goods
                        ]
                    }
                ]
            };
        }
    }
    else {
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
                        // goods: {
                        //     ...order.goods
                        // }
                        goods: [
                            ...order.goods
                        ]
                    }
                ]
            }
        };
    }
    ctx.redis.set(key, JSON.stringify(orderList));
});
exports.getOrderFromRedis = (ctx, params) => __awaiter(this, void 0, void 0, function* () {
    let { companyId, orderNo } = params;
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let key = getOrderListKey(companyId);
    let orderList = yield get(key);
    return util_1.isNotUndefined(orderNo) ? JSON.parse(orderList)[orderNo] : JSON.parse(orderList);
});
//生成订单号
const generateOrderNo = (ctx, { companyId }) => __awaiter(this, void 0, void 0, function* () {
    //拿到年月日时分，例如：201910231232
    let time = util_1.formatDate(Date.now());
    let arr = time.split(" ");
    time = arr[0].split("-").join("") + arr[1].split(":").join("");
    //去掉前两位，拿到一个10位数的时间值
    time = time.slice(2);
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
    //中间6位随机数随机码
    let id = md5(time + no + companyId).slice(0, 6);
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
    //要插入redis中的订单对象所包含的数据
    let order = {
        orderNo,
        // goods: {},
        goods: [],
        createDate: 0,
        payment: "0.00",
        updateDate: 0,
        tableNo
    };
    //生成订单详细记录
    //因为item可能面临有相同goodsId的情况
    //这里要做下记录
    let c = {};
    for (let item of goods) {
        const { goodsId, title, price, img, count, tag } = item;
        c.goodsId = util_1.isNotUndefined(c.goodsId) ? c.goodsId + count : count;
        //叠加订单总价
        payment += Number(price) * count;
        //往缓存对象中追加一条商品记录，只保留必需的字段
        // order.goods[goodsId] = {
        //     count,
        //     price,
        //     title
        // };
        order.goods.push({
            goodsId,
            count,
            price,
            title,
            tag
        });
        if (c.goodsId > count) {
            //代表已经插入过了，更新数量
            let sql_update_detail = "update order_detail set goods_count = ? where order_no = ? and goods_id = ?";
            yield mysql.execute(sql_update_detail, [c.goodsId, orderNo, goodsId]);
        }
        else {
            //新增
            let sql_insert_detail = "insert into order_detail(id, order_no, goods_id, goods_title, goods_price, goods_count, goods_img) values(?, ?, ?, ?, ?, ?, ?)";
            yield mysql.execute(sql_insert_detail, [null, orderNo, goodsId, title, price, count, img]);
        }
    }
    //生成订单记录
    let date = Date.now();
    let createDate2 = util_1.formatDate(date).split(" ")[0];
    let paymentValue = payment.toFixed(2);
    //补充order对象
    order.createDate = date;
    order.updateDate = date;
    order.payment = paymentValue;
    //存入redis中
    insertOrderToRedis(ctx, { companyId, order });
    let sql = `insert into m_order(id, order_no, company_id, food_type, payment, table_no, status, create_date, create_date2, update_date, payment_date) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    yield mysql.execute(sql, [null, orderNo, companyId, foodType, paymentValue, tableNo, 1, date, createDate2, date, null]);
    return {
        orderNo,
        tableNo,
        payment: paymentValue,
        companyId,
        foodType,
        createDate2,
        createDate: date,
        updateDate: date,
        paymentDate: null
    };
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
//加菜操作
exports.addGoodsForOrder = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { goods, orderNo, companyId } = ctx.params;
    //从缓存中取得该订单号的商品数组
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let orderListKey = getOrderListKey(companyId);
    let value = yield get(orderListKey);
    let cache = null;
    let payment = 0;
    //需要往redis中追加的菜品对象
    // let goodsForRedis = {};
    let goodsForRedis = [];
    let tableNo = "";
    //如果有缓存记录，判断哪些是新增，哪些是更新
    if (value) {
        cache = (JSON.parse(value))[orderNo]; //是一个对象
        tableNo = cache.baseInfo.tableNo;
        //设置一个记录缓存原有的菜品的数量
        let countInfo = {};
        //原有菜的钱
        cache.goodsArray.forEach(item => {
            // for (let id in item.goods) {
            //     let {price, count} = item.goods[id];
            //     // console.log("原有菜", count);
            //     countInfo[id] = countInfo[id] ? countInfo[id] + count : count;
            //     payment += Number(price) * count;
            // }
            for (let goodsItem of item.goods) {
                let { price, count, goodsId } = goodsItem;
                countInfo[goodsId] = util_1.isNotUndefined(countInfo[goodsId]) ? countInfo[goodsId] + count : count;
                payment += Number(price) * count;
            }
        });
        //生成订单详细记录
        for (let item of goods) {
            let { goodsId, title, price, img, count } = item;
            // goodsForRedis[goodsId] = {
            //     title,
            //     price,
            //     count
            // }
            goodsForRedis.push({
                goodsId,
                title,
                price,
                count
            });
            //判断该订单下有没有该商品
            let exist = false;
            for (let oldItem of cache.goodsArray) {
                for (let goodsItem of oldItem.goods) {
                    if (goodsItem.goodsId == goodsId) {
                        exist = true;
                        break;
                    }
                }
            }
            if (!exist) {
                //新增记录
                let sql_detail = "insert into order_detail(id, order_no, goods_id, goods_title, goods_price, goods_count, goods_img) values(?, ?, ?, ?, ?, ?, ?)";
                yield mysql.execute(sql_detail, [null, orderNo, goodsId, title, price, count, img]);
            }
            else {
                //更新数据库
                let sql_detail = "update order_detail set goods_count = ?, goods_price = ? where order_no = ? and goods_id = ?";
                yield mysql.execute(sql_detail, [countInfo[goodsId] + count, price, orderNo, goodsId]);
            }
            //新增菜的钱
            payment += Number(price) * count;
        }
    }
    else {
        console.log("缓存中没有该订单");
        //逻辑待写
    }
    //生成订单记录
    let date = Date.now();
    let paymentValue = payment.toFixed(2);
    //更新缓存
    if (cache) {
        let order = {
            orderNo,
            payment: paymentValue,
            updateDate: date,
            goods: goodsForRedis,
            tableNo
        };
        insertOrderToRedis(ctx, { order, companyId });
        // ctx.redis.set(orderNo, JSON.stringify(cache));
    }
    let sql = `update m_order set update_date = ?, payment = ? where order_no = ?`;
    yield mysql.execute(sql, [date, paymentValue, orderNo]);
    return {
        orderNo,
        payment: paymentValue,
        updateDate: date
    };
});
//重置订单桌牌号
exports.resetTableNo = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { orderNo, tableNo } = ctx.query;
    let sql = `update m_order set table_no = ? where order_no = ?`;
    let result = yield mysql.execute(sql, [tableNo, orderNo]);
    console.log("调桌", result);
});
//更新订单信息
exports.updateOrder = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { orderNo, tableNo, payment, goods, companyId } = ctx.params;
    let orderList = yield exports.getOrderFromRedis(ctx, { companyId });
    let orderData = orderList[orderNo];
    if (!orderData)
        throw new Error("查无此订单");
    let date = Date.now();
    //根据传的参数进行不同处理
    if (util_1.isNotUndefined(payment)) {
        //修改订单金额
        //更新redis里的数据
        let value = orderData.baseInfo.payment = (payment - 0).toFixed(2);
        //更新数据库数据
        let sql = `update m_order set payment = ?, update_date = ? where order_no = ?`;
        yield mysql.execute(sql, [value, date, orderNo]);
    }
    else if (util_1.isNotUndefined(tableNo)) {
        //修改桌号
        //更新redis里的数据
        orderData.baseInfo.tableNo = tableNo;
        orderData.goodsArray.forEach(item => {
            item.baseInfo.tableNo = tableNo;
        });
        //更新数据库数据
        let sql = `update m_order set table_no = ?, update_date = ? where order_no = ?`;
        yield mysql.execute(sql, [tableNo, date, orderNo]);
    }
    else if (util_1.isNotUndefined(goods)) {
        //修改菜品数据
        //更新redis里的数据
        //type代表操作类型，reduce，replace
        const { index, count, type, goodsId, title, price, img, newGoodsId, tag } = goods;
        //先判断缓存中有无该次加菜
        if (orderData.goodsArray[index]) {
            let goodsObject = orderData.goodsArray[index].goods;
            let goodsItem = null;
            //找到该商品
            let i = 0;
            for (let _goodsItem of goodsObject) {
                if (goodsId === _goodsItem.goodsId && tag === _goodsItem.tag) {
                    goodsItem = _goodsItem;
                    break;
                }
                i++;
            }
            if (type === "reduce") {
                //减菜
                if (goodsItem.count === 1) {
                    //删除该商品
                    // delete goodsObject[goodsId];
                    goodsObject.splice(i, 1);
                    // if (!Object.keys(goodsObject).length) {
                    if (!goodsObject.length) {
                        //该加菜组别中已经没有菜了，需要删除该次加菜记录
                        orderData.goodsArray.splice(index, 1);
                    }
                    let restCount = 0;
                    //这里需要判断数据库订单详情表中该订单下其他组别是否还有该商品
                    for (let oldItem of orderData.goodsArray) {
                        for (let _goodsItem of oldItem.goods) {
                            if (_goodsItem.goodsId == goodsId) {
                                restCount += _goodsItem.count;
                            }
                        }
                    }
                    if (restCount) {
                        //更新数据库
                        let sql_detail = "update order_detail set goods_count = ? where order_no = ? and goods_id = ?";
                        yield mysql.execute(sql_detail, [restCount, orderNo, goodsId]);
                    }
                    else {
                        //删除记录
                        let deltetSql = "delete from order_detail where order_no = ? and goods_id = ?";
                        yield mysql.execute(deltetSql, [orderNo, goodsId]);
                    }
                    // let sql = "delete from order_detail where order_no = ? and goods_id = ?";
                    // await mysql.execute(sql, [orderNo, goodsId]);
                }
                else {
                    goodsItem.count -= 1;
                    let sql = "update order_detail set goods_count = ? where order_no = ? and goods_id = ?";
                    yield mysql.execute(sql, [goodsItem.count, orderNo, goodsId]);
                }
            }
            else if (type === "replace") {
                console.log("换菜");
                //先删除要替换的菜品
                //更新要存入缓存的数据
                // delete goodsObject[goodsId];
                goodsObject.splice(i, 1);
                //判断替换后的菜，原数组中是否已经有了
                let i2 = goodsObject.findIndex(_goodsItem => {
                    return newGoodsId === _goodsItem.goodsId && tag === _goodsItem.tag;
                });
                if (i2 > -1) {
                    goodsObject[i2].count += count;
                    goodsObject[i2].price = price;
                }
                else {
                    goodsObject.push({
                        goodsId: newGoodsId,
                        count,
                        title,
                        price
                    });
                }
                //这里需要判断数据库订单详情表中该订单下其他组别是否还有该商品
                let restCount = 0; //被替换的菜的剩余数量
                let totalCount = 0; //替换后的菜的数量
                for (let oldItem of orderData.goodsArray) {
                    for (let _goodsItem of oldItem.goods) {
                        if (_goodsItem.goodsId == goodsId) {
                            restCount += _goodsItem.count;
                        }
                        else if (_goodsItem.goodsId == newGoodsId) {
                            //已经有该新增的菜了
                            totalCount += _goodsItem.count;
                        }
                    }
                }
                console.log("restCount", restCount);
                console.log("totalCount", totalCount);
                //处理数据库中被替换的菜
                if (restCount) {
                    console.log("处理数据库中被替换的菜--更新数据库");
                    //更新数据库
                    let sql_detail = "update order_detail set goods_count = ? where order_no = ? and goods_id = ?";
                    yield mysql.execute(sql_detail, [restCount, orderNo, goodsId]);
                }
                else {
                    //删除记录
                    console.log("处理数据库中被替换的菜--删除记录");
                    let deltetSql = "delete from order_detail where order_no = ? and goods_id = ?";
                    yield mysql.execute(deltetSql, [orderNo, goodsId]);
                }
                //处理数据库中替换后的菜
                if (totalCount === count) {
                    console.log("处理数据库中替换后的菜--新增记录");
                    //数量没变化，说明是新增
                    let insertSql = "insert into order_detail(id, order_no, goods_id, goods_title, goods_count, goods_price, goods_img) values(?, ?, ?, ?, ?, ?, ?)";
                    yield mysql.execute(insertSql, [null, orderNo, newGoodsId, title, count, price, img || null]);
                }
                else {
                    console.log("处理数据库中替换后的菜--更新记录");
                    //数量变化了（增多了），代表是更新
                    let sql_detail = "update order_detail set goods_count = ?, goods_price = ? where order_no = ? and goods_id = ?";
                    yield mysql.execute(sql_detail, [totalCount, price, orderNo, goodsId]);
                }
            }
            //重新计算订单金额
            payment = 0;
            orderData.goodsArray.forEach(obj => {
                for (let _goodsItem of obj.goods) {
                    payment += _goodsItem.price * _goodsItem.count;
                }
            });
            payment = payment.toFixed(2);
            //更新缓存数据
            orderData.baseInfo.payment = payment;
            //更新数据库数据
            let sql = `update m_order set payment = ?, update_date = ? where order_no = ?`;
            yield mysql.execute(sql, [payment, date, orderNo]);
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
});
