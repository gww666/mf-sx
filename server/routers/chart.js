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
const resModel_1 = require("../util/resModel");
const util_1 = require("../util");
const chart_1 = require("../db/model/chart");
const router = new KoadRouter({
    prefix: "/api"
});
router.get("/getGoodsData", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield chart_1.getGoodsData(ctx);
        ctx.body = new resModel_1.SucModel([data], "菜品数据统计获取成功");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "菜品数据统计获取失败——" + JSON.stringify(err));
    }
}));
router.get("/getTurnover", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield chart_1.getTurnover(ctx);
        ctx.body = new resModel_1.SucModel([data], "营业额数据统计获取成功");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "营业额数据统计获取失败——" + JSON.stringify(err));
    }
}));
exports.default = router;
