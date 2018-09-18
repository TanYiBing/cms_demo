/*
1.将路由进行模块化
2.渲染模板引擎


*/



//引入需要的模块
const Koa = require('koa'),
      router = require('koa-router')(),
      render = require('koa-art-template'),
      path = require('path'),
      session = require('koa-session'),
      bodyParser = require('koa-bodyparser'),
      static = require('koa-static');


//实例化
const app = new Koa();

//配置静态资源
app.use(static(__dirname, '/public'));

//配置POST提交数据中间件
app.use(bodyParser());

//配置模版引擎
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
});

//引入路由模块
const index = require('./routes/index.js');
const api = require('./routes/api.js');
const admin = require('./routes/admin.js');

router.use('/admin',admin);
router.use('/api',api);
router.use(index);

//配置session中间件
app.keys = ['some secret hurr'];
 
const CONFIG = {
  key: 'koa:sess', 
  maxAge: 864000,
  autoCommit: true,
  overwrite: true, 
  httpOnly: true, 
  signed: true, 
  rolling: true,//每次请求都设置session
  renew: false,
};
 
app.use(session(CONFIG, app));

//启动路由
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
