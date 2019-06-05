'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Goods', {
      /* id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      }, */
      product_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true
      },
      product_name:{
        type:Sequelize.STRING,
        allowNull:false
      },
      sale_price:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      product_image:{
        type:Sequelize.STRING,
        allowNull:false
      },
      product_url:{
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:""
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
      tableName: 'goods',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin'
    }).then(()=>{
      return queryInterface.addIndex('goods',{
        name: 'product_id',
        fields: ['product_id']
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('goods');
  }
};