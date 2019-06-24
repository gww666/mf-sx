const http = require("http");
import koa = require("koa");
import {getDB, getRedis} from "./db/connection";
import {body} from "./util";
import login from "./routers/login";
import goods from "./routers/goods";
import publicRouter from "./routers/public";
import settingsRouter from "./routers/settings";
import orderRouter from "./routers/order";
import socketIo from "socket.io";

const app = new koa();
const server = http.createServer(app.callback());
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
app.use(goods.routes()).use(goods.allowedMethods());
app.use(settingsRouter.routes()).use(settingsRouter.allowedMethods());
app.use(publicRouter.routes()).use(publicRouter.allowedMethods());
app.use(orderRouter.routes()).use(orderRouter.allowedMethods());
let hostname = "172.18.249.80";
let port = "2233";

const io = socketIo.listen(server);
// const shopIds = {};
io.on("connction", sockets => {
    app.use(async (ctx, next) => {
        ctx.sockets = sockets;
        await next();
    });
});
server.listen(port, hostname, () => {
    console.log("mf server is running!");
});
// app.listen(port, hostname, () => {
//     console.log("mf server is running!");
// });