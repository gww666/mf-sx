import KoadRouter = require("koa-router");
import {
    getCategoryList, 
    insertCategory, 
    updateCategory, 
    deleteCategory,
    goodsList,
    updateGoods,
    insertGoods,
    deleteGoods,
    selectGoodsName,
    getGoods
} from "../db/model/goods";
import {SucModel, ErrModel} from "../util/resModel";
import {validateUser} from "../util";

const router = new KoadRouter({
    prefix: "/api"
});

//根据companyId查询分类
router.get("/categoryList", validateUser, async ctx => {
    try {
        let data = await getCategoryList(ctx);
        ctx.body = new SucModel(data, "分类列表查询成功");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "获取分类列表失败——" + JSON.stringify(err));
    }
    
});

//添加分类或根据categoryId修改分类
router.post("/wCategory", validateUser, async ctx => {
    let {categoryId} = ctx.params;
    let tag = categoryId ? "修改" : "新增";
    try {
        if (categoryId) {
            await updateCategory(ctx);
        } else {
            await insertCategory(ctx);
        }
        
        ctx.body = new SucModel([], `分类${tag}成功`);
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], `分类${tag}失败——` + JSON.stringify(err));
    }
});

//删除一个分类
router.get("/delCategory", validateUser, async ctx => {
    try {
        await deleteCategory(ctx);
        ctx.body = new SucModel([], "分类删除成功");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "分类删除失败——" + JSON.stringify(err));
    }
});

//查询商品列表
router.get("/goodsList", validateUser, async ctx => {
    try {
        let data = await goodsList(ctx);
        ctx.body = new SucModel(data[0], "商品列表查询成功", data[1]);
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "商品列表查询失败——" + JSON.stringify(err));
    }
});

//新增或修改一个商品
router.post("/wGoods", validateUser, async ctx => {
    let {goodsId} = ctx.params;
    let tag = goodsId ? "修改" : "新增";
    try {
        if (goodsId) {
            //编辑
            await updateGoods(ctx);
        } else {
            //新增
            await insertGoods(ctx);
        }
        ctx.body = new SucModel([], `商品${tag}成功`);
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], `商品${tag}失败——` + JSON.stringify(err));
    }
});

//删除一个商品
router.get("/delGoods", validateUser, async ctx => {
    try {
        await deleteGoods(ctx);
        ctx.body = new SucModel([], "商品删除成功");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "商品删除失败——" + JSON.stringify(err));
    }
});

//商品名称模糊查询
router.get("/selectGoodsName", validateUser, async ctx => {
    try {
        let data = await selectGoodsName(ctx);
        ctx.body = new SucModel(data, "查询成功");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "查询失败——" + JSON.stringify(err));
    }
});

//根据id获取商品名称
router.get("/getGoods", validateUser, async ctx => {
    try {
        let data = await getGoods(ctx);
        ctx.body = new SucModel(data, "查询成功");
    } catch (err) {
        console.log("err", err);
        ctx.body = new ErrModel([], "查询失败——" + JSON.stringify(err));
    }
});

export default router;