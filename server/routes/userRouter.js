const UserRouter = require('koa-router')()
const Models =require('../models/index')
const md5 = require('md5')
const { Sequelize:{Op} } = Models.sequelize;
const { handlerAsyncError } = require('../utils/index')

/* GET users listing. */
UserRouter.get('/', async (ctx)=>{
	ctx.body = 'respond with a resource'
});

//注册接口
UserRouter.post('/register',async ctx=>{
	let {userName,userPwd} = ctx.request.body;
	const mdPwd = md5(userPwd)
	// console.log(userName,userPwd)
	let user
	try{
		user = await Models.users.findOne({
			where:{
				username: userName,
				password:mdPwd
			}
		})
	}catch(err){
		return ctx.body = {
			status: "1",
			msg: err.message
		}
	}
	 
	if(user){
		return ctx.body = {
			status: '22',
			msg: '用户名和密码已存在'
		}
	}
	let userId = (Math.floor(Math.random() * 100000) + 100000000);
	let rs;
	try{
		rs = await Models.users.build({
			user_id:userId,
			username:userName,
			password:mdPwd
		}).save()
	}catch(error){
		return ctx.body = {
			status: '1',
			msg: err1.message,
			result: ''
		}
	}
	if(rs){
		return ctx.body = {
			status: '0',
			msg: '',
			result: 'success'
		}
	}
	// console.log('rs',rs)
})

//登录接口
UserRouter.post('/login',async ctx=>{
	let {userName,userPwd} = ctx.request.body;
	const mdPwd = md5(userPwd)
	let user
	try{
		user = await Models.users.findOne({
			where:{
				username: userName,
				password:mdPwd
			}
		})
	}catch(err){
		return ctx.body = {
			status: "1",
			msg: err.message
		}
	}
	if(user){
		ctx.session.username = user.get('username')
		ctx.session.userid = user.get('user_id')
		return ctx.body = {
			status: '0',
			msg: '',
			result: {
				userName: user.get('username')
			}
		}
	}else{
		return ctx.body = {
			status: '01',
			msg: '用户名或者密码错误',
			result: ''
		}
	}
})

//登出接口

UserRouter.post('/logout', async (ctx)=> {
	/* res.cookie('userId', '', {
		path: '/',
		maxAge: -1
	})
	res.json({
		
	}) */
	ctx.session = null; // 清空登录状态
	ctx.body = {
		status: 0,
		msg: '',
		result: ''
	}
})

//校验用户登录状态
UserRouter.get('/checkLogin', async(ctx) =>{
	if (ctx.session.userid) {
		ctx.body = ({
			status: '0',
			msg: '',
			result: {
				userName: ctx.session.username
			}
		})
	} else {
		ctx.body = ({
			status: '1',
			msg: '未登录',
			result: ''
		})
	}
})
//购物车数据加载
UserRouter.get('/cartList', async ctx => {
	const userId = ctx.session.userid;
	// async 错误处理
	const [err, rs] = await handlerAsyncError(Models.users.findOne({
		attributes:['user_id','username'],
		where:{
			user_id: parseInt(userId)
		},
		include:[
			{
				model:Models.goods,
				// model:Models.sellGoods,
				through: {
					attributes: ['product_image','sale_price','product_name','product_id','product_count','checked']
					// where: {completed: true}
				}
			}
		]
	}))
	
	if(err){
		return ctx.body = {
				status: '1',
				msg: err.message,
				result: ''
		}
	}

	// 组织数据
	const cartList = [];
	const user = rs.dataValues;
	const { goods } = user;
	goods.forEach(good=>{
		let item = {
			productImage: good.dataValues['product_image'],
			salePrice: good.dataValues['sale_price'],
			productName: good.dataValues['product_name'],
			productId: good.dataValues['product_id'],
			productNum: good.dataValues.carts.dataValues['product_count'],
			checked: good.dataValues.carts.dataValues['checked']
		}
		cartList.push(item)
	})
	ctx.body = {
			status: '0',
			msg: '',
			result: cartList
	}
	
})

