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
