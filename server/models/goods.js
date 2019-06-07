'use strict';
module.exports = (sequelize, DataTypes) => {
  const goods = sequelize.define('goods', {
  /*   id: {
      allowNull: false,
      autoIncrement: true,
      // primaryKey: true,
      type: DataTypes.INTEGER
    }, */
    product_id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      primaryKey: true
    },
    product_name:{
      type:DataTypes.STRING,
      allowNull:false
    },
    sale_price:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    product_image:{
      type:DataTypes.STRING,
      allowNull:false
    },
    product_url:{
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:""
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
    // product_id: DataTypes.INTEGER
  }, {
    tableName: 'goods'
  });
  goods.associate = function(models) {
    // associations can be defined here
    /* goods.belongsTo(models.carts,{
      foreignKey: 'product_id'
    }) */
    goods.belongsToMany(models.users,{
      // as:'sellGoods',
      foreignKey:'product_id',
      through: {
        model: models.carts
      }
    })
    goods.belongsToMany(models.orders,{
      // as:'sellGoods',
      foreignKey:'product_id',
      through: {
        model: models.orderGoods
      }
    })
  };
  return goods;
};