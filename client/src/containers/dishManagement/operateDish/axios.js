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
// 图片上传
export const uploadImg = data => {
    let options = {
        url: "/img/upload",
        method: "POST",
        data: data
    };
    return _axios(options);
}