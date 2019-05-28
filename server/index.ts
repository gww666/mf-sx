import koa = require("koa");
import {getDB, getRedis} from "./db/connection";
import {body} from "./util";
import login from "./routers/login";

const app = new koa();
//全局挂载db
app.use(async (ctx, next) => {
    ctx.db = await getDB();
    ctx.redis = getRedis();
    await next();
});
//使用body中间件
app.use(body());
//挂载路由
app.use(login.routes()).use(login.allowedMethods());
let hostname = "172.18.249.80";
let port = "2233";
app.listen(port, hostname, () => {
    console.log("mf server is running!");
});