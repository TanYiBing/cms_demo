const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js')

//分类改造
router.get('/', async (ctx) => {
    let result = await DB.find('articlecate', {});
    // console.log(result);
    await ctx.render('admin/articlecate/index', {
        list: tools.cateToList(result)
    });
});

router.get('/add', async (ctx) => {
    let result = await DB.find('articlecate', {'pid': '0'});
    // console.log(result);
    await ctx.render('admin/articlecate/add.html', {
        catelist: result
    });
});

router.post('/doAdd', async (ctx) => {
    let result = await DB.insert('articlecate', ctx.request.body);
    ctx.redirect(`${ctx.state.__HOST__}/admin/articlecate`);
});

router.get('/edit', async (ctx) => {
    let id = ctx.query.id;
    let result = await DB.find('articlecate', {'_id': DB.getObjectId(id)});
    let articlecate = await DB.find('articlecate', { 'pid': '0' });
    // console.log(result);
    
    await ctx.render('admin/articlecate/edit.html', {
        list: result[0],
        catelist: articlecate
    });
});

router.post('/doEdit', async (ctx) => {
    let editData = ctx.request.body;
    let id = editData.id;
    let description = editData.description;
    let keywords = editData.keywords;
    let pid = editData.pid;
    let title = editData.title;
    let updateResult = DB.update('articlecate', { '_id': DB.getObjectId(id)}, {
        'description': description,
        'keywords': keywords,
        'pid': pid,
        'title': title
    });
    ctx.redirect(`${ctx.state.__HOST__}/admin/articlecate`);
});

module.exports = router.routes();