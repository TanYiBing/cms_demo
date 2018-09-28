const router = require('koa-router')();

//引入子路由
const index = require('./admin/index.js');
const login = require('./admin/login.js');
const manager = require('./admin/manager.js');
const articlecate = require('./admin/articlecate.js');
const article = require('./admin/article.js');
const focus = require('./admin/focus.js')
const url = require('url');
const ueditor = require('koa2-ueditor');

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
    prevPage:ctx.request.header['referer'],
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
router.use('/articlecate', articlecate);
router.use('/article', article);
router.use('/focus', focus);


//配置富文本编辑器
router.all('/editor/controller', ueditor(['public', {
  "imageAllowFiles": [".png", ".jpg", ".jpeg"],
  "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

module.exports = router.routes();