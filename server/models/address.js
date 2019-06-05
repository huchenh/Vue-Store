'use strict';
module.exports = (sequelize, DataTypes) => {
  const address = sequelize.define('address', {
   /*  id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER
    }, */
    user_id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:"users",
        key:"user_id"
      }
    },
    address_id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull:false
    },
    user_name:{
      type:DataTypes.STRING,
      allowNull:false
    },
    street_name:{
      type:DataTypes.STRING,
      allowNull:false
    },
    post_code:{
      type:DataTypes.STRING,
      allowNull:false
    },
    tel:{
      type:DataTypes.STRING,
      allowNull:false
    },
    is_default:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue: 0
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
    tableName:'addresses'
  });
  address.associate = function(models) {
    // associations can be defined here
    address.belongsTo(models.users,{
      foreignKey:'user_id'
    })
  };
  return address;
};