//购物车删除商品
UserRouter.post('/cartdel', async ctx=> {
	let userId = ctx.session.userid,
	{productId} = ctx.request.body;
	let [err1,cart] = await handlerAsyncError(Models.carts.findOne({
		where:{
			user_id:userId,
			product_id:productId
		}
	}))
	if(err1){
		return ctx.body={
			status: '1',
			msg: err1.message,
			result: ''
		}
	}
	// 删除该记录
	let [err2,rs] = await handlerAsyncError(cart.destroy())
	if(err2){
		return ctx.body={
			status: '1',
			msg: err2.message,
			result: ''
		}
	}
	if(rs){
		return ctx.body = {
			status: '0',
			msg: '',
			result: 'success'
		}
	}
	/* User.update({
		userId: userId
	}, {
		$pull: {
			'cartList': {
				'productId': productId
			}
		}
	}, function(err, doc) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			})
		} else {
			res.json({
				status: '0',
				msg: '',
				result: 'succeess'
			})
		}
	}) */
})
//购物车修改
UserRouter.post('/cartedit', async ctx=>{
	let userId = ctx.session.userid,
	{productId,productNum ,checked } = ctx.request.body;
	let [err1,cart] = await handlerAsyncError(Models.carts.findOne({
		where:{
			user_id:userId,
			product_id:productId
		}
	}))
	if(err1){
		return ctx.body={
			status: '1',
			msg: err1.message,
			result: ''
		}
	}
 	let [err2,rs] = await handlerAsyncError(cart.update({product_count:productNum,checked:parseInt(checked)},{fields: ['product_count','checked']}))
	if(err2){
		return ctx.body={
			status: '1',
			msg: err2.message,
			result: ''
		}
	}
	if(rs){
		return ctx.body = {
			status: '0',
			msg: '',
			result: 'success'
		}
	}

})

UserRouter.post('/editCheckAll', async ctx=> {
	let userId = ctx.session.userid,
	{ checkAll } = ctx.request.body;
	checkAll = checkAll ? 1 : 0;
	// 更新所有商品记录状态
	let [err,rs] = await handlerAsyncError(Models.carts.update({checked:checkAll},{
		where:{
			checked:{[Op.in]:[0,1]}
		}
	}))
	if(err){
		ctx.body = {
			status: '1',
			msg: err.message,
			result: ''
		}
	}else{
		ctx.body={
			status: '0',
			msg: '',
			result: 'success'
		}
	}
})

//购车商品数量
UserRouter.get('/getCartCount', async ctx=> {
	if (ctx.session.userid) {
		let rs = await Models.carts.findAndCountAll({
			attributes: ['product_id','product_count'],
			where:{
				user_id: ctx.session.userid
			}
		})
		// console.log('rs',rs.rows[0].product_count)
		const { rows } = rs
		let count = 0;
		rows.forEach(item=>{
			count+=item.product_count
		})
		ctx.body = {
			status: '0',
			msg: '',
			result: count
		}
	}else{
		return ctx.body = {
			status:'2',
			msg:'请重新登录',
			result:'请重新登录'
		}
	}
})

//查询用户地址
UserRouter.get('/addressList', function(req, res, next) {
	var userId = req.cookies.userId;
	User.findOne({
		userId: userId
	}, function(err, doc) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			})
		} else {
			res.json({
				status: '0',
				msg: '',
				result: doc.addressList
			})
		}
	})
})
//设置默认地址
UserRouter.post('/setDefault', function(req, res, next) {
	var userId = req.cookies.userId,
		addressId = req.body.addressId;
	if (!addressId) {
		res.json({
			status: '1003',
			msg: 'addressId is null',
			result: ''
		})
	} else {
		User.findOne({
			userId: userId
		}, function(err, doc) {
			if (err) {
				res.json({
					status: '1',
					msg: err.message,
					result: ''
				})
			} else {
				var addressList = doc.addressList;
				addressList.forEach((item) => {
					if (item.addressId == addressId) {
						item.isDefault = true;
					} else {
						item.isDefault = false
					}
				})

				doc.save(function(err1, doc1) {
					if (err1) {
						res.json({
							status: '1',
							msg: err.message,
							result: ''
						})
					} else {
						res.json({
							status: '0',
							msg: '',
							result: 'succeess'
						})
					}
				})

			}
		})
	}

})
//删除地址
UserRouter.post('/delAddress', function(req, res, next) {
	var userId = req.cookies.userId,
		addressId = req.body.addressId;
	User.update({
		userId: userId
	}, {
		$pull: {
			'addressList': {
				'addressId': addressId
			}
		}
	}, function(err, doc) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			})
		} else {
			if (doc) {
				res.json({
					status: '0',
					msg: '',
					result: 'succeess'
				})
			}
		}
	})
})

