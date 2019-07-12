import _axios from "../../utils/_axios";
// 获取分类列表
export const getCategoryList = companyId => {
    let options = {
        url: `/api/categoryList?companyId=${companyId}`,
        method: "GET",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
};
// 获取商品列表
export const queryGoodsList = (companyId, categoryId, pageNum, pageSize) => {
    let options = {
        url: `/api/goodsList?companyId=${companyId}${categoryId === "all" ? "" : "&categoryId=" + categoryId}&pageNum=${pageNum}&pageSize=${pageSize}`,
        method: "GET",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
};
// 删除分类
export const deleteGoods = goodsId => {
    let options = {
        url: `/api/delGoods?goodsId=${goodsId}`,
        method: "GET",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
};
// 从模糊查询商品名
export const searchGoods = goodsname => {
    let options = {
        url: `/api/selectGoodsName?keyword=${goodsname}`,
        method: "GET",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
};
// 通过id查询商品内容
export const getGoodsInfoById = goodsId => {
    let options = {
        url: `/api/getGoods?goodsId=${goodsId}`,
        method: "GET",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
}
// 获取通用标签
export const getPublicTags = companyId => {
    let options = {
        url: `/api/getTags?companyId=${companyId}`,
        method: "GET",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
}
// 保存通用标签
export const savePublicTags = params => {
    let options = {
        url: `/api/updateTags`,
        method: "POST",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        },
        data: JSON.stringify(params)
    };
    return _axios(options);
}