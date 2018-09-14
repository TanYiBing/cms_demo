const router = require('koa-router')();

router.get('/', async (ctx) =>{
  await ctx.render('admin/login.html');
});

module.exports = router.routes();