/* eslint valid-jsdoc: "off" */
// 引入path
const path = require("path");
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {
    logger: {
      dir: path.join(appInfo.baseDir, "my_log"),
      level: "DEBUG",
      outputJSON: true,
    },
    onerror: {
      all(err, ctx) {
        // this.ctx.logger.error("err统一封装", JSON.stringify(err));
        // 定义所有响应类型的错误处理方法
        // 定义了 config.all 后，其他错误处理不再生效
        ctx.body = JSON.stringify({
          message: err.message,
          level: err.level,
          host: err.host,
        });
        // ctx.body = "error";
        ctx.status = 500;
      },
      html(err, ctx) {
        // HTML 错误处理
        ctx.body = "<h3>error</h3>";
        ctx.status = 500;
      },
      json(err, ctx) {
        // JSON 错误处理
        ctx.body = { message: "error" };
        ctx.status = 500;
      },
      jsonp(err, ctx) {
        // JSONP 错误一般不需特殊处理，自动调用 JSON 方法
      },
    },
  });

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1709797928456_6998";

  // add your middleware config here
  config.middleware = ["cors", "trace"];

  // add your user config here
  const userConfig = {
    security: {
      csrf: {
        enable: true, // egg默认开启csrfToken校验
      },
    },
    validate: {
      // convert: false,
      // validateRoot: false,
    },

    redis: {
      client: {
        port: 6379,
        host: "127.0.0.1",
        password: "",
        db: 0,
      },
    },
    mysql: {
      // 单数据库信息配置
      client: {
        // host
        host: "127.0.0.1",
        // 端口号
        port: "3306",
        // 用户名
        user: "root",
        // 密码
        password: "root1234",
        // 数据库名
        database: "eggexample",
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
    development: {
      watchDirs: ["app", "lib", "config", "app.js", "agent.js", "config.default.js"],
      overrideDefault: true,
    },

    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
