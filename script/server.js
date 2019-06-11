const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const {copy, rmdirsSync} = require("./util.js");
const upload = require("./puppeteer");
//server目录下需要copy的目录
let config = {
    include: [
        "db",
        "routers",
        "util",
        "index.js",
        "package.json",
    ],
    exclude: [
        "node_modules"
    ]
}
//放置copy文件的目录
let distDir = path.resolve(__dirname, "../server/dist");

//判定文件是否需要copy
const needCopy = (_path) => {
    //先看是否被排除
    for (let item of config.exclude) {
        let reg = new RegExp(`.*${item}$`);
        if (reg.test(_path)) {
            return "exclude";
        }
    }
    for (let item of config.include) {
        let reg = new RegExp(`.*${item}$`);
        if (reg.test(_path)) {
            return item;
        }
    }
}

const _copy = (scanPath = path.resolve(__dirname, "../server")) => {
    
    let arr = fs.readdirSync(scanPath);
    for (let item of arr) {
        let _path = path.join(scanPath, item);
        let _needCopy = needCopy(_path);
        if (_needCopy && _needCopy !== "exclude") {
            copy(_path, path.join(distDir, _needCopy));
        } else if (fs.statSync(_path).isDirectory() && _needCopy !== "exclude") {
            _copy(path.join(scanPath, item));
        }
    }
}

const deleteTSFile = (startPath = distDir) => {
    let arr = fs.readdirSync(startPath);
    let reg = /\.ts$/;
    arr.forEach(item => {
        let _path = path.join(startPath, item);
        if (reg.test(_path)) {
            //是ts文件，进行删除
            fs.unlinkSync(_path);
        } else if (fs.statSync(_path).isDirectory()) {
            //如果是文件夹，进行递归操作
            deleteTSFile(_path);
        }
    });
}



(async () => {
    //复制文件，生成待压缩目录
    _copy();
    //剔除无用文件
    deleteTSFile();
    // return;
    let archive = archiver('zip');
    let originDirPath = distDir;
    let targetZipPath = path.resolve(__dirname, "../server/server-dist.zip");
    let zipStream = fs.createWriteStream(targetZipPath);
    zipStream.on("close", () => {
        //压缩完毕
        //删除temp目录
        rmdirsSync(originDirPath);
        console.log("生成压缩包成功!");
        //开始上传
        upload({
            zipPath: targetZipPath,
            type: "server",
            name: "dist",
            project: "mf"
        });
    });
    archive.pipe(zipStream);
    //指定压缩的目录，第二个参数是指定解压目录的结构，传false代表采用被压缩文件的目录结构
    // archive.directory(originDirPath + "/", "server-dist");
    archive.directory(originDirPath, "dist");
    //开始压缩
    archive.finalize();
})();