import _axios from "../../utils/_axios";
// 获取实时订单列表
export const getRtOrdersList = companyId => {
    let options = {
        url: `/api/getRTOrder?companyId=${companyId}`,
        method: "GET"
    };
    return _axios(options);
}
// 获取订单列表
export const getOrdersList = (companyId, createDate2) => {
    let options = {
        url: `/api/getOrderList?companyId=${companyId}${createDate2 ? '&createDate2=' + createDate2 : ''}`,
        method: "GET"
    };
    return _axios(options);
};
// 修改桌号
export const modifyTableNo = param => {
    let options = {
        url: `/api/resetTableNo?orderNo=${param.orderNo}&tableNo=${param.tableNo}`,
        method: "GET"
    };
    return _axios(options);
};
// 修改订单信息
export const modifyOrder = data => {
    let options = {
        url: `/api/updateOrder`,
        method: "POST",
        data: JSON.stringify(data)
    };
    return _axios(options);
}
// 从模糊查询商品名
export const searchGoods = goodsname => {
    let options = {
        url: `/api/selectGoodsName?keyword=${goodsname}`,
        method: "GET"
    };
    return _axios(options);
};
// 通过id查询商品内容
export const getGoodsInfoById = goodsId => {
    let options = {
        url: `/api/getGoods?goodsId=${goodsId}`,
        method: "GET"
    };
    return _axios(options);
}
// 获取订单详情
export const getOrderDetail = orderNo => {
    let options = {
        url: `/api/getOrderDetail?orderNo=${orderNo}`,
        method: "GET"
    };
    return _axios(options);
}