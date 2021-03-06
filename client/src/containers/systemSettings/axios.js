import _axios from "../../utils/_axios";

// 获取系统配置
export const getSettings = companyId => {
    let options = {
        url: `/api/getSettings?companyId=${companyId}`,
        method: "GET",
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
}
// 保存系统配置
export const saveSettings = data => {
    let options = {
        url: "/api/updateSettings",
        method: "POST",
        data: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json', "Accept": 'application/json'
        }
    };
    return _axios(options);
};