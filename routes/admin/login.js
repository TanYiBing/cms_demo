const router = require('koa-router')();
const tools = require('../../model/tools.js');
const DB = require('../../model/db.js');

router.get('/', async (ctx) =>{
  await ctx.render('admin/login.html');
});

router.post('/doLogin', async (ctx) =>{
  // console.log(ctx.request.body);
  //首先去数据库匹配
  let username = ctx.request.body.username;
  let password = tools.md5(ctx.request.body.password);
  // console.log(password);

  //1.验证用户名密码是否合法
  //2.去数据库匹配
  let result = await DB.find('admin', {'username': username, 'password': password});
  // console.log(result);
  if (result.length ===1 ) {
    ctx.session.userinfo = result[0];//保存session
    ctx.redirect(ctx.state.__HOST__+'/admin');
  } else {
    console.log('失败');
  }

});

module.exports = router.routes();