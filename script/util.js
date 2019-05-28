const fs = require("fs");
const path = require("path");
//递归创建目录
const mkdirsSync = (targetPath, cb) => {
    try {
        fs.mkdirSync(targetPath);
        cb && cb();
    } catch (err) {
        //尝试创建其父目录
        let _path = path.dirname(targetPath);
        let _cb = () => mkdirsSync(targetPath, cb);
        mkdirsSync(_path, _cb);
    }
} 

const copyFile = (op, dp) => {
    let reg = /\.(jpg|jpeg|gif|png)$/i;
    if (reg.test(op)) {
        //是图片，通过流复制
        let r = fs.readFileSync(op);
        fs.writeFileSync(dp, r);
    } else {
        let r = fs.readFileSync(op, "utf-8");
        fs.writeFileSync(dp, r);
    }
}
/**
 * 复制文件或目录的方法
 * @param {String} 原始路径 
 * @param {String} 目标路径
 */
const copy = (originPath, distPath) => {
    //判断路径类型
    let stats = fs.statSync(originPath);
    if (stats.isFile()) {
        try {
            //是文件
            // let r = fs.readFileSync(originPath, "utf-8");
            // fs.writeFileSync(distPath, r);
            copyFile(originPath, distPath);
        } catch (err) {
            //创建目录
            mkdirsSync(path.dirname(distPath));
            // let r = fs.readFileSync(originPath, "utf-8");
            // fs.writeFileSync(distPath, r);
            copyFile(originPath, distPath);
        }
    } else {
        let arr = fs.readdirSync(originPath);
        arr.forEach(item => {
            //判断路径类型
            let _originPath = path.join(originPath, item);
            let _distPath = path.join(distPath, item);
            let stats2 = fs.statSync(_originPath);
            //是文件
            if (stats2.isFile()) {
                copy(_originPath, _distPath);
            } else {
                //是目录
                copy(_originPath, _distPath);
            }
        });
    }
}

module.exports = {
    copy
}