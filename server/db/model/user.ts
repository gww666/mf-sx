import {each} from "../common";

//获取企业用户信息
export const getCompanyInfo = async (ctx) => {
    let mysql = ctx.db;
    let {account, password} = ctx.params;
    let columns = ["id", "name", "permission", "end_date", "address", "phone", "state"].join(",");
    let sql = `select ${columns} from company where account = ? and password = ?`;
    let [rows] = await mysql.execute(sql, [account, password]);
    return each(rows);
}

//查询企业参数配置
export const getCompanySettings = async (ctx) => {
    let mysql = ctx.db;
    let {companyId} = ctx.query;
    let sql = `select * from settings where company_id = ?`;
    let [rows] = await mysql.execute(sql, [companyId]);
    return each(rows);
}

//修改企业设定配置
export const updateCompanySettings = async (ctx) => {
    let mysql = ctx.db;
    let {companyId, noticeType, processType} = ctx.params;
    let sql = `update settings set process_type = ?, notice_type = ? where company_id = ?`;
    await mysql.execute(sql, [companyId, processType, noticeType]);
}