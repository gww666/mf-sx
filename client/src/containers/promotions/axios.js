import _axios from "../../utils/_axios";
// 获取实时订单列表
export const getRtOrdersList = companyId => {
    let options = {
        url: `/api/getRTOrder?companyId=${companyId}`,
        method: "GET",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
}

// 修改订单信息
export const modifyOrder = data => {
    let options = {
        url: `/api/updateOrder`,
        method: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
}