const router = require('koa-router')();

router.get('/', (ctx) =>{
  ctx.render('default/index.html');
});

router.get('/news', (ctx) => {
  ctx.render('default/news.html');
});

router.get('/case', (ctx) => {
  ctx.render('default/case.html')
});

router.get('/service', (ctx) => {
  ctx.render('default/service.html')
});

router.get('/about', (ctx) => {
  ctx.render('default/about.html')
});

router.get('/connect', (ctx) => {
  ctx.render('default/connect.html')
});

module.exports = router.routes();