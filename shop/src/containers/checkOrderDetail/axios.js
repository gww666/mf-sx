import _axios from "../../utils/_axios";

// 获取分类列表
export const getOrderDetail = orderNo => {
    let options = {
        url: `/api/getOrderDetail?orderNo=${orderNo}`,
        method: "GET"
    };
    return _axios(options);
};
// 支付
export const doPay = data => {
    let options = {
        url: `/api/pay`,
        method: "POST",
        data: JSON.stringify(data)
    };
    return _axios(options);
}