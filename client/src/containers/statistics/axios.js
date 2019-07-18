import _axios from "../../utils/_axios";
// 获取营业额统计数据
export const getTurnover = companyId => {
    let options = {
        url: `/api/getTurnover?companyId=${companyId}`,
        method: "GET",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
}
// 获取菜品统计数据
export const getGoodsData = companyId => {
    let options = {
        url: `/api/getGoodsData?companyId=${companyId}`,
        method: "GET",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
}