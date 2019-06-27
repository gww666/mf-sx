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
const util = require("util");
const { promisify } = util;
const pay_1 = require("../db/model/pay");
const resModel_1 = require("../util/resModel");
let router = new KoaRouter({
    prefix: "/api"
});
router.post("/pay", (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        //支付成功
        yield pay_1.updateOrderInfo(ctx);
        ctx.body = new resModel_1.SucModel([], "支付成功");
    }
    catch (err) {
        ctx.body = new resModel_1.ErrModel([], "支付失败——" + JSON.stringify(err));
    }
}));
exports.default = router;
