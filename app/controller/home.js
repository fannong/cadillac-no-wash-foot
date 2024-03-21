const { Controller } = require("egg");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = "hi, egg, success";
  }

  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    // 先查询字段是否存在
    const userRowDataPacket = await this.app.mysql.get("my_new_table", {
      username: username,
    });
    // 生成一个随机的盐
    const salt = crypto.randomBytes(16).toString("hex");

    // 使用盐和密码生成加盐哈希
    const saltedHash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    if (userRowDataPacket) {
      ctx.body = {
        success: false,
        msg: "name is duplicate",
        code: 500,
        data: userRowDataPacket,
      };
      return;
    }
    const res = await this.app.mysql.insert("my_new_table", {
      username,
      salt,
      password: saltedHash,
    });

    ctx.body = {
      success: true,
      msg: "success",
      code: 200,
      data: res,
    };
  }

  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    // 查询用户名是否存在
    const userRowDataPacket = await this.app.mysql.get("my_new_table", {
      username: username,
    });
    if (!userRowDataPacket) {
      ctx.body = {
        code: 401,
        data: null,
        msg: "username or password is incorrect",
      };
      return;
    }

    if (userRowDataPacket) {
      // 第二部：比较密码是否正确
      const salt = userRowDataPacket.salt;
      if (!salt) {
        ctx.body = {
          code: 500,
          data: null,
          msg: "数据错误",
        };
        return;
      }

      const saltedHash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);

      if (saltedHash === userRowDataPacket.password) {
        const token = jwt.sign({ username }, "secret", { expiresIn: "5s" });
        ctx.body = {
          code: 200,
          data: {
            token,
          },
          msg: "login success",
        };
      } else {
        ctx.body = {
          code: 401,
          data: null,
          msg: "username or password is incorrect",
        };
      }
    }
  }

  // todo  加入refresh token
  async tokenValid() {
    const { ctx } = this;
    const { token } = ctx.request.body;
    try {
      const decoded = jwt.verify(token, "secret");
      ctx.body = {
        code: 200,
        data: decoded,
        msg: "token is valid",
      };
    } catch (error) {
      ctx.body = {
        code: 401,
        data: null,
        msg: "token is invalid",
      };
    }
  }

  async getCsrf() {
    const { ctx } = this;
    ctx.body = {
      // Egg.js会在ctx.csrf中提供CSRF token
      _csrf: ctx.csrf,
    };
  }

  async getFirst() {
    const { ctx } = this;
    // debugger;
    this.logger.info("3月8日，调试");
    ctx.body = {
      code: 200,
      msg: "success",
      data: {
        name: "第一个接口",
      },
    };
  }
}

module.exports = HomeController;
