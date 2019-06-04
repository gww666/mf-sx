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
const KoadRouter = require("koa-router");
const user_1 = require("../db/model/user");
const resModel_1 = require("../util/resModel");
const util = require("util");
const { promisify } = util;
let router = new KoadRouter({
    prefix: "/api"
});
//自动登录接口
router.get("/cAutoLogin", (ctx) => __awaiter(this, void 0, void 0, function* () {
    // console.log("headers", ctx.headers);
    let { sessionid } = ctx.headers;
    if (!sessionid) {
        ctx.body = new resModel_1.ErrModel([], "登录信息失效", 401);
        return;
    }
    let get = promisify(ctx.redis.get).bind(ctx.redis);
    let userInfo = yield get(sessionid);
    if (userInfo) {
        ctx.body = new resModel_1.SucModel([JSON.parse(userInfo)], "success");
    }
    else {
        ctx.body = new resModel_1.ErrModel([], "登录信息失效", 401);
    }
}));
router.post("/cLogin", (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield user_1.getCompanyInfo(ctx);
        if (!data.length) {
            ctx.body = new resModel_1.ErrModel([], "用户名或密码错误");
            return;
        }
        //存储到redis中
        let redis = ctx.redis;
        let sessionId = "mfurd" + data[0].id;
        data[0].sessionId = sessionId;
        redis.set(sessionId, JSON.stringify(data[0]), "EX", 60 * 60);
        ctx.body = new resModel_1.SucModel(data, "success");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "获取用户信息失败——" + JSON.stringify(err));
    }
}));
exports.default = router;
