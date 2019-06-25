import KoaRouter = require("koa-router");
import util = require("util");
const {promisify} = util;
import {validateUser} from "../util";
import {
    getOrder, 
    insertOrder,
    getOrderList,
    getOrderDetail,
    resetTableNo,
    addGoodsForOrder,
    updateOrder
} from "../db/model/order";
import {SucModel, ErrModel} from "../util/resModel";
let router = new KoaRouter({
    prefix: "/api"
});
//根据企业号、桌号(和日期)查找订单
router.get("/getOrder", async ctx => {
    try {
        let data = await getOrder(ctx);
        ctx.body = new SucModel(data, "success");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "获取订单信息失败——" + JSON.stringify(err));
    }
});

//获取实时订单列表
router.get("/getRTOrder", async ctx => {
    // const sockets = ctx.sockets;
    try {
        let {companyId} = ctx.query;
        let get = promisify(ctx.redis.get).bind(ctx.redis);
        let key = getOrderListKey(companyId);
        let rtOrderData = await get(key);
        let data = JSON.parse(rtOrderData);
        ctx.body = new SucModel([data], "success");
    } catch (err) {
        ctx.body = new ErrModel([], "获取实时订单列表失败——" + JSON.stringify(err));
    }
    
});
const getOrderListKey = companyId => {
    return "orderList-" + companyId;
}
//插入订单或加菜
router.post("/addOrder", async ctx => {
    let {orderNo, companyId} = ctx.params;
    let tag = orderNo ? "加菜" : "插入订单";
    try {
        let data = null;
        if (orderNo) {
            data = await addGoodsForOrder(ctx);
        } else {
            data = await insertOrder(ctx);
        }
        let get = promisify(ctx.redis.get).bind(ctx.redis);
        let key = getOrderListKey(companyId);
        let rtOrderData = await get(key);
        //向客户端发送socket事件
        let _io = global["mIo"];
        _io.in(`room-${companyId}`).emit("orderChange", rtOrderData);
        ctx.body = new SucModel([data], "success");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], `${tag}失败——` + JSON.stringify(err));
    }
});

//根据企业号(和日期)查找订单列表
router.get("/getOrderList", async ctx => {
    try {
        let data = await getOrderList(ctx);
        ctx.body = new SucModel(data, "success");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "获取订单列表失败——" + JSON.stringify(err));
    }
});

//查询订单详情
router.get("/getOrderDetail", async ctx => {
    try {
        let data = await getOrderDetail(ctx);
        ctx.body = new SucModel(data, "success");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "获取订单详情失败——" + JSON.stringify(err));
    }
});

//重置订单桌牌号
router.get("/resetTableNo", validateUser, async ctx => {
    try {
        await resetTableNo(ctx);
        ctx.body = new SucModel([], "success");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "修改订单桌号失败——" + JSON.stringify(err));
    }
});

//更新订单信息
router.post("/updateOrder", validateUser, async ctx => {
    try {
        await updateOrder(ctx);
        ctx.body = new SucModel([], "success");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "修改订单信息失败——" + JSON.stringify(err));
    }
});

export default router;