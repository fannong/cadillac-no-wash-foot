const Service = require("egg").Service;

class UserService extends Service {
  /**
   * redis存储邮箱验证码
   * @param {*} email
   * @param {*} code
   */
  async storeEmailCode(email, code) {
    const now = Date.now();
    await this.app.redis.hmset(email, "code", code, "time", now);
  }
}

module.exports = UserService;
