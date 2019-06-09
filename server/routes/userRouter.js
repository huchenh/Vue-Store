const UserRouter = require('koa-router')()
const Models =require('../models/index')
const md5 = require('md5')
const { Sequelize:{Op} } = Models.sequelize;
const { handlerAsyncError } = require('../utils/index')

/* GET users listing. */
/* UserRouter.get('/', async (ctx)=>{
	// 登录校验
  var userId = ctx.session.userid;
	if(!userId){
		return ctx.body ={
			status: '1',
			msg: "请先登录",
			result: '请先登录'
		}
  }else{
    next()
	}
	console.log('登录校验')
});
 */
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
		ctx.response.status = 500;
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
		ctx.response.status = 500;
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
		ctx.response.status = 500;
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
				userName: user.get('username'),
				isAdmin: user.get('is_admin')
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
		ctx.response.status = 500;
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
		ctx.response.status = 500;
		return ctx.body={
			status: '1',
			msg: err1.message,
			result: ''
		}
	}
	// 删除该记录
	let [err2,rs] = await handlerAsyncError(cart.destroy())
	if(err2){
		ctx.response.status = 500;
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
		ctx.response.status = 500;
		return ctx.body={
			status: '1',
			msg: err1.message,
			result: ''
		}
	}
 	let [err2,rs] = await handlerAsyncError(cart.update({product_count:productNum,checked:parseInt(checked)},{fields: ['product_count','checked']}))
	if(err2){
		ctx.response.status = 500;
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
		ctx.response.status = 500;
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
UserRouter.get('/addressList', async ctx=> {
	var userId = ctx.session.userid;
	if(!userId){
		return ctx.body ={
			status: '1',
			msg: "请先登录",
			result: '请先登录'
		}
	}
	let [err,rs] = await handlerAsyncError(Models.address.findAll({
		where:{
			user_id:userId
		}
	}))
	if(err){
		ctx.response.status = 500;
		return ctx.body = {
			status: '1',
			msg: err.message,
			result: ''
		}
	}
	let addressList = [];
	if(rs){
		rs.forEach(item=>{
			let {user_id:userId,address_id:addressId,user_name:userName,street_name:streetName,post_code:postCode,tel,is_default:isDefault} = item;
			addressList.push({
				userId,
				addressId,
				userName,
				streetName,
				postCode,
				tel,
				isDefault
			})
		})
		return ctx.body = {
			status: '0',
			msg: '',
			result: addressList
		}
	}
})
//设置默认地址
UserRouter.post('/setDefault', async ctx=> {
	let userId = ctx.session.userid,
		{addressId} = ctx.request.body;
	if (!addressId) {
		return ctx.body = {
			status: '1003',
			msg: 'addressId is null',
			result: ''
		}
	}
	let [err,address] = await handlerAsyncError(Models.address.findOne({
		attributes:['address_id','is_default'],
		where:{
			user_id: userId,
			address_id:addressId
		}
	}))
	if(err){
		ctx.response.status = 500;
		return ctx.body = {
			status: '1',
			msg: err.message,
			result: ''
		}
	}
	console.log('address',address.is_default)
	if(address && address.is_default == 0){
		// 先清楚其他地址的默认设置
		let [error,res] = await handlerAsyncError(Models.address.update(
			{is_default:0},
			{where:{'is_default':1}}
		))
		if(error){
			ctx.response.status = 500;
			return ctx.body = {
				status: '1',
				msg: err.message,
				result: ''
			}
		}	
		address.is_default = 1
		let [err,rs] = await handlerAsyncError(address.save())
		if(err){
			ctx.response.status = 500;
			return ctx.body = {
				status: '1',
				msg: err.message,
				result: ''
			}
		}			
		if(rs){
			return ctx.body = {
				status: '0',
				msg: '',
				result: 'succeess'
			}
		}
		
	}else{
		ctx.body = {
			status: '0',
			msg: '',
			result: 'succeess'
		}
	}
})
//删除地址
UserRouter.post('/delAddress', async ctx=> {
	let userId = ctx.session.userid,
		{addressId} = ctx.request.body;
	let [err,rs] = await handlerAsyncError(Models.address.destroy({
		where:{
			user_id:userId,
			address_id:addressId
		}
	}))
	if(err){
		return ctx.body = {
			status: '1',
			msg: err.message,
			result: ''
		}
	}else{
		// console.log('rs',rs)
		ctx.body = {
			status: '0',
			msg: '',
			result: 'succeess'
		}
	}
})

//添加地址
UserRouter.post('/addAddress', async ctx=> {
	let userId = ctx.session.userid;
	let { userName,streetName,postCode,tel } = ctx.request.body
	console.log('param',userName,streetName,postCode,tel)
	let [err,address] = await handlerAsyncError(Models.address.findOne({
		where:{
			user_name:userName,
			street_name:streetName,
			post_code:postCode,
			tel:tel
		}
	}))
	if(err){
		ctx.response.status = 500;
		return ctx.body = {
			status: '1',
			msg: err.message,
			result: ''
		}
	}
	if(address){
		return ctx.body = {
			status: '10',
			msg: '',
			result: '地址已存在'
		}
	}
	// 新增地址
	let [err1,address1] = await handlerAsyncError(Models.address.findAll({
		attributes:['address_id','user_name'],
		order:[['address_id','DESC']],
		limit:1
	}))
	console.log('address1',address1)
	// console.log('address1',address1[0].address_id)
	if(err1){
		ctx.response.status = 500;
		return ctx.body = {
			status: '1',
			msg: err1.message,
			result: ''
		}
	}
	// 初始地址编号
	let addressId = 100000; 
	if(address1.length > 0){
		addressId = address1[0].address_id + 1; 
	}
	let [err2,rs] = await handlerAsyncError(Models.address.create({
		user_id:userId,
		address_id:addressId,
		user_name:userName,
		street_name:streetName,
		post_code:postCode,
		tel
	}))
	if(err2){
		ctx.response.status = 500;
		return ctx.body = {
			status: '1',
			msg: err2.message,
			result: ''
		}
	}else{
		return ctx.body={
			status: '0',
			msg: '',
			success: 'add success'
		}
	}
	
})

//确认订单
UserRouter.post('/payMent', async ctx=> {
	let userId = ctx.session.userid,
		{ orderTotal , addressId } = ctx.request.body;
	//user_id order_id address_id order_total
	let platForm = '622',
	r1 = Math.floor(Math.random() * 10),
	r2 = Math.floor(Math.random() * 10),
	sysDate = new Date().getTime(),
	createDate = new Date(),
	orderId = platForm + r1 + sysDate + r2;

	// 获取商品信息
	let [error,usergoods] = await handlerAsyncError(Models.carts.findAll({
		attributes:['user_id','product_id','product_count'],
		where:{
			user_id:userId,
			checked:1
		}
	}))
	if(error){
		ctx.response.status = 500;
		return ctx.body = {
			status: '1',
			msg: error.message,
			result: ''
		}
	}
	let orderGoods = []
	usergoods.forEach(item=>{
		orderGoods.push({
			order_id:orderId,
			product_id:item.product_id,
			product_count:item.product_count
		})
	})
	// console.log('ordergoods',orderGoods)
	// return;
	// 订单商品表插入数据 usergoods
	let [error1,res1] = await handlerAsyncError(Models.orderGoods.bulkCreate(orderGoods))
	if(error1){
		ctx.response.status = 500;
		return ctx.body = {
			status: '1',
			msg: error1.message,
			result: ''
		}
	}

	// console.log('usergoods',usergoods)
	// 订单表添加记录
	let [err,res] = await handlerAsyncError(	Models.orders.create({
		user_id:userId,
		order_id:orderId,
		address_id:addressId,
		order_total:orderTotal,
		createDate,
		updateDate:createDate
	}))
	if(err){
		ctx.response.status = 500;
		return ctx.body = {
			status: '1',
			msg: err.message,
			result: ''
		}
	}

	// 购物车商品移除 已生成订单的商品
	let [error2,res2] = await handlerAsyncError(Models.carts.destroy({
		where:{
			user_id:userId,
			checked:1
		}
	}))

	if(error2){
		ctx.response.status = 500;
		return ctx.body = {
			status: '1',
			msg: error2.message,
			result: ''
		}
	}
	ctx.body = {
		status: '0',
		msg: '',
		result: {
			orderId,
			orderTotal
		}
	}
})

// 订单列表
UserRouter.get('/orderList', async ctx=>{
	let userId = ctx.session.userid
	let [err,res] = await handlerAsyncError(Models.orders.findAll({
		where:{
			user_id:userId
		},
		include:[
			{model:Models.address},
			{model:Models.goods}
		]
	}))
	if(err){
		ctx.response.status = 500;
		ctx.response.status = 500;
		return ctx.body = {
			status:'1',
			msg: err.message
		}
	}
	ctx.body = {
		status:'0',
		msg:'',
		result:res
	}
})

//订单成功信息
UserRouter.get('/orderSuccess', async ctx=> {
	let userId = ctx.session.userid,
		{orderId} = ctx.request.query;
	let [err,res] = await handlerAsyncError(Models.orders.findOne({
		where:{
			user_id:userId,
			order_id:orderId
		}
	}))
	if(err){
		ctx.response.status = 500;
		return ctx.body = {
			status: '1',
			msg: err.message,
			result: ''
		}
	}
	if(res){
		return ctx.body = {
			status: '0',
			msg: '',
			result: {
				orderId,
				orderTotal:res.order_total
			}
		}
	}else{
		return ctx.body = {
			status: '120002',
			msg: '无此订单',
			result: ''
		}
	}
})

// 根据订单id 查询订单信息
UserRouter.get('/orderDetail',async ctx=>{
	let userId = ctx.session.userid,
		{orderId} = ctx.request.query;
	let [err,res] = await handlerAsyncError(Models.orders.findOne({
		where:{
			user_id:userId,
			order_id:orderId
		},
		include:[
			{model:Models.address},
			{model:Models.goods}
		]
	}))
	if(err){
		ctx.response.status = 500;
		return ctx.body = {
			status:'1',
			msg: err.message
		}
	}
	// console.log('res',res)
	// console.log('address',res.address)
	// console.log('goods',res.goods)
	// return
	ctx.body = {
		status:'0',
		msg:'',
		result:res
	}
})
module.exports = UserRouter;