const router = require('koa-router')();

//引入子路由
const login = require('./admin/login');
const user = require('./admin/user');

//配置中间件 获取url地址
router.use(async (ctx, next) => {
  // console.log(ctx.host);
  ctx.state.__HOST__ = `http://${ctx.host}`;
  await next();
});


router.get('/', (ctx) => {
  ctx.body = 'admin';
});

router.use('/login', login);
router.use('/user', user);

module.exports = router.routes();