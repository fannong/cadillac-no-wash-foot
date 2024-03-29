const Controller = require("egg").Controller;
// 假如我希望每个请求都一个独立的tractId，那么我可以在 BaseController 中生成一个 tractId，然后在每个请求中返回这个 tractId，这样就可以方便的追踪每个请求的日志。
// 在 BaseController 中添加一个 tractId 属性，然后在构造函数中生成一个 tractId，这样每个请求都会有一个独立的 tractId。

class BaseController extends Controller {
  tryCatch(fn) {
    try {
      return fn();
    } catch (error) {
      this.ctx.logger.error(error);
      this.fail(error, "fail", 500);
    }
  }

  success(data, message) {
    this.ctx.body = {
      code: 200,
      data,
      message,
      traceId: Date.now() + Math.random().toString(36).substring(2, 9),
    };
    this.ctx.status = 200;
  }

  fail(data, message, code = 500) {
    this.ctx.body = {
      code,
      data,
      message,
      traceId: Date.now() + Math.random().toString(36).substring(2, 9),
    };
    this.ctx.status = 200;
  }
}

module.exports = BaseController;
