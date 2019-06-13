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
//获取企业用户信息
exports.getCompanyInfo = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { account, password } = ctx.params;
    let columns = ["id", "name", "permission", "end_date", "address", "phone", "state"].join(",");
    let sql = `select ${columns} from company where account = ? and password = ?`;
    let [rows] = yield mysql.execute(sql, [account, password]);
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
    yield mysql.execute(sql, [companyId, processType, noticeType]);
});
