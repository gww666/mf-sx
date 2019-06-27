import KoaRouter = require("koa-router");
import util = require("util");
const {promisify} = util;
import {updateOrderInfo} from "../db/model/pay";
import {SucModel, ErrModel} from "../util/resModel";
let router = new KoaRouter({
    prefix: "/api"
});

router.post("/pay", async ctx => {
    try {
        //支付成功
        await updateOrderInfo(ctx);
        ctx.body = new SucModel([], "支付成功");
    } catch (err) {
        ctx.body = new ErrModel([], "支付失败——" + JSON.stringify(err));
    }
});

export default router;