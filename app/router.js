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

  router.post("/crud/list", controller.crud.page);

  router.post("/company/create", controller.company.create);
  router.get("/company/list", controller.company.getList);
  router.get("/company/detail/:id", controller.company.getDetail);

  router.post('/file/upload', controller.file.upload);
  router.get('/file/download', controller.file.download);
};
