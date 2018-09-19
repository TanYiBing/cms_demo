const router = require('koa-router')();
const tools = require('../../model/tools.js');
const DB = require('../../model/db.js');
const svgCaptcha = require('svg-captcha');

router.get('/', async (ctx) =>{
  await ctx.render('admin/login.html');
});

//验证码
router.get('/code', async (ctx) =>{
    // ctx.body = 'code';
    let captcha = svgCaptcha.create({
        size:4,//验证码长度
        fontSize: 50,
        width: 120,
        height: 34,
        background:"#cc9966"
    });
    // console.log(captcha.text);

    //保存验证码
    ctx.session.code = captcha.text;
  
    ctx.response.type = 'image/svg+xml';//设置响应头
	  ctx.body = captcha.data;
});

router.post('/doLogin', async (ctx) =>{
  // console.log(ctx.request.body);
  //首先去数据库匹配
  let username = ctx.request.body.username;
  let password = tools.md5(ctx.request.body.password);
  let code = ctx.request.body.code;
  // console.log(password);

  //1.验证用户名密码是否合法
  //2.去数据库匹配
  //3.成功后把用户信息存进session
  if (code.toLocaleLowerCase() == (ctx.session.code).toLocaleLowerCase()) {
    let result = await DB.find('admin', {'username': username, 'password': password});
    // console.log(result);
    if (result.length ===1 ) {
      ctx.session.userinfo = result[0];//保存session
      ctx.redirect(ctx.state.__HOST__+'/admin');
    } else {
      ctx.render('admin/error', {
        message: '用户名或密码错误',
        redirect: ctx.state.__HOST__+'/admin/login'
      })
    }
  } else {
    ctx.render('admin/error', {
      message: '验证码错误',
      redirect: ctx.state.__HOST__+'/admin/login'
    })
  }

});

router.get('/loginOut', async (ctx) => {
	ctx.session.userinfo = null;
	ctx.redirect(`${ctx.state.__HOST__}/admin/login`)
});

module.exports = router.routes();