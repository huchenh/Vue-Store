const Router = require('koa-router');

// 加载路由
const GoodRouter = require('./goodRouter')
const UserRouter = require('./userRouter')
const AdminRouter = require('./adminIndex')
const router = new Router()

router.use('/goods',GoodRouter.routes())
router.use('/users',UserRouter.routes())
router.use('/admin',AdminRouter.routes())
/* GET home page. */
/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

module.exports = router;
