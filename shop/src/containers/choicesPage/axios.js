import _axios from "../../utils/_axios";
import { getFormateDate } from "../../utils/getFormateDate";

// 获取设置
export const getSettings = () => {
    let options = {
        url: `/api/getSettings?companyId=${1}`,
        method: "GET"
    };
    return _axios(options);
};
// 根据企业号、餐桌号、创建日期查询订单
export const getOrder = (companyId, tableNo, date) => {
    let options = {
        url: `/api/getOrder?companyId=${companyId}&tableNo=${tableNo}&createDate2=${getFormateDate(date)}`,
        // url: `/api/getOrder?companyId=${companyId}&tableNo=${tableNo}&createDate2=2019-06-19`,
        method: "GET"
    };
    return _axios(options);
};
