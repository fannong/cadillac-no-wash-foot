// 为什么会有这个文件？
// 1. 为了方便管理一些常量，比如数据库表名、邮箱账户、邮箱授权码等
// 2. 为了方便在不同文件中使用这些常量
// 3. 为了方便修改这些常量，只需要修改一个文件即可

module.exports = {
  theUserTable: "my_new_table",
  theCrudTable: "crud_table",
  emailAccount: "miaowu11@163.com", // 用来发邮件的邮件账户。一般是开发者自己的邮箱或者企业的邮箱
  // emailAuthorizationCode: "HBPQPAPMIBYUHLIR", // 14邮箱  11邮箱：HMDJXCHHYITNRQDS
  emailAuthorizationCode: "HMDJXCHHYITNRQDS", // 11邮箱  14邮箱：HBPQPAPMIBYUHLIR
  emailCodeTimeout: 60 * 1000 * 500, // 邮箱验证码超时时间
};
