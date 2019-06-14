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
const KoaRouter = require("koa-router");
const order_1 = require("../db/model/order");
const resModel_1 = require("../util/resModel");
let router = new KoaRouter({
    prefix: "/api"
});
//根据企业号、桌号(和日期)查找订单
router.get("/getOrder", (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield order_1.getOrder(ctx);
        ctx.body = new resModel_1.SucModel(data, "success");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "获取订单信息失败——" + JSON.stringify(err));
    }
}));
exports.default = router;
