export const getFormateDate = val => {
    if(val) {
        let date = new Date(val);
        let Y = date.getFullYear();
        let M = date.getMonth() + 1;
        let D = date.getDate();

        if(M < 10) {
            M = '0' + M;
        };
        if(D < 10) {
            D = '0' + D;
        };
        return Y + '-' + M + '-' + D ;
    } else {
        return '';
    };
}