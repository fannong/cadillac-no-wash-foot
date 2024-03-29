const BaseController = require("./base");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  theUserTable,
  emailAuthorizationCode,
  emailAccount,
  emailCodeTimeout,
} = require("../../config/constants");

class UserController extends BaseController {
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

    const res = await new Promise((resolve, reject) => {
      transporter.sendMail(mail, (error, info) => {
        if (error) {
          reject(error);
        } else {
          // 在发送成功时，将邮箱和验证码临时存在redis中
          this.ctx.service.user.storeEmailCode(email, code);
          info ? resolve(info) : resolve({ data: "出错了" });
        }
      });
    });
    this.success(res, "success");
  }

  async register() {
    const { ctx } = this;
    const { username, password, email, code } = ctx.request.body;

    // 在redis中比对验证码是否与邮箱匹配
    const redisEmailData = await this.app.redis.hgetall(email);

    if (!redisEmailData || redisEmailData.code !== code) {
      this.success(null, "code is incorrect");
      return;
    }

    // 验证码验证通过
    if (redisEmailData.code === code) {
      //  比较code是否超时
      const now = Date.now();
      const time = redisEmailData.time;

      if (now - time > emailCodeTimeout) {
        this.fail(null, "code is timeout", 500);
        return;
      }

      // 生成一个随机的盐
      const salt = crypto.randomBytes(16).toString("hex");

      // 使用盐和密码生成加盐哈希
      const saltedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

      // 查询在库用户名判断 注册的用户名和邮箱是否重复
      const sql = `
    SELECT * FROM ??
    WHERE username = ? OR email = ?
    LIMIT 1
  `;
      const userRowDataPacket = await this.app.mysql.query(sql, [theUserTable, username, email]);
      console.log(userRowDataPacket, "userRowDataPacket");
      if (userRowDataPacket) {
        this.fail(userRowDataPacket, "username or email is already exist", 500);
        return;
      }

      // 账号未注册，邮箱未注册，code验证通过，开始注册
      const res = await this.app.mysql.insert(theUserTable, {
        username,
        email,
        salt,
        password: saltedHash,
      });
      this.success(res, "success");
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
      this.fail(401, "username or password is incorrect");
      return;
    }

    if (userRowDataPacket) {
      // 第二部：比较密码是否正确
      const salt = userRowDataPacket.salt;
      if (!salt) {
        this.fail(500, "数据错误");
        return;
      }

      const saltedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
      if (saltedHash === userRowDataPacket.password) {
        const token = jwt.sign({ username }, "secret", { expiresIn: "1h" });
        this.success({ token }, "login success");
      } else {
        this.fail(401, "username or password is incorrect");
      }
    }
  }

  // todo  加入refresh token
  async tokenValid() {
    const { ctx } = this;
    const { token } = ctx.request.body;
    try {
      const decoded = jwt.verify(token, "secret");
      this.success(decoded, "token is valid");
    } catch (error) {
      this.fail(null, "token is invalid", 401);
    }
  }

  async getCsrf() {
    const { ctx } = this;
    ctx.body = {
      // Egg.js会在ctx.csrf中提供CSRF token
      _csrf: ctx.csrf,
    };
  }
}

module.exports = UserController;
