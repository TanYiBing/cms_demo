const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js')

//分类改造
router.get('/', async (ctx) => {
    let page = ctx.query.page || 1;
    let pageSize = 3;

    let result = await DB.find('article', {}, {}, {
        page: page, 
        pageSize: pageSize
    });
    let count = await DB.count('article', {});
    await ctx.render('admin/article/index', {
        list: result,
        page: page,
        totalPages: Math.ceil(count/pageSize)
    });
});

router.get('/add', async (ctx) => {
    let result = await DB.find('article', {'pid': '0'});
    // console.log(result);
    await ctx.render('admin/article/add.html', {
        catelist: result
    });
});

router.post('/doAdd', async (ctx) => {
    let result = await DB.insert('article', ctx.request.body);
    ctx.redirect(`${ctx.state.__HOST__}/admin/article`);
});

router.get('/edit', async (ctx) => {
    let id = ctx.query.id;
    let result = await DB.find('article', {'_id': DB.getObjectId(id)});
    let article = await DB.find('article', { 'pid': '0' });
    // console.log(result);
    
    await ctx.render('admin/article/edit.html', {
        list: result[0],
        catelist: article
    });
});

router.post('/doEdit', async (ctx) => {
    let editData = ctx.request.body;
    let id = editData.id;
    let description = editData.description;
    let keywords = editData.keywords;
    let pid = editData.pid;
    let title = editData.title;
    let updateResult = DB.update('article', { '_id': DB.getObjectId(id)}, {
        'description': description,
        'keywords': keywords,
        'pid': pid,
        'title': title
    });
    ctx.redirect(`${ctx.state.__HOST__}/admin/article`);
});

router.get('/delete', async (ctx) => {
    ctx.body = '删除用户';
});

module.exports = router.routes();