const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js')

router.get('/', async (ctx) => {
    ctx.body = 'articlecate';
});

router.get('/add', async (ctx) => {
    await ctx.render('admin/manager/add.html');
});

router.post('/doAdd', async (ctx) => {


});

router.get('/edit', async (ctx) => {

});

router.post('/doEdit', async (ctx) => {

});

router.get('/delete', async (ctx) => {
    ctx.body = '删除用户';
});

module.exports = router.routes();