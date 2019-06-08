const GoodRouter = require('koa-router')()
const Models =require('../models/index')
const { Sequelize } = Models.sequelize;
const Op = Sequelize.Op;
const { handlerAsyncError } = require('../utils/index')
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
		order:[['sale_price',sort],['updatedAt','DESC']],
		limit:pageSize,
		where: searchParam
	})
	// console.log(Models)
	let {rows} = goods
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
	1、 商品没有加入购物车 ， 在carts表增添一条记录
	2、 carts存在记录 ，修改原有数量
*/
GoodRouter.post('/addCart', async ctx=> {
	let userId = ctx.session.userid,
	{productId} = ctx.request.body;
	if(!userId){
		return ctx.body = {
			status: '1',
			msg: '请先登录',
			result: '请先登录'
		}
	}
	let [err1,cart] = await handlerAsyncError(Models.carts.findOne({
		where:{
			user_id:userId,
			product_id:productId
		}
	}))
	if(err1){
		ctx.response.status = 500;
		return ctx.body={
			status: '1',
			msg: err1.message,
			result: ''
		}
	}
	// 存在记录
	if(cart){
		// 数量增加
		cart.product_count = ++cart.product_count;
		let [error,rs] = await handlerAsyncError(cart.save());
		if(error){
			ctx.response.status = 500;
			ctx.body = {
				status: '1',
				msg: error.message,
				result: ''
			}
		}else{
			ctx.body = {
				status: '0',
				msg: '',
				result: 'success'
			}
		}
	}else{
		// 增添记录
		let [err2,res] = await handlerAsyncError(Models.carts.build({
			user_id:userId,
			product_id:productId,
			product_count:1,
			checked:0
		}).save())

		if(err2){
			ctx.response.status = 500;
			return ctx.body={
				status: '1',
				msg: err1.message,
				result: ''
			}
		}

		if(res){
			return ctx.body={
				status: '0',
				msg: '',
				result: 'success'
			}
		}
	}
})

module.exports = GoodRouter;
