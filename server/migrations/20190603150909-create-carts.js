'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Carts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      product_count:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      checked:{
        type: Sequelize.INTEGER(1),
        allowNull:false,
        defaultValue: 0
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
      tableName: 'carts',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin'
    }).then(()=>{
      return queryInterface.addIndex('carts',[
        {
          name: 'user_id',
          fields: ['user_id']
        },
        {
          name: 'product_id',
          fields: ['product_id']
        }
      ])
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('carts');
  }
};