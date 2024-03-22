const { Controller } = require("egg");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  theUserTable,
  emailAuthorizationCode,
  emailAccount,
  emailCodeTimeout,
} = require("../../config/constants");

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = "勇敢的心去闯，不惧黑夜的忧伤。";
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
        user: emailAccount,
        pass: emailAuthorizationCode, // 14邮箱
      },
    });

    // 创建一个邮件对象
    const mail = {
      from: emailAccount, // 发件人邮箱地址
      to: email, // 收件人邮箱地址，多个邮箱地址用逗号隔开
      subject: "【验证码】来自凡农", // 邮件标题
      text: `您即将注册【凡农哥哥】的个人网站，成为尊贵的用户,你的验证码是：${code}`, // 邮件内容
    };

    // 发送邮件
    try {
      const res = await new Promise((resolve, reject) => {
        transporter.sendMail(mail, (error, info) => {
          if (error) {
            this.ctx.service.user.storeEmailCode(
              "13802882756@139.com",
              "67yun1"
            );
            reject(error);
          } else {
            // 在发送成功时，将邮箱和验证码临时存在redis中
            this.ctx.service.user.storeEmailCode(
              "13802882756@139.com",
              "67yun1"
            );
            info
              ? resolve(info)
              : resolve({
                  data: "出错了",
                });
          }
        });
      });
      ctx.body = {
        data: res,
        success: true,
        msg: "success",
        code: 200,
      };
    } catch (error) {
      ctx.body = {
        data: error,
        success: false,
        msg: "fail",
        code: 500,
      };
    }
  }

  async register() {
    const { ctx } = this;
    const { username, password, email, code } = ctx.request.body;

    // 在redis中比对验证码是否与邮箱匹配
    const redisEmailData = await this.app.redis.hgetall(email);
  
    console.log(redisEmailData, "redisEmailData")
    if (!redisEmailData || redisEmailData.code !== code) {
      ctx.body = {
        success: false,
        msg: "code is incorrect",
        code: 500,
        data: null,
      };
      return;
    }

    // 验证码验证通过
    if (redisEmailData.code === code) {
      //  比较code是否超时
      const now = Date.now();
      const time = redisEmailData.time;

      if (now - time > emailCodeTimeout) {
        ctx.body = {
          success: false,
          msg: "code is timeout",
          code: 500,
          data: null,
        };
        return;
      }

      // 生成一个随机的盐
      const salt = crypto.randomBytes(16).toString("hex");

      // 使用盐和密码生成加盐哈希
      const saltedHash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);

      // 查询在库用户名判断 注册的用户名和邮箱是否重复
      const sql = `
  SELECT * FROM ??
  WHERE username = ? OR email = ?
  LIMIT 1
`;
      const userRowDataPacket = await this.app.mysql.query(sql, [
        theUserTable,
        username,
        email,
      ]);
      console.log(userRowDataPacket, "userRowDataPacket")
      if (userRowDataPacket) {
        ctx.body = {
          success: false,
          msg: "username or email is already exist",
          code: 500,
          data: userRowDataPacket,
        };
        return;
      }

      // 账号未注册，邮箱未注册，code验证通过，开始注册
      const res = await this.app.mysql.insert(theUserTable, {
        username,
        email,
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
  }

  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    // 查询用户名是否存在
    const userRowDataPacket = await this.app.mysql.get(theUserTable, {
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
