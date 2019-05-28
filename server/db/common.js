"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//定义公共遍历方法
exports.each = (array) => {
    let list = [];
    let trans = (key) => {
        // 将下划线改为小驼峰式命名法则
        let temp = key.split("_");
        if (temp.length === 1)
            return key;
        return temp[0] + temp[1].slice(0, 1).toUpperCase() + temp[1].slice(1);
    };
    array.forEach((item, index) => {
        Object.entries(item).forEach(kv => {
            if (!list[index])
                list[index] = {};
            // console.log("转换后的key", trans(kv[0]));
            list[index][trans(kv[0])] = kv[1];
        });
    });
    return list;
};
