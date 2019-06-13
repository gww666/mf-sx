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
const resModel_1 = require("../util/resModel");
const user_1 = require("../db/model/user");
const util_1 = require("../util");
const router = new KoaRouter({
    prefix: "/api"
});
router.get("/getSettings", (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield user_1.getCompanySettings(ctx);
        ctx.body = new resModel_1.SucModel(data, "success");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "获取配置信息失败——" + JSON.stringify(err));
    }
}));
router.post("/updateSettings", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield user_1.updateCompanySettings(ctx);
        ctx.body = new resModel_1.SucModel([], "success");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "修改配置信息失败——" + JSON.stringify(err));
    }
}));
exports.default = router;
