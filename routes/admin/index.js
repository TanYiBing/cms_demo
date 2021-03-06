const router = require('koa-router')();
const DB = require('../../model/db.js');

router.get('/', async (ctx) => {
    await ctx.render('admin/index.html');
});

router.get('/changeStatus', async (ctx) => {
    let collectionName = ctx.query.collectionName; /*数据库表名*/
    let attr = ctx.query.attr; /*attr属性就是status状态*/
    let id = ctx.query.id; /*更新的 id*/

    let data = await DB.find(collectionName, { '_id': DB.getObjectId(id) });
    // console.log(data);
    if (data.length > 0) {
        let json;
        if (data[0][attr] == 1) {
            json = { /*es6 属性名表达式*/
                [attr]: 0
            };
        } else {
            json = {
                [attr]: 1
            };
        }
        let updateResult = await DB.update(collectionName, { '_id': DB.getObjectId(id) }, json);
        //console.log(updateResult);
        if (updateResult) {
            ctx.body = { 'message': '更新成功', 'success': true };
        } else {
            ctx.body = { 'message': '更新失败', 'success': false }
        }
    } else {
        ctx.body = { 'message': '更新失败,参数错误', 'success': false };
    }

});
//改变排序的ajax接口
router.get('/changeSort', async (ctx) => {
    let collectionName = ctx.query.collectionName; /*数据库表名*/
    let sortValue = ctx.query.sortValue; /*attr属性就是status状态*/
    let id = ctx.query.id; /*更新的 id*/

    let data = await DB.find(collectionName, { '_id': DB.getObjectId(id) });
    // console.log(data);
    if (data.length > 0) {
        let json = { sort: sortValue}
        let updateResult = await DB.update(collectionName, { '_id': DB.getObjectId(id) }, json);
        //console.log(updateResult);
        if (updateResult) {
            ctx.body = { 'message': '更新成功', 'success': true };
        } else {
            ctx.body = { 'message': '更新失败', 'success': false }
        }
    } else {
        ctx.body = { 'message': '更新失败,参数错误', 'success': false };
    }

});

router.get('/remove', async (ctx) => {
    let collectionName = ctx.query.collectionName; /*数据库表名*/
    let id = ctx.query.id; /*删除的 id*/

    let result = DB.remove(collectionName, { '_id': DB.getObjectId(id) });

    ctx.redirect(ctx.state.G.prevPage);
});

module.exports = router.routes();