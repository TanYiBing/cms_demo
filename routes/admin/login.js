const router = require('koa-router')();

router.get('/', (ctx) =>{
  await ctx.render('admin/login.html');
});

module.exports = router.routes();