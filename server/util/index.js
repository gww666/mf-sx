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
const util = require("util");
const { promisify } = util;
const resModel_1 = require("./resModel");
//编写一个中间件，用来获取post参数
exports.body = () => {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve, reject) => {
            let reg = /\/upload\/.+/;
            let isUpload = reg.test(ctx.path);
            if (ctx.method === "POST" && !isUpload) {
                let body = "";
                ctx.req.on("data", chunk => {
                    body += chunk;
                });
                ctx.req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    ctx.params = JSON.parse(body);
                    resolve();
                }));
            }
            else {
                resolve();
            }
        });
        yield next();
    });
};
//允许跨域
exports.allowCORS = (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    // ctx.set("Access-Control-Allow-Origin", "120.78.221.14,localhost:8080");
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Headers", "X-Requested-With,X-PINGOTHER,Content-Type,sessionid");
    ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    yield next();
});
//校验用户是否登录
exports.validateUser = (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    // console.log("headers", ctx.headers);
    //取得sessionId，判断redis中该key有无过期
    let { sessionid } = ctx.headers;
    if (!sessionid) {
        // ctx.status = 401;
        // ctx.body = "need sign in for todo!";
        ctx.body = new resModel_1.ErrModel([], "登录信息失效", 401);
        return;
    }
    let redis = ctx.redis;
    let get = promisify(redis.get).bind(redis);
    let userInfo = yield get(sessionid);
    if (!userInfo) {
        // ctx.status = 401;
        // ctx.body = "need sign in for todo!";
        ctx.body = new resModel_1.ErrModel([], "登录信息失效", 401);
    }
    else {
        yield next();
    }
});
//时间戳格式化为yy-mm-dd hh-mm格式
exports.formatDate = (time) => {
    if (typeof time === "string")
        time = Number(time);
    let date = new Date(time);
    let year = date.getFullYear();
    let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    let hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
    let minutes = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
    return `${year}-${month}-${day} ${hour}:${minutes}`;
};
exports.isNotUndefined = (data) => {
    return data !== undefined;
};
