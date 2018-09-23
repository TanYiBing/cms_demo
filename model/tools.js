const md5 = require('md5');

let tools = {
	md5(str) {
		return md5(str);
	},

	//分级表单数据处理
	cateToList(data) {
		//1.获取以及分类
		let firstArr = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].pid == '0') {
				firstArr.push(data[i]);
			}
		}

		//2.获取二级分类
		for (let i = 0; i < firstArr.length; i++) {
			firstArr[i].list = [];
			//匹配pid和_id
			for (let j = 0; j < data.length; j++) {
				if (firstArr[i]._id == data[j].pid) {
					firstArr[i].list.push(data[j]);
				}
			}		
		}
		return firstArr;
	}
}

module.exports = tools;