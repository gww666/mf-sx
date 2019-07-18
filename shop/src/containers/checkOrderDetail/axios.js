import _axios from "../../utils/_axios";

// 获取分类列表
export const getOrderDetail = orderNo => {
    let options = {
        url: `/api/getOrderDetail?orderNo=${orderNo}`,
        method: "GET",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
};
// 支付
export const doPay = data => {
    let options = {
        url: `/api/pay`,
        method: "POST",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        },
        data: JSON.stringify(data)
    };
    return _axios(options);
}