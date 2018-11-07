const router = require('koa-router')();
const DB = require('../model/db.js');

router.get('/', async (ctx) => {
	ctx.body = 'api';
});

router.get('/catelist', async (ctx) => {
	let catelist = await DB.find('articlecate', {});
	ctx.body = {
		result: catelist
	}
});

module.exports = router.routes();