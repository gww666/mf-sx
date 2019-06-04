import KoadRouter = require("koa-router");
import {getCompanyInfo} from "../db/model/user";
import {SucModel, ErrModel} from "../util/resModel";
import util = require("util");
const {promisify} = util;
let router = new KoadRouter({
    prefix: "/api"
});

//自动登录接口
router.get("/cAutoLogin", async ctx => {
    // console.log("headers", ctx.headers);
    let {sessionid} = ctx.headers;
    if (!sessionid) {
        ctx.body = new ErrModel([], "登录信息失效", 401);
        return;
    }
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let userInfo = await get(sessionid);
    if (userInfo) {
        ctx.body = new SucModel([JSON.parse(userInfo)], "success");
    } else {
        ctx.body = new ErrModel([], "登录信息失效", 401);
    }
});

router.post("/cLogin", async ctx => {
    try {
        let data = await getCompanyInfo(ctx);
        if (!data.length) {
            ctx.body = new ErrModel([], "用户名或密码错误");
            return;
        }
        //存储到redis中
        let redis = ctx.redis;
        let sessionId = "mfurd" + data[0].id;
        data[0].sessionId = sessionId;
        redis.set(sessionId, JSON.stringify(data[0]), "EX", 60 * 60);
        ctx.body = new SucModel(data, "success");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "获取用户信息失败——" + JSON.stringify(err));
    }
});

export default router;