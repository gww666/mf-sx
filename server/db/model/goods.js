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
const common_1 = require("../common");
//根据企业Id查找分类列表
exports.getCategoryList = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { companyId } = ctx.query;
    let columns = ["id", "company_id", "name", "state", "update_date", "create_date", "sort"].join(",");
    let sql = `select ${columns} from category where company_id = ?`;
    let [rows] = yield mysql.execute(sql, [companyId]);
    return common_1.each(rows);
});
//根据分类id查看某个分类详情
exports.getCategory = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { categoryId } = ctx.query;
    let columns = ["id", "company_id", "name", "state", "update_date", "create_date", "sort"].join(",");
    let sql = `select ${columns} from category where id = ?`;
    let [rows] = yield mysql.execute(sql, [categoryId]);
    return common_1.each(rows);
});
//增加一个分类
exports.insertCategory = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { companyId, name, sort } = ctx.params;
    let sql = `insert into category(id, name, create_date, update_date, state, sort, company_id) values(?, ?, ?, ?, ?, ?, ?)`;
    let date = Date.now();
    yield mysql.execute(sql, [null, name, date, date, 1, sort, companyId]);
});
//修改一个分类
exports.updateCategory = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { name, sort, categoryId, state } = ctx.params;
    console.log("打印updateCategory参数：", name, sort, categoryId, state);
    let sql = `update category set name = ?, sort = ?, state = ?, update_date = ? where id = ?`;
    let date = Date.now();
    yield mysql.execute(sql, [name, sort, state, date, categoryId]);
});
//删除一个分类
exports.deleteCategory = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { categoryId } = ctx.query;
    let sql = `delete from category where id = ?`;
    yield mysql.execute(sql, [categoryId]);
});
//查询商品列表
exports.goodsList = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { companyId, categoryId } = ctx.query;
    let code = "";
    if (categoryId)
        code = " and category_id = ?";
    let sql = `select * from goods where company_id = ?${code}`;
    let params = categoryId ? [companyId, categoryId] : [companyId];
    let [rows] = yield mysql.execute(sql, params);
    return common_1.each(rows);
});
//新增一个商品
exports.insertGoods = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { title, subTitle, images, thumbnail, state, price, salePrice, stock, categoryId, companyId } = ctx.params;
    images = images ? images : "";
    let mainImg = images ? images.split(",")[0] : "";
    thumbnail = thumbnail ? thumbnail : "";
    salePrice = salePrice ? salePrice : null;
    let date = Date.now();
    console.log(title, subTitle, mainImg, images, state, price, salePrice, stock, date, categoryId, companyId);
    let sql = `insert into goods(id, title, sub_title, main_img, thumbnail, images, state, price, sale_price, stock, create_date, update_date, category_id, company_id) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    yield mysql.execute(sql, [null, title, subTitle, mainImg, thumbnail, images, state, price, salePrice, stock, date, date, categoryId, companyId]);
});
//修改一个商品
exports.updateGoods = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { goodsId, title, subTitle, state, images, thumbnail, price, salePrice, stock, categoryId } = ctx.params;
    // console.log("打印updateCategory参数：", name, sort, categoryId, state);
    images = images ? images : "";
    let mainImg = images ? images.split(",")[0] : "";
    thumbnail = thumbnail ? thumbnail : "";
    salePrice = salePrice ? salePrice : null;
    let sql = `update goods set title = ?, sub_title = ?, state = ?, main_img = ?, thumbnail = ?, images = ?, price = ?, sale_price = ?, stock = ?, update_date = ?, category_id = ? where id = ?`;
    let date = Date.now();
    yield mysql.execute(sql, [title, subTitle, state, mainImg, thumbnail, images, price, salePrice, stock, date, categoryId, goodsId]);
});
//删除一个商品
exports.deleteGoods = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { goodsId } = ctx.query;
    let sql = `delete from goods where id = ?`;
    yield mysql.execute(sql, [goodsId]);
});
//根据商品名称模糊查询商品
exports.selectGoodsName = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { keyword } = ctx.query;
    let sql = `select id, title from goods where title like ?`;
    let [rows] = yield mysql.execute(sql, ["%" + keyword + "%"]);
    return common_1.each(rows);
});
//根据id获取某个商品
exports.getGoods = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { goodsId } = ctx.query;
    let sql = `select * from goods where id = ?`;
    let [rows] = yield mysql.execute(sql, [goodsId]);
    return common_1.each(rows);
});
