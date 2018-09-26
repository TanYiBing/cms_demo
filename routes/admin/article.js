const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');
const multer = require('koa-multer');

//上传文件中间件配置
let storage = multer.diskStorage({
    //配置上传文件目录
    destination: function (req, file, cb) {
        cb(null, 'public/upload')//目录一定要存在
    },
    //修改文件名称 图片重命名
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
let upload = multer({ storage: storage })

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
    await ctx.render('admin/article/add.html')
});

router.post('/doAdd', upload.single('pic'), async (ctx) => {
    ctx.body = {
        filename: ctx.req.file.filename,//返回文件名
        body: ctx.req.body
    }
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