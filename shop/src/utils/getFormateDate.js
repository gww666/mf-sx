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

export const formatDateTime = inputTime => {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};