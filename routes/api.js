const router = require('koa-router')();

router.get('/', (ctx) =>{
  ctx.body = 'api';
});

module.exports = router.routes();