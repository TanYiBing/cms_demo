const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js')

router.get('/', async (ctx) => {
    let page = ctx.query.page || 1;
    let pageSize = 3;
    let result = await DB.find('focus', {}, {}, {
        page: page,
        pageSize: pageSize
    });
    let count = await DB.count('focus', {});
    await ctx.render('admin/focus/list.html', {
        list: result,
        page: page,
        totalPages: Math.ceil(count / pageSize)
    });
});

router.get('/add', async (ctx) => {
    await ctx.render('admin/focus/add.html');
});


module.exports = router.routes();