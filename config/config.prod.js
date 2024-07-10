// 生产环境配置
module.exports = () => {
  const config = {};

  config.mysql = {
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
      database: "eggexample",
    },
  };

  return config;
};
