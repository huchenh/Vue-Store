var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var User = require('../models/user')
mongoose.connect('mongodb://127.0.0.1:27017/mullstore');

//获取数据列表
router.get('/list', function (req, res, next) {
  let pageSize = parseInt(req.param('pageSize'));
  let currentPage = parseInt(req.param('currentPage'));
  let skip = (currentPage - 1) * pageSize;
  let len = 0
  Goods.find({}, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      len = doc.length;
      let goodsModel = Goods.find({}).sort({'_id':-1}).skip(skip).limit(pageSize);
      console.log(len)
      goodsModel.exec(function (err1, doc1) {
        if (err1) {
          res.json({
            status: 1,
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: 0,
            msg: '',
            result: {
              count: len,
              list: doc1
            }
          })
        }
      })
    }
  })


  /*goodsModel.exec(function(err, doc) {
        if (err) {
            res.json({
                status: 1,
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: 0,
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })*/
})

//编辑商品数据
router.get('/search', function (req, res, next) {
  let id = req.param('id');
  Goods.find({
    productId: id
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        mag: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc
      })
    }
  })

})
router.post('/edit', function (req, res, next) {
  let param = {
    productId: req.body.id,
    productName: req.body.name,
    salePrice: req.body.price,
    _id: req.body._id
  }
  // console.log(param, param._id)
  Goods.update({
    '_id': param._id
  }, {
    'productId': param.productId,
    'productName': param.productName,
    'salePrice': param.salePrice
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      // console.log(doc)
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
})

//删除商品
router.post('/del', function (req, res, next) {
  let id = req.body.productId;
  console.log(id);
  Goods.remove({
    productId: id
  }, function (err, doc) {
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
        result: 'del success'
      })
    }
  })

})
//添加商品
router.post('/add', function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = path.normalize(__dirname + './../../static'); //图片上传目录
  let imgurl = req.query.img+'.png';
  let param = {
    productId: req.query.productId,
    salePrice: req.query.price,
    productName: req.query.productName,
    productImage: imgurl,
    productUrl: ''
  }
  form.parse(req, function (err, fields, files) {
    var oldpath = files.file.path
    var newpath = path.normalize(__dirname + './../../static') + '\\' + req.query.img + '.png'   //给上传的图片重命名
    fs.rename(oldpath, newpath, function (err) {
      if (err) {
        res.send('-1')
        return
      }
      if (newpath) {
        console.log(param)
        let good = new Goods(param);
        good.save((err, doc) => {
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
              result: 'add success'
            })
          }
        })
      }
    })
  })


})
module.exports = router
