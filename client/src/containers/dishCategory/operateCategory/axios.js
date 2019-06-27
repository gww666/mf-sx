import _axios from "../../../utils/_axios";
// 新增/编辑分类
export const operateCategory = data => {
    let options = {
        url: "/api/wCategory",
        method: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
};