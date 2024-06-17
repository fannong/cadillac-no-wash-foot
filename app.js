module.exports = (app) => {
  const startTime = Date.now();

  app.ready(() => {
    const endTime = Date.now();
    const startupDuration = endTime - startTime;
    app.logger.info(`App startup duration: ${startupDuration} ms`);
  });
};
