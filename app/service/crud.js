const Service = require("egg").Service;
const { theCrudTable } = require("../../config/constants");

class crudService extends Service {
  async create() {}

  async pageList(params) {
    // 要处理筛选条件
    const { where, limit, offset } = params;
    params.orders = [["createTime", "desc"]];
    const whereClause = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(" AND ");

    const values = Object.values(where).concat([limit, offset]);
    const sql = `SELECT *, DATE_FORMAT(createTime, '%Y-%m-%d %H:%i:%s') as createTime,
                           DATE_FORMAT(updateTime, '%Y-%m-%d %H:%i:%s') as updateTime
                           FROM ${theCrudTable}
                           WHERE ${whereClause}
                           LIMIT ? OFFSET ?`;
    return this.app.mysql.query(sql, values);
  }

  async count(where) {
    return this.app.mysql.count(theCrudTable, where);
  }
}

module.exports = crudService;
