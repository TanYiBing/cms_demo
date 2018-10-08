let router = require('koa-router')();
let DB = require('../../model/db.js');

router.get('/', async (ctx) => {
    let result = await DB.find('nav', {});
    await ctx.render('admin/nav/list', {
        list: result
    });
});

router.get('/add', async (ctx) => {
    await ctx.render('admin/nav/add');
});

//执行增加操作
router.post('/doAdd', async (ctx) => {

    //接受数据
    let title = ctx.request.body.title;
    let url = ctx.request.body.url;
    let sort = ctx.request.body.sort;
    let status = ctx.request.body.status;
    let add_time = new Date();

    await DB.insert('nav', { title, url, sort, status, add_time });

    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/nav');
});


router.get('/edit', async (ctx) => {

    let id = ctx.query.id;
    let result = await DB.find('nav', { "_id": DB.getObjectId(id) });

    await ctx.render('admin/nav/edit', {
        list: result[0],
        prevPage: ctx.state.G.prevPage
    });

});

//执行增加操作
router.post('/doEdit', async (ctx) => {

    let id = ctx.request.body.id;
    let title = ctx.request.body.title;
    let url = ctx.request.body.url;
    let sort = ctx.request.body.sort;
    let status = ctx.request.body.status;
    let prevPage = ctx.request.body.prevPage;
    let add_time = new Date();

    await DB.update('nav', { "_id": DB.getObjectId(id) }, { title, url, sort, status, add_time });
    //跳转
    if (prevPage) {
        ctx.redirect(prevPage);
    } else {
        //跳转
        ctx.redirect(ctx.state.__HOST__ + '/admin/nav');
    }
});

module.exports = router.routes();