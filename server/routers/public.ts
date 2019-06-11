import KoaRouter = require("koa-router");
import mime from "../util/mime";
import path = require("path");
import fs = require("fs");
const router = new KoaRouter({
    prefix: "/public"
});

router.get("/upload/:img", ctx => {
    ctx.respond = false;
    //获取后缀名
    let parseObj = path.parse(ctx.url);
    // console.log("parseObj", parseObj);
    let ext = parseObj.ext;
    let fileName = parseObj.base;
    // ctx.res.end("lalalala");
    // return;
    ctx.res.statusCode = 200;
    ctx.res.setHeader("Content-Type", mime[ext] || mime[".txt"]);
    ctx.res.setHeader("Cache-Control", `max-age=${1 * 60 * 60 * 24 * 30}`);
    // ctx.res.writeHead(200, {
    //     "cache-control": `max-age=${1 * 60 * 60 * 24 * 30}`,//30天内不再请求服务端
    //     "content-type": mime[ext] || mime[".txt"]
    // });
    let _path = path.resolve(__dirname, `../upload/${fileName}`);
    let readStream = fs.createReadStream(_path);
    readStream.pipe(ctx.res);
    // ctx.set("max-age", `max-age=${1 * 60 * 60 * 24 * 30}`);
    // ctx.setHeader("content-type", mime[ext] || mime[".txt"]);
    // ctx.body = 
});

export default router;