const GoodRouter = require('koa-router')()
const Models =require('../models/index')
const { Sequelize } = Models.sequelize;
//查询商品列表
GoodRouter.get('/list', async ctx=>{
	let {page,pageSize,sort,priceLevel} = ctx.request.query;
	page = parseInt(page);
	pageSize = parseInt(pageSize);
	sort = parseInt(sort) || 1;

	sort = sort == 1 ? 'DESC' : 'ASC'

	let offset = (page - 1) * pageSize;
	let priceMin = 0,
		priceMax = 0;
	// 查询条件
	let searchParam = {};
	// 根据价格 帅选
	if (priceLevel != 'all') {
		switch (priceLevel) {
			case '0':
				priceMin = 0;
				priceMax = 500;
				break;
			case '1':
				priceMin = 500;
				priceMax = 1000;
				break;
			case '2':
				priceMin = 1000;
				priceMax = 5000;
				break;
		}
		searchParam ={[Sequelize.Op.and]:[
			{sale_price: {[Sequelize.Op.gte]:priceMin}},
			{sale_price: {[Sequelize.Op.lte]:priceMax}}
		]}
	}

	let goods = await Models.goods.findAndCountAll({
		offset,
		order:[['sale_price',sort]],
		limit:pageSize,
		where: searchParam
	})
	// console.log(Models)
	let {rows} = goods
	console.log('rows',rows)
	if(goods){
		ctx.body = {
			status:0,
			msg:'',
			result: {
				count:rows.length,
				list:rows
			}
		}
	}else{
		ctx.body = {
			status:1,
			msg:'查询失败'
		}
	}
})

//加入购物车
/*
GoodRouter.post('/addCart', function(req, res, next) {
	// userId = '100000077'
	var userId = req.cookies.userId,
		productId = req.body.productId;

	console.log(productId)
	User.findOne({
		userId: userId
	}, function(err, userDoc) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message
			})
		} else {
			if (userDoc) {

				let goosdItem = '';
				userDoc.cartList.forEach((item) => {
					if (item.productId == productId) {
						goosdItem = item;
						item.productNum++;
					}
				})

				if (goosdItem) {
					userDoc.save(function(err2, doc2) {
						if (err2) {
							res.json({
								status: '1',
								msg: err2.message
							})
						} else {
							res.json({
								status: '0',
								msg: '',
								result: 'success'
							})
						}
					})
				} else {
					Goods.findOne({
						productId: productId
					}, function(err1, doc) {
						if (err1) {
							res.json({
								status: '1',
								msg: err1.message
							})
						} else {
							if (doc) {
								doc.productNum = 1;
								doc.checked = 1;
								userDoc.cartList.push(doc);
								userDoc.save(function(err2, doc2) {
									if (err2) {
										res.json({
											status: '1',
											msg: err2.message
										})
									} else {
										res.json({
											status: '0',
											msg: '',
											result: 'success'
										})
									}
								})
							}
						}
					})
				}


			}
		}
	})
}) */

module.exports = GoodRouter;
