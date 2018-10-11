const router = require('koa-router')();
const DB = require('../model/db.js');
const url = require('url');

//配置中间件 获取url地址
router.use(async (ctx, next) => {
    
    let navResult = await DB.find('nav', { $or: [{ 'status': '1' }, { 'status': 1 }] }, {}, {
        sortJson: { 'sort': 1 }
    });
    let pathname = url.parse(ctx.request.url).pathname;

    ctx.state.nav = navResult;
    ctx.state.pathname = pathname;

    await next();
});

router.get('/', async (ctx) => {

    // 由于状态在后台没写好，可能是字符串或数字，所以使用$or
    let focusResult = await DB.find('focus', { $or: [{ 'status': '1' }, { 'status': 1 }]}, {}, {
        sortJson: { 'sort': 1 }
    });
    //   console.log(navResult);
    ctx.render('default/index.html', {
        focus: focusResult
    });
});

router.get('/news', async (ctx) => {
    ctx.render('default/news.html');
});

router.get('/case', async (ctx) => {
    ctx.render('default/case.html')
});

router.get('/service', async (ctx) => {
    let serviceList = await DB.find('article', { 'pid': '5ab34b61c1348e1148e9b8c2'});
    ctx.render('default/service.html', {
        serviceList: serviceList
    });
});

router.get('/content/:id', async (ctx) => {
    // console.log(ctx.params);

    let id = ctx.params.id;
    console.log(id);
    let content = await DB.find('article', {'_id': DB.getObjectId(id)});
    console.log(content);
    
    ctx.render('default/content.html', {
        list: content[0]
    });
});

router.get('/about', async (ctx) => {
    ctx.render('default/about.html')
});

router.get('/connect', async (ctx) => {
    ctx.render('default/connect.html')
});

module.exports = router.routes();