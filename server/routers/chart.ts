import KoadRouter = require("koa-router");
import {SucModel, ErrModel} from "../util/resModel";
import {validateUser} from "../util";
import {getGoodsData, getTurnover} from "../db/model/chart";
const router = new KoadRouter({
    prefix: "/api"
});

router.get("/getGoodsData", validateUser, async ctx => {
    try {
        let data = await getGoodsData(ctx);
        ctx.body = new SucModel([data], "菜品数据统计获取成功");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "菜品数据统计获取失败——" + JSON.stringify(err));
    }
});

router.get("/getTurnover", validateUser, async ctx => {
    try {
        let data = await getTurnover(ctx);
        ctx.body = new SucModel([data], "营业额数据统计获取成功");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "营业额数据统计获取失败——" + JSON.stringify(err));
    }
});

export default router;