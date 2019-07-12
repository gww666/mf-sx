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
const http = require("http");
const koa = require("koa");
const connection_1 = require("./db/connection");
const util_1 = require("./util");
const login_1 = require("./routers/login");
const goods_1 = require("./routers/goods");
const public_1 = require("./routers/public");
const settings_1 = require("./routers/settings");
const order_1 = require("./routers/order");
const pay_1 = require("./routers/pay");
// import socketIo from "socket.io";
const socketIo = require("socket.io");
const app = new koa();
const server = http.createServer(app.callback());
//全局挂载db
app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
    ctx.db = yield connection_1.getDB();
    ctx.redis = connection_1.getRedis();
    yield next();
}));
//使用body中间件
app.use(util_1.body());
//注册各类获取redis缓存中key值的方法
app.use(util_1.getKeys);
//挂载路由
app.use(login_1.default.routes()).use(login_1.default.allowedMethods());
app.use(goods_1.default.routes()).use(goods_1.default.allowedMethods());
app.use(settings_1.default.routes()).use(settings_1.default.allowedMethods());
app.use(public_1.default.routes()).use(public_1.default.allowedMethods());
app.use(order_1.default.routes()).use(order_1.default.allowedMethods());
app.use(pay_1.default.routes()).use(pay_1.default.allowedMethods());
let hostname = "172.18.249.80";
let port = "2233";
// console.log("socketIo", socketIo);
// console.log("socketIo.listen", socketIo.listen);
// console.log("server", server);
// console.log("server.listen", server.listen);
const io = socketIo.listen(server);
const shopIds = {};
// const getClientIdBySocketId = (SocketId) => {
//     for (let key in shopIds) {
//         if (shopIds[key].id === clientId) {
//             return key;
//         }
//     }
// }
io.on("connection", sockets => {
    sockets.on("disconnect", (reason) => {
        console.log("离开房间", sockets.id, reason);
        sockets.leave(`room-${shopIds[sockets.id]}`);
    });
    console.log("socket.io is connected");
    sockets.on("join", id => {
        shopIds[sockets.id] = id;
        //该商户加入自己的room，方便后续给其发送事件
        sockets.join(`room-${id}`);
    });
});
global["mIo"] = io;
server.listen(port, hostname, () => {
    console.log("mf server is running!");
});
// app.listen(port, hostname, () => {
//     console.log("mf server is running!");
// });
