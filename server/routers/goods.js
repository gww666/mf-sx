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
const goods_1 = require("../db/model/goods");
const resModel_1 = require("../util/resModel");
const util_1 = require("../util");
const router = new KoadRouter({
    prefix: "/api"
});
//根据companyId查询分类
router.get("/categoryList", (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield goods_1.getCategoryList(ctx);
        ctx.body = new resModel_1.SucModel(data, "分类列表查询成功");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "获取分类列表失败——" + JSON.stringify(err));
    }
}));
//添加分类或根据categoryId修改分类
router.post("/wCategory", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    let { categoryId } = ctx.params;
    let tag = categoryId ? "修改" : "新增";
    try {
        if (categoryId) {
            yield goods_1.updateCategory(ctx);
        }
        else {
            yield goods_1.insertCategory(ctx);
        }
        ctx.body = new resModel_1.SucModel([], `分类${tag}成功`);
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], `分类${tag}失败——` + JSON.stringify(err));
    }
}));
//删除一个分类
router.get("/delCategory", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield goods_1.deleteCategory(ctx);
        ctx.body = new resModel_1.SucModel([], "分类删除成功");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "分类删除失败——" + JSON.stringify(err));
    }
}));
//查询商品列表
router.get("/goodsList", (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield goods_1.goodsList(ctx);
        ctx.body = new resModel_1.SucModel(data[0], "商品列表查询成功", data[1]);
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "商品列表查询失败——" + JSON.stringify(err));
    }
}));
//新增或修改一个商品
router.post("/wGoods", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    let { goodsId } = ctx.params;
    let tag = goodsId ? "修改" : "新增";
    try {
        if (goodsId) {
            //编辑
            yield goods_1.updateGoods(ctx);
        }
        else {
            //新增
            yield goods_1.insertGoods(ctx);
        }
        ctx.body = new resModel_1.SucModel([], `商品${tag}成功`);
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], `商品${tag}失败——` + JSON.stringify(err));
    }
}));
//删除一个商品
router.get("/delGoods", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield goods_1.deleteGoods(ctx);
        ctx.body = new resModel_1.SucModel([], "商品删除成功");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "商品删除失败——" + JSON.stringify(err));
    }
}));
//商品名称模糊查询
router.get("/selectGoodsName", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield goods_1.selectGoodsName(ctx);
        ctx.body = new resModel_1.SucModel(data, "查询成功");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "查询失败——" + JSON.stringify(err));
    }
}));
//根据id获取商品名称
router.get("/getGoods", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield goods_1.getGoods(ctx);
        ctx.body = new resModel_1.SucModel(data, "查询成功");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "查询失败——" + JSON.stringify(err));
    }
}));
//获取通用菜品备注
router.get("/getTags", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        let data = yield goods_1.getTags(ctx);
        ctx.body = new resModel_1.SucModel(data, "查询成功");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "通用备注查询失败——" + JSON.stringify(err));
    }
}));
//新增或修改通用菜品备注
router.post("/updateTags", util_1.validateUser, (ctx) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield goods_1.updateTags(ctx);
        ctx.body = new resModel_1.SucModel([], "查询成功");
    }
    catch (err) {
        console.log("err", err);
        ctx.body = new resModel_1.ErrModel([], "通用备注操作失败——" + JSON.stringify(err));
    }
}));
exports.default = router;
