import _axios from "../../utils/_axios";
import { getFormateDate } from "../../utils/getFormateDate";

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
// 获取设置
export const getSettings = () => {
    let options = {
        url: `/api/getSettings?companyId=${1}`,
        method: "GET"
    };
    return _axios(options);
}
// 根据企业号、餐桌号、创建日期查询订单
export const getOrder = (tableNo = 1) => {
    let options = {
        url: `/api/getOrder?companyId=${1}&tableNo=${tableNo}&createDate2=${getFormateDate(new Date())}`,
        method: "GET"
    };
    return _axios(options);
}
