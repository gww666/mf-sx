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
const koa = require("koa");
const connection_1 = require("./db/connection");
const util_1 = require("./util");
const login_1 = require("./routers/login");
const goods_1 = require("./routers/goods");
const app = new koa();
//全局挂载db
app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
    ctx.db = yield connection_1.getDB();
    ctx.redis = connection_1.getRedis();
    yield next();
}));
//使用body中间件
app.use(util_1.body());
//挂载路由
app.use(login_1.default.routes()).use(login_1.default.allowedMethods());
app.use(goods_1.default.routes()).use(goods_1.default.allowedMethods());
let hostname = "172.18.249.80";
let port = "2233";
app.listen(port, hostname, () => {
    console.log("mf server is running!");
});
