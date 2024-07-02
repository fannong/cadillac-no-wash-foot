const BaseController = require("./base");
const { companyMainTable, companyChildTable } = require("../../config/constants");

class CompanyController extends BaseController {
  async info() {
    this.ctx.body = {
      name: "egg",
      company: "Alibaba",
    };
  }

  async getDetail() {
    const { ctx } = this;
    ctx.logger.info(ctx.params, "123");
    const { id } = ctx.params;
    const sql = `SELECT * FROM ?? WHERE id = ?`;
    const res = await this.app.mysql.query(sql, [companyMainTable, id]);
    const company = res[0];
    company.appointmentTime = company.appointmentTime.split(",");
    const sql2 = `SELECT * FROM ?? WHERE companyId = ?`;
    const projects = await this.app.mysql.query(sql2, [companyChildTable, id]);
    projects.forEach((project) => {
      project.usedSkill = project.usedSkill.split(",");
    });
    company.projects = projects;
    this.success(company, "success");
  }

  async getList() {
    const { ctx } = this;
    try {
      const sql = `SELECT * FROM ??`;
      const res = await this.app.mysql.query(sql, [companyMainTable]);
      const companyList = [];
      for (const company of res) {
        const { id, companyName, position, appointmentTime } = company;
        const sql2 = `SELECT * FROM ?? WHERE companyId = ?`;
        const projects = await this.app.mysql.query(sql2, [companyChildTable, id]);
        // 将usedSkill字段转换为数组
        projects.forEach((project) => {
          project.usedSkill = project.usedSkill.split(",");
        });
        companyList.push({
          id,
          companyName,
          position,
          appointmentTime: appointmentTime.split(","),
          projects,
        });
      }
      this.success(companyList, "success");
    } catch (err) {
      ctx.logger.error(err);
      this.fail(err, "error", 500);
    }
  }
  async create() {
    const { ctx } = this;
    try {
      // 执行之前，先删除companyMainTable表上的所有数据
      const deleteSql = `DELETE FROM ??`;
      await this.app.mysql.query(deleteSql, [companyChildTable]);
      await this.app.mysql.query(deleteSql, [companyMainTable]);
      ctx.logger.info(ctx.request.body, "123");
      // 将接口中的数据存入数据库
      const companyList = ctx.request.body;
      // 遍历多段公司经历，并将公司数据直接覆盖数据库进行更新
      for (const company of companyList) {
        ctx.logger.info(company);
        const { projects, companyName, position, appointmentTime } = company;
        const data = {
          projects,
          companyName,
          position,
          appointmentTime: appointmentTime.length > 0 ? appointmentTime.join(",") : "",
        };
        const sql1 = `INSERT INTO ?? (companyName, position, appointmentTime) VALUES (?, ?, ?)`;
        const res1 = await this.app.mysql.query(sql1, [
          companyMainTable,
          data.companyName,
          data.position,
          data.appointmentTime,
        ]);
        const id = res1.insertId;

        const sql2 = `INSERT INTO ?? (projectName, usedSkill, projectDesc, jobDesc, companyId) VALUES (?, ?, ?, ?, ?)`;
        for (const project of projects) {
          const { projectName, projectDesc, jobDesc, usedSkill } = project;
          const res2 = await this.app.mysql.query(sql2, [
            companyChildTable,
            projectName,
            usedSkill.join(","),
            projectDesc,
            jobDesc,
            id,
          ]);
        }
      }
      this.success({}, "success");
    } catch (err) {
      ctx.logger.error(err);
      this.fail(err, "error", 500);
    }
  }
}

module.exports = CompanyController;
