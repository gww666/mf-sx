import _axios from "../../utils/_axios";
// 获取订单列表
export const getOrdersList = companyId => {
    let options = {
        url: `/api/getOrderList?companyId=${companyId}`,
        method: "GET"
    };
    return _axios(options);
}