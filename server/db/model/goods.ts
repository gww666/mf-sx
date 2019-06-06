import {each} from "../common";

//根据企业Id查找分类列表
export const getCategoryList = async ctx => {
    let mysql = ctx.db;
    let {companyId} = ctx.query;
    let columns = ["id", "company_id", "name", "state", "update_date", "create_date", "sort"].join(",");
    let sql = `select ${columns} from category where company_id = ?`;
    let [rows] = await mysql.execute(sql, [companyId]);
    return each(rows);
}

//根据分类id查看某个分类详情
export const getCategory = async ctx => {
    let mysql = ctx.db;
    let {categoryId} = ctx.query;
    let columns = ["id", "company_id", "name", "state", "update_date", "create_date", "sort"].join(",");
    let sql = `select ${columns} from category where id = ?`;
    let [rows] = await mysql.execute(sql, [categoryId]);
    return each(rows);
}

//增加一个分类
export const insertCategory = async ctx => {
    let mysql = ctx.db;
    let {companyId, name, sort} = ctx.params;
    let sql = `insert into category(id, name, create_date, update_date, state, sort, company_id) values(?, ?, ?, ?, ?, ?, ?)`;
    let date = Date.now();
    await mysql.execute(sql, [null, name, date, date, 1, sort, companyId]);
}

//修改一个分类
export const updateCategory = async ctx => {
    let mysql = ctx.db;
    let {name, sort, categoryId, state} = ctx.params;
    console.log("打印updateCategory参数：", name, sort, categoryId, state);
    
    let sql = `update category set name = ?, sort = ?, state = ?, update_date = ? where id = ?`;
    let date = Date.now();
    await mysql.execute(sql, [name, sort, state, date, categoryId]);
}

//删除一个分类
export const deleteCategory = async ctx => {
    let mysql = ctx.db;
    let {categoryId} = ctx.query;
    let sql = `delete from category where id = ?`;
    await mysql.execute(sql, [categoryId]);
}

//查询商品列表
export const goodsList = async ctx => {
    let mysql = ctx.db;
    let {companyId, categoryId, pageNum, pageSize} = ctx.query;
    let code = "";
    if (categoryId) code = " and category_id = ?"
    if (pageNum && pageSize) {
        let start = (pageNum - 1) * pageSize;
        code += ` limit ${start}, ${pageSize}`;
    }
    let sql = `select SQL_CALC_FOUND_ROWS * from goods where company_id = ?${code}`;
    let params = categoryId ? [companyId, categoryId] : [companyId];
    let [rows] = await mysql.execute(sql, params);
    let sql2 = "SELECT FOUND_ROWS() as total";
    let [rows2] = await mysql.execute(sql2);
    return [each(rows), rows2[0].total];
}

//新增一个商品
export const insertGoods = async ctx => {
    let mysql = ctx.db;
    let {title, subTitle, images, thumbnail, state, price, salePrice, stock, categoryId, companyId} = ctx.params;
    images = images ? images : "";
    let mainImg = images ? images.split(",")[0] : "";
    thumbnail = thumbnail ? thumbnail : "";
    salePrice = salePrice ? salePrice : null;
    let date = Date.now();
    console.log(title, subTitle, mainImg, images, state, price, salePrice, stock, date, categoryId, companyId);
    let sql = `insert into goods(id, title, sub_title, main_img, thumbnail, images, state, price, sale_price, stock, create_date, update_date, category_id, company_id) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await mysql.execute(sql, [null, title, subTitle, mainImg, thumbnail, images, state, price, salePrice, stock, date, date, categoryId, companyId]);
}

//修改一个商品
export const updateGoods = async ctx => {
    let mysql = ctx.db;
    let {goodsId, title, subTitle, state, images, thumbnail, price, salePrice, stock, categoryId} = ctx.params;
    // console.log("打印updateCategory参数：", name, sort, categoryId, state);
    images = images ? images : "";
    let mainImg = images ? images.split(",")[0] : "";
    thumbnail = thumbnail ? thumbnail : "";
    salePrice = salePrice ? salePrice : null;
    let sql = `update goods set title = ?, sub_title = ?, state = ?, main_img = ?, thumbnail = ?, images = ?, price = ?, sale_price = ?, stock = ?, update_date = ?, category_id = ? where id = ?`;
    let date = Date.now();
    await mysql.execute(sql, [title, subTitle, state, mainImg, thumbnail, images, price, salePrice, stock, date, categoryId, goodsId]);
}

//删除一个商品
export const deleteGoods = async ctx => {
    let mysql = ctx.db;
    let {goodsId} = ctx.query;
    let sql = `delete from goods where id = ?`;
    await mysql.execute(sql, [goodsId]);
}

//根据商品名称模糊查询商品
export const selectGoodsName = async ctx => {
    let mysql = ctx.db;
    let {keyword} = ctx.query;
    let sql = `select id, title from goods where title like ?`;
    let [rows] = await mysql.execute(sql, ["%" + keyword + "%"]);
    return each(rows);
}

//根据id获取某个商品
export const getGoods = async ctx => {
    let mysql = ctx.db;
    let {goodsId} = ctx.query;
    let sql = `select * from goods where id = ?`;
    let [rows] = await mysql.execute(sql, [goodsId]);
    return each(rows);
}