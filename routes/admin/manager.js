const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js')

router.get('/', async (ctx) => {
    let result = await DB.find('admin', {});
    // console.log(result);

    await ctx.render('admin/manager/list.html', {
        list: result
    });
});

router.get('/add', async (ctx) => {
    await ctx.render('admin/manager/add.html');
});


//1.获取表单数据
//2.验证表单数据
//3.在数据库中查询当前要增加的管理员是否存在
router.post('/doAdd', async (ctx) => {
    // console.log(ctx.request.body);
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;
    if (!(/^\w{4,20}/.test(username))) {
        await ctx.render('admin/error.html', {
            message: '用户名不合法',
            redirect: ctx.state.__HOST__ + '/admin/manager/add'
        });
    } else if ((password != rpassword) || (password.length < 6)) {
        await ctx.render('admin/error.html', {
            message: '密码不一致或密码长度小于6',
            redirect: ctx.state.__HOST__ + '/admin/manager/add'
        });
    } else {
        let result = await DB.find('admin', {'username': username});
        if (result.length > 0) {
            await ctx.render('admin/error.html', {
                message: '用户名已被占用',
                redirect: ctx.state.__HOST__ + '/admin/manager/add'
            });
        } else {
            let addResult = await DB.insert('admin', {'username': username, 'password': tools.md5(password), 'status': 1, 'last_time': ''})
            ctx.redirect(ctx.state.__HOST__ + '/admin/manager');
        }
    }

});

router.get('/edit', async (ctx) => {
    let id = ctx.query.id;
    let result = await DB.find('admin', { '_id': DB.getObjectId(id)});
    // console.log(result);
    await ctx.render('admin/manager/edit.html', {
        list: result[0]
    })
});

router.post('/doEdit', async (ctx) => {
    let id = ctx.request.body.id;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;
    if (password != '') {
        if ((password != rpassword) || (password.length < 6)) {
            await ctx.render('admin/error.html', {
                message: '密码不一致或密码长度小于6',
                redirect: ctx.state.__HOST__ + '/admin/manager/edit?id='+ id
            });
        } else {
            let updateResult = await DB.update('admin', { '_id': DB.getObjectId(id) }, { 'password': tools.md5(password)})
            ctx.redirect(ctx.state.__HOST__ + '/admin/manager');
        }
    } else {
        ctx.redirect(ctx.state.__HOST__ + '/admin/manager')
    }
    
    
});

router.get('/delete', async (ctx) => {
    ctx.body = '删除用户';
});

module.exports = router.routes();