/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;

  router.get("/", controller.home.index);
  
  router.get("/csrf", controller.user.getCsrf);
  router.post("/login", controller.user.login);
  router.post("/register", controller.user.register);
  router.post("/tokenValid", controller.user.tokenValid);
  router.post("/email/valid", controller.user.sendEmail);
};
