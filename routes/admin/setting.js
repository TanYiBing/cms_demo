const router = require('koa-router')();
const DB = require('../../model/db.js');
const multer = require('koa-multer');

//上传文件中间件配置
let storage = multer.diskStorage({
    //配置上传文件目录
    destination: function (req, file, cb) {
        cb(null, 'public/upload/setting')//目录一定要存在
    },
    //修改文件名称 图片重命名
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
let upload = multer({ storage: storage });

router.get('/', async (ctx) => {

    //ctx.body='系统设置';
    //获取设置的信息
    let result = await DB.find('setting', {});
    await ctx.render('admin/setting/index.html', {
        list: result[0]
    });

})


router.post('/doEdit', upload.single('site_logo'), async (ctx) => {
    //ctx.body='系统设置';
    //获取设置的信息

    let site_title = ctx.req.body.site_title;
    let site_logo = ctx.req.file ? ctx.req.file.path.substr(7) : '';
    let site_keywords = ctx.req.body.site_keywords;
    let site_description = ctx.req.body.site_description;
    let site_icp = ctx.req.body.site_icp;
    let site_qq = ctx.req.body.site_qq;
    let site_tel = ctx.req.body.site_tel;
    let site_address = ctx.req.body.site_address;
    let site_status = ctx.req.body.site_status;
    let add_time = new Date();
    let json;


    if (site_logo) {
        json = {
            site_title, site_logo, site_keywords, site_description, site_icp, site_qq, site_tel, site_address, site_status, add_time
        }
    } else {
        json = {
            site_title, site_keywords, site_description, site_icp, site_qq, site_tel, site_address, site_status, add_time
        }
    }

    await DB.update('setting', {}, json);
    ctx.redirect(ctx.state.__HOST__ + '/admin/setting');

})

module.exports = router.routes();