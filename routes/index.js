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

    //ctx.body="前台首页";
    console.time('start');

    //轮播图  注意状态数据不一致问题  建议在后台增加数据的时候状态 转化成number类型
    let focusResult = await DB.find('focus', { $or: [{ 'status': 1 }, { 'status': '1' }] }, {}, {

        sortJson: { 'sort': 1 }
    })
    //导航条的数据
    let links = await DB.find('link', { $or: [{ 'status': 1 }, { 'status': '1' }] }, {}, {

        sortJson: { 'sort': 1 }
    })


    ctx.render('default/index', {

        focus: focusResult,
        links: links
    });
});

router.get('/news', async (ctx) => {
    let page = ctx.query.page || 1;
    let pid = ctx.query.pid;
    let articleResult;
    let articleNum;

    let pageSize = 3;

    //获取分类
    let cateResult = await DB.find('articlecate', { 'pid': '5afa56bb416f21368039b05d' });

    if (pid) {
        articleResult = await DB.find('article', { "pid": pid }, {}, {

            pageSize,
            page
        });
        articleNum = await DB.count('article', { "pid": pid });


    } else {

        //获取所有子分类的id
        let subCateArr = [];
        for (let i = 0; i < cateResult.length; i++) {
            subCateArr.push(cateResult[i]._id.toString());
        }
        articleResult = await DB.find('article', { "pid": { $in: subCateArr } }, {}, {
            pageSize,
            page
        });

        articleNum = await DB.count('article', { "pid": { $in: subCateArr } });
    }

    ctx.render('default/news', {
        catelist: cateResult,
        newslist: articleResult,
        pid: pid,
        page: page,
        totalPages: Math.ceil(articleNum / pageSize)

    });
});

router.get('/case', async (ctx) => {
    // 获取成功案例下面的分类
    let cateList = await DB.find('articlecate', { 'pid': '5ab3209bdf373acae5da097e'});

    // 分页
    let articleNum;
    let page = ctx.query.page || 1;
    let pageSize = 1;

    // 获取所有子分类下面的数据
    // 1.取得子分类的所有id
    let subCateIdArr = [];

    // 实现点击分类切换
    let pid = ctx.query.pid;
    let articleList;

    
    if (pid) {
        // 如果存在
        articleList = await DB.find('article', { 'pid': pid }, {}, {
            page,
            pageSize
        });
        articleNum = await DB.count('article', { 'pid': pid });

    } else {

        for (let i = 0; i < cateList.length; i++) {
            subCateIdArr.push(`${cateList[i]._id}`);
        }
        // 查出所有数据SQL
        articleList = await DB.find('article', { 'pid': { $in: subCateIdArr } });
        articleNum = await DB.count('article', { 'pid': { $in: subCateIdArr } });
    }
    
    ctx.render('default/case.html', {
        cateList: cateList,
        articleList: articleList,
        pid: pid,
        page: page,
        totalPages: Math.ceil(articleNum/pageSize)
    });
});

router.get('/service', async (ctx) => {
    let serviceList = await DB.find('article', { 'pid': '5ab34b61c1348e1148e9b8c2'});
    ctx.render('default/service.html', {
        serviceList: serviceList
    });
});

router.get('/content/:id', async (ctx) => {
    let id = ctx.params.id;
    let content = await DB.find('article', { '_id': DB.getObjectId(id) });
    /*
    1.根据文章获取文章的分类信息

    2、根据文章的分类信息，去导航表里面查找当前分类信息的url

    3、把url赋值给 pathname
    * */
    //获取当前文章的分类信息
    let cateResult = await DB.find('articlecate', { '_id': DB.getObjectId(content[0].pid) });
    // console.log(cateResult[0].pid);
    let parentCateResult;
    let navResult;

    if (cateResult[0].pid != 0) {  /*子分类*/
        //找到当前分类的父亲分类
         parentCateResult = await DB.find('articlecate', { '_id': DB.getObjectId(cateResult[0].pid) });

         navResult = await DB.find('nav', { $or: [{ 'title': cateResult[0].title }, { 'title': parentCateResult[0].title }] });

    } else {  /*父分类*/

        //在导航表查找当前分类对应的url信息
         navResult = await DB.find('nav', { 'title': cateResult[0].title });

    }

    if (navResult.length > 0) {
        //把url赋值给 pathname
        ctx.state.pathname = navResult[0]['url'];

    } else {
        ctx.state.pathname = '/';
    }


    ctx.render('default/content', {
        list: content[0]
    });

})

router.get('/about', async (ctx) => {
    ctx.render('default/about.html')
});

router.get('/connect', async (ctx) => {
    ctx.render('default/connect.html')
});

module.exports = router.routes();