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
        totalPages: Math.ceil(count / pageSize)
    });
});

router.get('/add', async (ctx) => {
    let catelist = await DB.find('articlecate', {});
    await ctx.render('admin/article/add', {
        cateList: tools.cateToList(catelist)
    });
});

router.post('/doAdd', upload.single('img_url'), async (ctx) => {
    // ctx.body = {
    //     filename: ctx.req.file.filename,//返回文件名
    //     body: ctx.req.body
    // }
    let pid = ctx.req.body.pid;
    let catename = ctx.req.body.catename.trim();
    let title = ctx.req.body.title.trim();
    let author = ctx.req.body.author.trim();
    let status = ctx.req.body.status;
    let is_best = ctx.req.body.is_best;
    let is_hot = ctx.req.body.is_hot;
    let is_new = ctx.req.body.is_new;
    let keywords = ctx.req.body.keywords;
    let description = ctx.req.body.description || '';
    let content = ctx.req.body.content || '';
    let img_url;
    if (ctx.req.file) {
        img_url = ctx.req.file.path.replace('/public','');
    } else {
        img_url = '';
    }

    //属性的简写
    let json = {
        pid, catename, title, author, status, is_best, is_hot, is_new, keywords, description, content, img_url
    }
    let result = await DB.insert('article', json);

    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/article');
});

router.get('/edit', async (ctx) => {
    //获取分类
    let id = ctx.query.id;
    let catelist = await DB.find('articlecate', {});
    //获取当前文章内容
    let article = await DB.find('article', {'_id': DB.getObjectId(id)});
    // console.log(result);

    await ctx.render('admin/article/edit.html', {
        cateList: tools.cateToList(catelist),
        list: article[0],
        prevPage: ctx.state.G.prevPage
    });
});

router.post('/doEdit', async (ctx) => {
    console.log(ctx.req.body);
    // let prevPage = ctx.req.body.prevPage || '';  /*上一页的地址*/
    // let id = ctx.req.body.id;
    // let pid = ctx.req.body.pid;
    // let catename = ctx.req.body.catename.trim();
    // let title = ctx.req.body.title.trim();
    // let author = ctx.req.body.author.trim();
    // let status = ctx.req.body.status;
    // let is_best = ctx.req.body.is_best;
    // let is_hot = ctx.req.body.is_hot;
    // let is_new = ctx.req.body.is_new;
    // let keywords = ctx.req.body.keywords;
    // let description = ctx.req.body.description || '';
    // let content = ctx.req.body.content || '';
    // let img_url;
    // let json;
    // if (ctx.req.file) {
    //     img_url = ctx.req.file.path.replace('/public', '');
    // } else {
    //     img_url = '';
    // }

    // //属性的简写
    // //注意是否修改了图片
    // if (img_url) {
    //     json = {
    //         pid, catename, title, author, status, is_best, is_hot, is_new, keywords, description, content, img_url
    //     }
    // } else {
    //     json = {
    //         pid, catename, title, author, status, is_best, is_hot, is_new, keywords, description, content
    //     }
    // }

    // let reseult = await DB.update('article', { "_id": DB.getObjectId(id) }, json);
    // console.log(result);


    // //跳转
    // if (prevPage) {
    //     ctx.redirect(prevPage);
    // } else {
    //     ctx.redirect(ctx.state.__HOST__ + '/admin/article');
    // }
});

router.get('/delete', async (ctx) => {
    ctx.body = '删除用户';
});

module.exports = router.routes();