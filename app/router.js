/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;

  router.get("/", controller.home.index);

  router.get("/csrf", controller.user.getCsrf);
  router.post("/csrf", controller.user.getCsrf);

  router.post("/user/login", controller.user.login);
  router.post("/user/register", controller.user.register);
  router.post("/user/tokenValid", controller.user.tokenValid);
  router.post("/user/email/valid", controller.user.sendEmail);

  router.post("/admin/create", controller.crud.create);

  router.post('/crud/list', controller.crud.page)
};
