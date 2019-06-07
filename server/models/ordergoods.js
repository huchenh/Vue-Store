'use strict';
module.exports = (sequelize, DataTypes) => {
  const orderGoods = sequelize.define('orderGoods', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    order_id: {
      type:DataTypes.STRING,
      allowNull:false,
      references:{
        model: "orders",
        key: 'order_id'
      }
    },
    product_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'goods',
        key:'product_id'
      }
    },
    product_count:{
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    tableName:'orderGoods'
  });
  orderGoods.associate = function(models) {
    // associations can be defined here
  };
  return orderGoods;
};