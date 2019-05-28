const fs = require("fs");
const path = require("path");
const {copy} = require("./util.js");
//server目录下需要copy的目录
let serverDirCopyList = [
    "db",
    "routers",
    "util",
    "index.js",
    "package.json",
    "test/t1",
    "test/t2.js"
]
//判定文件是否需要copy
const needCopy = (_path) => {
    for (let item of serverDirCopyList) {
        let reg = new RegExp(`.*${item}$`);
        //是否是ts文件
        let isTs = /.*\.ts$/;
        if (reg.test(_path)) {
            return item;
        }
    }
}

const _copy = (scanPath = path.resolve(__dirname, "../server")) => {
    //创建download目录
    let distDir = path.resolve(__dirname, "../server/dist");
    let arr = fs.readdirSync(scanPath);
    for (let item of arr) {
        let _path = path.join(scanPath, item);
        let _needCopy = needCopy(_path);
        if (_needCopy) {
            copy(_path, path.join(distDir, _needCopy));
        } else if (fs.statSync(_path).isDirectory()) {
            _copy(path.join(scanPath, item));
        }
    }
}

_copy();