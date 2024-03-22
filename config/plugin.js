/** @type Egg.EggPlugin */
// module.exports = {
// had enabled by egg
// static: {
//   enable: true,
// }
// enable: true,
// package: "egg-mysql",
// };
exports.mysql = {
  enable: true,
  package: "egg-mysql",
};

exports.redis = {
  enable: true,
  package: "egg-redis",
};
