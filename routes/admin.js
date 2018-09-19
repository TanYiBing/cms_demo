const router = require('koa-router')();

//引入子路由
const index = require('./admin/index.js');
const login = require('./admin/login.js');
const manager = require('./admin/manager.js');
const url = require('url');

//配置中间件 获取url地址
router.use(async (ctx, next) => {
  // console.log(ctx.host);
  ctx.state.__HOST__ = `http://${ctx.host}`;

  let pathname = url.parse(ctx.request.url).pathname.substring(1);
  // console.log(pathname);
  let splitUrl = pathname.split('/');

  //配置全局信息
  ctx.state.G = {
    userinfo: ctx.session.userinfo,
    url: splitUrl,
  }

  //权限判断
  if(ctx.session.userinfo) {

	await next();//登陆之后继续乡下匹配路由

  }else{
	if((pathname == 'admin/login') || (pathname == 'admin/login/doLogin') || (pathname == 'admin/login/code')){

	  await next();
	  
	}else {
	  
	  ctx.redirect('/admin/login');//没有登陆跳转到登录页面
	  
	}
  }

});


router.use('', index);
router.use('/login', login);
router.use('/manager', manager);

module.exports = router.routes();