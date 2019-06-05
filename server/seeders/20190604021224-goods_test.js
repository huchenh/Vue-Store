'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      return queryInterface.bulkInsert('Goods',[
        {
          product_id:201710004,
          product_name:'头戴式耳机-3',
          sale_price:80,
          product_image:'2.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710005,
          product_name:'小米笔记本',
          sale_price:3549,
          product_image:'note.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710006,
          product_name:'小米6',
          sale_price:2499,
          product_image:'mi6.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710002,
          product_name:'智能插线板',
          sale_price:59,
          product_image:'6.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710007,
          product_name:'自拍杆',
          sale_price:39,
          product_image:'zipai.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710008,
          product_name:'小米净水器',
          sale_price:1999,
          product_image:'8.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710009,
          product_name:'IH 电饭煲',
          sale_price:999,
          product_image:'9.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710010,
          product_name:'小米电视4A',
          sale_price:2099,
          product_image:'10.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710012,
          product_name:'Ear1100',
          sale_price:1100,
          product_image:'12.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710013,
          product_name:'Ear2000',
          sale_price:2000,
          product_image:'13.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710014,
          product_name:'Ear1600',
          sale_price:1600,
          product_image:'14.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710015,
          product_name:'Ear1200',
          sale_price:1200,
          product_image:'15.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710016,
          product_name:'Ear700',
          sale_price:700,
          product_image:'16.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710017,
          product_name:'小钢炮蓝牙音箱',
          sale_price:129,
          product_image:'1.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:201710018,
          product_name:'智能摄像机',
          sale_price:389,
          product_image:'photo.jpg',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        },
        {
          product_id:20171020,
          product_name:'三星',
          sale_price:2345,
          product_image:'sanxing.png',
          product_url:'',
          createdAt:new Date,
          updatedAt:new Date
        }
      ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Goods', null, {});
  }
};
