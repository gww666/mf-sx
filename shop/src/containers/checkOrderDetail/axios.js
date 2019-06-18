import _axios from "../../utils/_axios";

// 获取分类列表
export const getOrderDetail = orderNo => {
    let options = {
        url: `/api/getOrderDetail?orderNo=${orderNo}`,
        method: "GET"
    };
    return _axios(options);
};
