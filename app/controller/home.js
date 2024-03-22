const BaseController = require("./base");

class HomeController extends BaseController {
  async index() {
    const { ctx } = this;
    ctx.body = "勇敢的心去闯，不惧黑夜的忧伤。";
  }
}

module.exports = HomeController;
