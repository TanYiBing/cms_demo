const router = require('koa-router')();

router.get('/', (ctx) =>{
  ctx.body = '用户管理';
});

router.get('/add', (ctx) =>{
  ctx.body = '增加用户';
});

router.get('/edit', (ctx) =>{
  ctx.body = '编辑用户';
});

router.get('/delete', (ctx) =>{
  ctx.body = '删除用户';
});

module.exports = router.routes();