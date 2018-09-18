const router = require('koa-router')();

//引入子路由
const login = require('./admin/login.js');
const user = require('./admin/user.js');
const url = require('url');

//配置中间件 获取url地址
router.use(async (ctx, next) => {
  // console.log(ctx.host);
  ctx.state.__HOST__ = `http://${ctx.host}`;

  let pathname = url.parse(ctx.request.url).pathname;

  //权限判断
  if(ctx.session.userinfo) {

    await next();//登陆之后继续乡下匹配路由

  }else{
    if((pathname == '/admin/login') || (pathname == '/admin/login/doLogin') || (pathname == '/admin/login/code')){

      await next();
      
    }else {
      
      ctx.redirect('/admin/login');//没有登陆跳转到登录页面
      
    }
  }

});


router.get('/', async (ctx) => {
    ctx.render('admin/index.html');
});

router.use('/login', login);
router.use('/user', user);

module.exports = router.routes();