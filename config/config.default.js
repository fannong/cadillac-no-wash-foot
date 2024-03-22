/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1709797928456_6998";

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
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
        password: "root",
        // 数据库名
        database: "fannong",
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
    development: {
      watchDirs: [
        "app",
        "lib",
        "config",
        "app.js",
        "agent.js",
        "config.default.js",
      ],
      overrideDefault: true,
    },

    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
