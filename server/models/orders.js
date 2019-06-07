'use strict';
module.exports = (sequelize, DataTypes) => {
  const orders = sequelize.define('orders', {
    /* id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    }, */ 
    order_id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model: "users",
        key: 'user_id'
      }
    },
    address_id:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    order_total:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    createDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updateDate: {
      allowNull: false,
      type: DataTypes.DATE
    }
    // user_id: DataTypes.INTEGER
  }, {
    tableName:'orders',
    createdAt:'createDate',
    updatedAt:'updateDate',
    timestamps:true
  });
  orders.associate = function(models) {
    // associations can be defined here
    orders.belongsTo(models.users,{
      foreignKey:'user_id'
    })
    orders.belongsToMany(models.goods,{
      // as:'sellGoods',
      foreignKey:'product_id',
      through: {
        model: models.orderGoods
      }
    })
  };
  return orders;
};