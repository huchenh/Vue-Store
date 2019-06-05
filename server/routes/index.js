// var express = require('express');
// var router = express.Router();
const Router = require('koa-router');
// const md5 = require('md5')
// const Model =require('../models/index')

// 加载路由
const GoodRouter = require('./goodRouter')
const UserRouter = require('./userRouter')
const router = new Router()

router.use('/goods',GoodRouter.routes())
router.use('/users',UserRouter.routes())

/* GET home page. */
/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

module.exports = router;
