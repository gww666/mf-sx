import KoaRouter = require("koa-router");
import {getOrder} from "../db/model/order";
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

export default router;