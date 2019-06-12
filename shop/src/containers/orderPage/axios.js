import _axios from "../../utils/_axios";

// 获取分类列表
export const getCategoryList = companyId => {
    let options = {
        url: `/api/categoryList?companyId=${companyId}`,
        method: "GET"
    };
    return _axios(options);
};