const router = require('koa-router')();

//引入子路由
const login = require('./admin/login');
const user = require('./admin/user');

router.get('/', (ctx) => {
  ctx.body = 'admin';
});

router.use('/login', login);
router.use('/user', user);

module.exports = router.routes();