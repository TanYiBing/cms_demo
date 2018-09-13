const router = require('koa-router')();

router.get('/', (ctx) =>{
  ctx.body = 'index';
});

module.exports = router.routes();