//添加地址
UserRouter.post('/addAddress', function(req, res, next) {
	var param = {
		userName: req.body.userName,
		streetName: req.body.streetName,
		postCode: req.body.postCode,
		tel: req.body.tel
	}
	// console.log(param)
	var userId = req.cookies.userId
	User.findOne({
		userId: userId
	}, function(err, doc) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			})
		} else {
			// console.log(doc.addressList)
			let len = doc.addressList.length;
			let flag = false;
			let maxId = 0;
			if (len > 0) {
				doc.addressList.forEach((item) => {
					if (item.userName == param.userName && item.streetName == param.streetName && item.tel == param.tel) {
						flag = true;
					}
					if (maxId < parseInt(item.addressId)) {
						maxId = parseInt(item.addressId) + 1;
					}
				})
				if (flag) {
					res.json({
						status: '10',
						msg: '',
						result: '地址已存在'
					})
				} else {
					param['addressId'] = maxId;
					param['isDefault'] = false;
					doc.addressList.unshift(param);
					doc.save(function(err1, doc) {
						if (err1) {
							res.json({
								status: '1',
								msg: err1.message,
								result: '',
							})
						} else {
							res.json({
								status: '0',
								msg: '',
								success: 'add success'
							})

						}
					})
				}
			} else {
				param['addressId'] = (100001 + Number(len)).toString();
				param['isDefault'] = false;
				doc.addressList.unshift(param);
				doc.save(function(err1, doc) {
					if (err1) {
						res.json({
							status: '1',
							msg: err1.message,
							result: '',
						})
					} else {
						res.json({
							status: '0',
							msg: '',
							success: 'add success'
						})

					}
				})
			}

			/*res.json({
				status: '0',
				msg: '',
				result: 'add success'
			})*/
		}
	})


})

//确认订单
UserRouter.post('/payMent', function(req, res, next) {
	var userId = req.cookies.userId,
		orderTotal = req.body.orderTotal,
		addressId = req.body.addressId;
	User.findOne({
		userId: userId
	}, function(err, doc) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			})
		} else {
			//获取用户的地址信息
			var address = '',
				goodsList = [];
			doc.addressList.forEach((item) => {
				if (addressId == item.addressId) {
					address = item;
				}
			})
			//获取用户的商品信息
			doc.cartList.filter((item) => {
				if (item.checked == '1') {
					goodsList.push(item)
				}
			})

			var platForm = '622'
			var r1 = Math.floor(Math.random() * 10)
			var r2 = Math.floor(Math.random() * 10)
			var sysDate = new Date().Format('yyyyMMddhhmmss')
			var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')

			var orderId = platForm + r1 + sysDate + r2;
			var order = {
				orderId: orderId,
				orderTotal: orderTotal,
				addressInfo: address,
				goodsList: goodsList,
				orderStatus: '1',
				createDate: createDate
			}


			doc.orederList.push(order);
			doc.save(function(err1, doc1) {
				if (err1) {
					res.json({
						status: '1',
						msg: err.message,
						result: ''
					})
				} else {
					res.json({
						status: '0',
						msg: '',
						result: {
							orderId: order.orderId,
							orderTotal: order.orderTotal
						}
					})
				}
			})

		}
	})
})

//根据订单id 查询订单信息
UserRouter.get('/orderDetail', function(req, res, next) {
	var userId = req.cookies.userId,
		orderId = req.param('orderId');
	User.findOne({
		userId: userId
	}, function(err, userInfo) {
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			})
		} else {
			var orderList = userInfo.orederList;
			var orderTotal = 0;
			if (orderList.length > 0) {
				orderList.forEach((item) => {
					if (item.orderId == orderId) {
						orderTotal = item.orderTotal;
					}
				})
				if (orderTotal > 0) {
					res.json({
						status: '0',
						msg: '',
						result: {
							orderId: orderId,
							orderTotal: orderTotal
						}
					})
				} else {
					res.json({
						status: '120002',
						msg: '无此订单',
						result: ''
					})
				}

			} else {
				res.json({
					status: '120001',
					msg: '当前用户为创建订单',
					result: ''
				})
			}
		}
	})
})
module.exports = UserRouter;