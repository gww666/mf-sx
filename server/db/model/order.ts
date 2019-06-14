import {each} from "../common";
//根据企业号、桌号(和日期)查找订单
export const getOrder = async ctx => {
    let mysql = ctx.db;
    let {companyId, tableNo, createDate2} = ctx.query;
    let code = createDate2 ? " and create_date2 = ?" : "";
    let params = createDate2 ? [companyId, tableNo, createDate2] : [companyId, tableNo]; 
    let sql = `select * from m_order where company_id = ? and table_no = ?${code}`;
    let [rows] = await mysql.execute(sql, params);
    return each(rows);
}