"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoodsInfo = (ctx) => __awaiter(this, void 0, void 0, function* () {
    //
});
exports.startInterval = (ctx) => __awaiter(this, void 0, void 0, function* () {
    //从数据库中查询菜品数据做初始化使用
    //持久化存储到mysql数据库中
    // 开启一个定时任务，每天凌晨三点钟更新当天营业额记录和菜品销量纪录
    // 这个定时任务通过一个延时器开启
    //获取当前距离第二天凌晨三点的时间
    let date = new Date();
    let now = date.getTime();
    date.setDate(date.getDate() + 1);
    let future = date.setHours(3, 0, 0, 0);
    let time = future - now;
    setTimeout(() => {
        //开启定时任务
        //执行周期是一天
        let time2 = 1000 * 60 * 60 * 24;
        setInterval(() => {
        }, time2);
    }, time);
});
