import KoaRouter = require("koa-router");
import {SucModel, ErrModel} from "../util/resModel";
import {
    getCompanySettings, 
    updateCompanySettings
} from "../db/model/user";
import {validateUser} from "../util";

const router = new KoaRouter({
    prefix: "/api"
});

router.get("/getSettings", async ctx => {
    try {
        let data = await getCompanySettings(ctx);
        ctx.body = new SucModel(data, "success");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "获取配置信息失败——" + JSON.stringify(err));
    }
});

router.post("/updateSettings", validateUser, async ctx => {
    try {
        await updateCompanySettings(ctx);
        ctx.body = new SucModel([], "success");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "修改配置信息失败——" + JSON.stringify(err));
    }
});

export default router;