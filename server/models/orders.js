'use strict';
module.exports = (sequelize, DataTypes) => {
  const orders = sequelize.define('orders', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model: "users",
        key: 'user_id'
      }
    },
    order_id:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    address_id:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    order_total:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
    // user_id: DataTypes.INTEGER
  }, {
    tableName:'orders'
  });
  orders.associate = function(models) {
    // associations can be defined here
    orders.belongsTo(models.users,{
      foreignKey:'user_id'
    })
  };
  return orders;
};