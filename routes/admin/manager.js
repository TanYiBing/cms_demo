const router = require('koa-router')();
const DB = require('../../model/db.js');

router.get('/', async (ctx) =>{
  let result = await DB.find('admin',{});
  // console.log(result);
  
  await ctx.render('admin/manager/list.html', {
    list: result
  });
});

router.get('/add', async (ctx) =>{
  await ctx.render('admin/manager/add.html');
});

router.get('/edit', async (ctx) =>{
  ctx.body = '编辑用户';
});

router.get('/delete', async (ctx) =>{
  ctx.body = '删除用户';
});

module.exports = router.routes();