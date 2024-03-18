/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/csrf', controller.home.getCsrf);
  router.post('/first', controller.home.getFirst);
  router.get('/first', controller.home.getFirst);
  router.post('/login', controller.home.login);
  router.post('/register', controller.home.register);
};
