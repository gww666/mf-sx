import Toast from "../components/toast";
//处理公共数据
export const handleData = (data) => {
    if (data.data.returnCode === 1) {
        return data.data.data || true;
    } else if (data.data.returnCode === 401) {
        //登录信息失效了
        localStorage.clear();
        Toast("登录信息失效");
    } else {
        Toast(data.data.message);
    }
}

//时间戳格式化为yy-mm-dd hh-mm格式
export const formatDate = (time) => {
    if (typeof time === "string") time = Number(time);
    let date = new Date(time);
    let year = date.getFullYear();
    let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    let hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
    let minutes = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
    return `${year}-${month}-${day} ${hour}:${minutes}`;
}

//rem2px
export const rem2px = (rem) => {
    let px = window.getComputedStyle(document.documentElement, null).fontSize.slice(0, -2);
    return rem * px;
}

