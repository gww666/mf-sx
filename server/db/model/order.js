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
//根据企业号、桌号(和日期)查找订单
exports.getOrder = (ctx) => __awaiter(this, void 0, void 0, function* () {
    let mysql = ctx.db;
    let { companyId, tableNo, createDate2 } = ctx.query;
    let code = createDate2 ? " and create_date2 = ?" : "";
    let params = createDate2 ? [companyId, tableNo, createDate2] : [companyId, tableNo];
    let sql = `select * from m_order where company_id = ? and table_no = ?${code}`;
    let [rows] = yield mysql.execute(sql, params);
    return common_1.each(rows);
});
