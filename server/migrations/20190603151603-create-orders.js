'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      order_id:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      address_id:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      order_total:{
        type: Sequelize.INTEGER,
        allowNull:false
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
      tableName: 'orders',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin'
    }).then(()=>{
      return queryInterface.addIndex('orders',[
        {
          name: 'user_id',
          fields: ['user_id']
        },
        {
          name: 'address_id',
          fields: ['address_id']
        }
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('orders');
  }
};