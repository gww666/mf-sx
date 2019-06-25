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
const KoaRouter = require("koa-router");
const util = require("util");
const { promisify } = util;
const util_1 = require("../util");
const order_1 = require("../db/model/order");
const resModel_1 = require("../util/resModel");
let router = new KoaRouter({
    prefix: "/api"
});
//根据企业号、桌号(和日期)查找订单
router.get("/getOrder", (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield order_1.getOrder(ctx);
        ctx.body = new resModel_1.SucModel(data, "success");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "获取订单信息失败——" + JSON.stringify(err));
    }
}));
//获取实时订单列表
router.get("/getRTOrder", (ctx) => __awaiter(this, void 0, void 0, function* () {
    // const sockets = ctx.sockets;
    try {
        let { companyId } = ctx.query;
        let get = promisify(ctx.redis.get).bind(ctx.redis);
        let key = getOrderListKey(companyId);
        let rtOrderData = yield get(key);
        let data = JSON.parse(rtOrderData);
        ctx.body = new resModel_1.SucModel([data], "success");
    }
    catch (err) {
        ctx.body = new resModel_1.ErrModel([], "获取实时订单列表失败——" + JSON.stringify(err));
    }
}));
const getOrderListKey = companyId => {
    return "orderList-" + companyId;
};
//插入订单或加菜
router.post("/addOrder", (ctx) => __awaiter(this, void 0, void 0, function* () {
    let { orderNo, companyId } = ctx.params;
    let tag = orderNo ? "加菜" : "插入订单";
    try {
        let data = null;
        if (orderNo) {
            data = yield order_1.addGoodsForOrder(ctx);
        }
        else {
            data = yield order_1.insertOrder(ctx);
        }
        let get = promisify(ctx.redis.get).bind(ctx.redis);
        let key = getOrderListKey(companyId);
        let rtOrderData = yield get(key);
        //向客户端发送socket事件
        let _io = global["mIo"];
        _io.in(`room-${companyId}`).emit("orderChange", rtOrderData);
        ctx.body = new resModel_1.SucModel([data], "success");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], `${tag}失败——` + JSON.stringify(err));
    }
}));
//根据企业号(和日期)查找订单列表
router.get("/getOrderList", (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield order_1.getOrderList(ctx);
        ctx.body = new resModel_1.SucModel(data, "success");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "获取订单列表失败——" + JSON.stringify(err));
    }
}));
//查询订单详情
router.get("/getOrderDetail", (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield order_1.getOrderDetail(ctx);
        ctx.body = new resModel_1.SucModel(data, "success");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "获取订单详情失败——" + JSON.stringify(err));
    }
}));
//重置订单桌牌号
router.get("/resetTableNo", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield order_1.resetTableNo(ctx);
        ctx.body = new resModel_1.SucModel([], "success");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "修改订单桌号失败——" + JSON.stringify(err));
    }
}));
//更新订单信息
router.post("/updateOrder", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield order_1.updateOrder(ctx);
        ctx.body = new resModel_1.SucModel([], "success");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "修改订单信息失败——" + JSON.stringify(err));
    }
}));
exports.default = router;
