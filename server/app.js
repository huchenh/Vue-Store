const Koa = require('koa')
const KoaBodyParser = require('koa-bodyparser')
const router = require('./routes/index')
const session = require('koa-session')

const app = new Koa()
app.keys = ['this is my secret sesssion or password']

app.use(session({
  key: 'koa:sess',
  maxAge: 3600000, // 一小时失效
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false,
},app))
app.use(KoaBodyParser())
app.use(router.routes())

app.listen(9000,()=>{
  console.log('server is listening at port 9000')
}) 
