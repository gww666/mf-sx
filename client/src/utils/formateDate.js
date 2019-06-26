// YY-MM-DD
export const getFormateDate = val => {
    if(val) {
        let date = new Date(val);
        let Y = date.getFullYear();
        let M = date.getMonth() + 1;
        let D = date.getDate();

        if(M < 10) {
            M = '0' + M;
        }
        if(D < 10) {
            D = '0' + D;
        }
        return Y + '-' + M + '-' + D ;
    } else {
        return '';
    }
}

//根据时间戳返回格式化后的时间戳
export const formateDate = time => {
    if (typeof time === "string") time = Number(time);
    let date = new Date(time);
    let year = date.getFullYear();
    let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    let hour = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
    let minutes = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
    return `${year}-${month}-${day} ${hour}:${minutes}`;
}