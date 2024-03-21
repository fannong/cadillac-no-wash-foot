const { Controller } = require("egg");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = "hi, egg, success";
  }

  async sendEmail() {
    const { ctx } = this;
    const { email } = ctx.request.body;
    // 创建验证码
    const code = Math.random().toString(36).slice(-6);

    const transporter = nodemailer.createTransport({
      service: "163",
      port: 465,
      secure: true,
      auth: {
        user: "miaowu12@163.com",
        pass: "HMDJXCHHYITNRQDS",
      },
    });

    // 创建一个邮件对象
    const mail = {
      from: "miaowu12@163.com", // 发件人邮箱地址
      to: email, // 收件人邮箱地址，多个邮箱地址用逗号隔开
      subject: "【验证码】来自凡农哥哥", // 邮件标题
      text: `您即将注册【凡农哥哥】的个人网站，成为尊贵的用户,你的验证码是：${code}`, // 邮件内容
    };
    // 发送邮件
    try {
      const info = await new Promise((resolve, reject) => {
        transporter.sendMail(mail, (error, info) => {
          if (error) {
            reject(error);
          } else {
            // 在发送成功时，将邮箱和验证码临时存在redis中
            resolve(info);
          }
        });
      });
      ctx.body = {
        data: info,
        success: true,
        msg: "success",
        code: 200,
      };
    } catch (error) {
      ctx.body = {
        data: info,
        success: false,
        msg: "fail",
        code: 500,
      };
    }
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
