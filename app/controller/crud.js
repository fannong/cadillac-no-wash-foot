const BaseController = require("./base");
const { theCrudTable } = require("../../config/constants");

class CrudController extends BaseController {
  async create() {
    this.tryCatch(async () => {
      const { ctx } = this;

      const { name, type } = ctx.request.body;
      //   查重
      const isExist = await this.app.mysql.get(theCrudTable, { name });
      if (isExist) {
        this.fail({}, "已存在", 500);
        return;
      }

      await this.app.mysql.insert(theCrudTable, { name, type });
      // 返回详情
      const detail = await this.app.mysql.get(theCrudTable, { name });

      this.success(
        {
          id: detail.id,
        },
        "success"
      );
    });
  }

  async page() {
    const { ctx } = this;

    // 校验参数
    try {
      const listRules = {
        page: { type: "number", required: true, min: 1 },
        pageSize: { type: "number", required: true, min: 2, default: 10 },
        filter: { type: "object", required: false, default: {} },
      };
      const res = ctx.validate(listRules);
    } catch (err) {
      this.fail(err.errors, "参数错误", 500);
      return;
    }
    const { page = 1, pageSize = 10, filter } = ctx.request.body;
    const where = { ...filter };

    // 查询符合筛选条件的列表
    const result = await ctx.service.crud.pageList({
      where,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    // 查询总数
    const total = await ctx.service.crud.count(where);

    const pageList = {
      result,
      page,
      pageSize,
      total,
    };
    this.success(pageList, "success");
  }
}
module.exports = CrudController;
