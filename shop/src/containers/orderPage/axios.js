import _axios from "../../utils/_axios";

// 获取分类列表
export const getCategoryList = companyId => {
    let options = {
        url: `/api/categoryList?companyId=${companyId}`,
        method: "GET"
    };
    return _axios(options);
};
// 获取商品列表
export const getGoodsList = (companyId, categoryId, pageNum, pageSize) => {
    let options = {
        url: `/api/goodsList?companyId=${companyId}${categoryId === "all" ? "" : "&categoryId=" + categoryId}&pageNum=${pageNum}&pageSize=${pageSize}`,
        method: "GET"
    };
    return _axios(options);
};
