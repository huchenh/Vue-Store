const AdminRouter = require('koa-router')()
const Models =require('../models/index')
const { Sequelize:{Op} } = Models.sequelize;
const { handlerAsyncError } = require('../utils/index')
const path = require('path')
const fs= require('fs')
//获取数据列表
AdminRouter.get('/list', async ctx=> {
  if(!ctx.session.userid){
    return ctx.body={
      status:'22',
      msg:'请重新登录'
    }
  }
  let {pageSize,currentPage} = ctx.request.query ;
  pageSize = parseInt(pageSize)
  let skip = (currentPage - 1) * pageSize;
  console.log(pageSize,currentPage)
  let [err,res] = await handlerAsyncError(Models.goods.findAndCountAll({
    order:[['updatedAt','DESC']],
    offset:skip,
    limit: pageSize
  }))
  if(err){
    ctx.response.status = 500;
    return ctx.body = {
      status: '1',
			msg: err.message,
			result: ''
    }
  }
  let {count,rows} = res
  ctx.body = {
    status: 0,
    msg: '',
    result: {
      count,
      list: rows
    }
  }
})

//编辑商品数据
AdminRouter.get('/search', async ctx=> {
  let {id} = ctx.request.query;
  let [err,good] = await handlerAsyncError(Models.goods.findOne({
    where:{
      product_id:id
    }
  }))
  if(err){
    ctx.response.status = 500;
    return ctx.body ={
      status:'1',
      msg:err.message,
      result:''
    }
  }
  ctx.body = {
    status: '0',
    msg: '',
    result: good
}
  
})
AdminRouter.post('/edit', async ctx=> {
  let { id:productId,name:productName,price:salePrice } = ctx.request.body;
  console.log(productId,productName,salePrice)
  // return;
  let [err,good] = await handlerAsyncError(Models.goods.findOne({
    where:{
      product_id:productId
    }
  }))
  if(err){
    ctx.response.status = 500;
    return ctx.body={
      status: '1',
      msg: err.message,
      result: ''
    }
  }
  // 更新数据
  let [error,res] = await handlerAsyncError(good.update({
    product_id:productId,
    product_name:productName,
    sale_price:salePrice
  },{fields:['product_id','product_name','sale_price']}))
  
  if(error){
    return ctx.body={
      status: '1',
      msg: error.message,
      result: ''
    }
  }
  ctx.body = {
    status: '0',
    msg: '',
    result: ''
  }
})

//删除商品
AdminRouter.post('/del', async ctx=> {
  let productId = ctx.request.body.productId;
  console.log(productId);
  if(!productId){
    ctx.response.status = 500;
    return ctx.body = {
      status:'11',
      msg:'请传入商品id',
      result:''
    }
  }
  let [err,rs] = await handlerAsyncError(Models.goods.destroy({
    where:{
      product_id:productId
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

  ctx.body = {
    status: '0',
    msg: '',
    result: 'del success'
  }
  
})
//添加商品
AdminRouter.post('/add', async ctx=> {
  let { productId:product_id,price:sale_price,productName:product_name,img:product_image} = ctx.request.query;
  // console.log(product_id,sale_price,product_name,product_image)
  // 获取最大的商品id
  let [error,good] = await handlerAsyncError(Models.goods.findOne({
    limit:1,
    order:[['product_id','DESC']]
  }))
  if(error){
    ctx.response.status = 500;
    return ctx.body = {
      status:'1',
      msg:error.message,
      result:''
    }
  }
  product_id = product_id > good.product_id ? product_id : ++good.product_id;
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, './../../static') + `/${file.name}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  // return ctx.body = "上传成功！";
  let [err,res] = await handlerAsyncError(Models.goods.create({
    product_id,
    product_name,
    product_image:file.name,
    sale_price,
    product_url:''
  }))

  if(err){
    ctx.response.status = 500;
    return ctx.body={
      status:'1',
      msg:err.message,
      result:''
    }
  }
  ctx.body = {
    status: '0',
    msg: '',
    result: 'add success'
  }
})
module.exports = AdminRouter;
