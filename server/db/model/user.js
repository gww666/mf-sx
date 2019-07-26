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
const common_1 = require("../common");
//获取企业商户信息
exports.getCompanyInfo = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { account, password } = ctx.params;
    let columns = ["id", "name", "permission", "end_date", "address", "phone", "state"].join(",");
    let sql = `select ${columns} from company where account = ? and password = ?`;
    let [rows] = yield mysql.execute(sql, [account, password]);
    return common_1.each(rows);
});
//获取商户信息列表
exports.getCompanyInfoList = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { saleId } = ctx.query;
    let columns = ["id", "name", "phone", "permission", "create_date", "end_date", "address", "phone", "state", "sale_id", "pay_type"].join(",");
    let where = saleId ? " where sale_id = ?" : "";
    let params = saleId ? [saleId] : [];
    let sql = `select ${columns} from company${where}`;
    let [rows] = yield mysql.execute(sql, params);
    return common_1.each(rows);
});
//查询企业参数配置
exports.getCompanySettings = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { companyId } = ctx.query;
    let sql = `select * from settings where company_id = ?`;
    let [rows] = yield mysql.execute(sql, [companyId]);
    return common_1.each(rows);
});
//修改企业设定配置
exports.updateCompanySettings = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { companyId, noticeType, processType } = ctx.params;
    let sql = `update settings set process_type = ?, notice_type = ? where company_id = ?`;
    yield mysql.execute(sql, [processType, noticeType, companyId]);
});
//插入企业商户信息
//商户permission默认全为1
//这里插入的商户信息默认state为4，代付款
exports.insertCompanyInfo = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { name, address, phone, payType, tableNo, saleId } = ctx.params;
    let columns = ["id", "name", "address", "phone", "pay_type", "permission", "state", "sale_id", "table_no", "create_time", "update_time"].join(",");
    let sql = `insert into company(${columns}) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let date = Date.now();
    yield mysql.execute(sql, [null, name, address, phone, payType, 1, 4, saleId, tableNo, date, date]);
});
//修改商户信息
//一般用作开通账号、密码，更新套餐结束时间
//客户端做了限制，当state为待付款时，无法添加账号、密码
exports.updateCompanyInfo = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { companyId, name, address, phone, payType, tableNo, account = "", password = "" } = ctx.params;
    let sql = `update company set name = ?, address = ?, phone = ?, pay_type = ?, table_no = ?, update_time = ?, account = ?, password = ? where id = ?`;
    let date = Date.now();
    yield mysql.execute(sql, [name, address, phone, payType, tableNo, date, account, password, companyId]);
});
//营销人员登录接口
exports.saleLogin = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { phone, password } = ctx.params;
    let columns = ["id", "phone", "name", "parent_id", "total_profit", "rest_profit"].join(",");
    let sql = `select ${columns} from sale where phone = ? and password = ?`;
    let [rows] = yield mysql.execute(sql, [phone, password]);
    return common_1.each(rows);
});
