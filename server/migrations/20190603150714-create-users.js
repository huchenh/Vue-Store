'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      /* id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      }, */
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      username:{
        type: Sequelize.STRING,
        allowNull:false
      },
      password:{
        type:Sequelize.STRING,
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
      tableName: 'users',
      charset: 'utf8mb4',
      collate: 'utf8mb4_bin',
    }).then(()=>{
      return queryInterface.addIndex('users',{
        name: 'user_id',
        unique: true,
        fields: ['user_id']
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};