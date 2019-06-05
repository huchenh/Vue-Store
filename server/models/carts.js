'use strict';
module.exports = (sequelize, DataTypes) => {
  const carts = sequelize.define('carts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'users',
        key:'user_id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'goods',
        key:'product_id'
      }
    },
    checked:{
      type: DataTypes.INTEGER(1),
      allowNull:false,
      defaultValue: 0
    },
    product_count:{
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
    // product_id: DataTypes.INTEGER
  }, {
    tableName: 'carts'
  });
  carts.associate = function(models) {
    // associations can be defined here
    // belongsTo
    /* models.goods.belongsToMany(models.users,{
      foreignKey:'product_id',
      through: {
        model: carts
      }
    })
    models.users.belongsToMany(models.goods,{
      foreignKey:'user_id',
      through: {
        model: carts
      }
    }) */
   
    /*  carts.belongsTo(models.users,{
      foreignKey:'user_id'
    })
    // product_id
    carts.hasMany(models.goods,{
      foreignKey:'product_id'
    }) */
  };
  return carts;
};