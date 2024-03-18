module.exports = () => {
    return async function cors(ctx, next) {
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH');
      ctx.set('Access-Control-Allow-Headers', 'Content-Type');
      await next();
    };
  };