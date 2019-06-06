import _axios from "../../../utils/_axios";
// 新增/编辑分类
export const operateGoods = data => {
    let options = {
        url: "/api/wGoods",
        method: "POST",
        data: JSON.stringify(data)
    };
    return _axios(options);
};