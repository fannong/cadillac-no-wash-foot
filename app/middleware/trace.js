module.exports = () => {
  return async function trace(ctx, next) {
    ctx.traceId = Date.now() + Math.random().toString(36).substr(2, 9);
    await next();
  };
};
