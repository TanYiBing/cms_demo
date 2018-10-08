const router = require('koa-router')();
const DB = require('../../model/db.js');
const multer = require('koa-multer');

//上传文件中间件配置
let storage = multer.diskStorage({
    //配置上传文件目录
    destination: function (req, file, cb) {
        cb(null, 'public/upload/focus')//目录一定要存在
    },
    //修改文件名称 图片重命名
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
let upload = multer({ storage: storage });

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

router.post('/doAdd', upload.single('pic'), async (ctx) => {
    // 接受post传过来的数据
    // 需要注意，在模板中配置enctype="multipart/form-data"
    // ctx.body = {
    //     filename: ctx.req.file ? ctx.req.file.filename : '',
    //     body: ctx.req.body
    // }
    let title = ctx.req.body.title;
    let pic = ctx.req.file ? ctx.req.file.path.substr(7) : '';
    let url = ctx.req.body.url;
    let sort = ctx.req.body.sort;
    let status = ctx.req.body.status;
    let add_time = new Date();

    await DB.insert('focus', {
        title, pic, url, sort, status, add_time
    });

    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/focus');
});

router.get('/edit', async (ctx) => {
    let id = ctx.query.id;
    let result = await DB.find('focus', {'_id': DB.getObjectId(id)});
    await ctx.render('admin/focus/edit.html', {
        list: result[0],
        prevPage: ctx.state.G.prevPage
    });
});

router.post('/doEdit', upload.single('pic'), async (ctx) => {
    let title = ctx.req.body.title;
    let pic = ctx.req.file ? ctx.req.file.path.substr(7) : '';
    let url = ctx.req.body.url;
    let sort = ctx.req.body.sort;
    let status = ctx.req.body.status;
    let prevPage = ctx.req.body.prevPage || '';  /*上一页的地址*/
    let id = ctx.req.body.id;

    let json;
    if (pic) {
        json = {title, pic, url, sort, status};
    } else {
        json = {title, url, sort, status};
    }

    await DB.update('focus', { '_id': DB.getObjectId(id) }, json);

    //跳转上一页
    if (prevPage) {
        ctx.redirect(prevPage);
    } else {
        ctx.redirect(ctx.state.__HOST__ + '/admin/focus');
    }
});


module.exports = router.routes();