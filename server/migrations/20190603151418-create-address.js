'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Addresses', {
     /*  id: {
        allowNull: false,
        autoIncrement: true,
        
        type: Sequelize.INTEGER
      }, */
      user_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
      },
      address_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull:false
      },
      user_name:{
        type:Sequelize.STRING,
        allowNull:false
      },
      street_name:{
        type:Sequelize.STRING,
        allowNull:false
      },
      post_code:{
        type:Sequelize.STRING,
        allowNull:false
      },
      tel:{
        type:Sequelize.STRING,
        allowNull:false
      },
      is_default:{
        type:Sequelize.INTEGER,
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
      tableName: 'addresses',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin'
    }).then(()=>{
      return queryInterface.addIndex('addresses',{
        name: 'user_id',
        fields: ['user_id']
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('addresses');
  }
};