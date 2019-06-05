// 常用的函数处理
exports.handlerAsyncError = function(promise){
  return promise.then(res=>[null,res]).catch(err=>[err,null])
}