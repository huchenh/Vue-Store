'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
   /*  id:{
      allowNull: false,
      autoIncrement: true,
      
      type: DataTypes.INTEGER
    }, */
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    username:{
      type: DataTypes.STRING,
      allowNull:false
    },
    password:{
      type:DataTypes.STRING,
      allowNull:false
    },
    is_admin:{
      type:DataTypes.INTEGER(1),
      defaultValue: 0
    }
  }, {
    tableName: 'users'
  });
  users.associate = function(models) {
    // associations can be defined here
    /* users.belongsTo(models.carts,{
      foreignKey: 'user_id'
    }) */
    
    users.hasMany(models.address,{
      foreignKey: 'user_id'
    })
    users.hasMany(models.orders,{
      foreignKey: 'user_id'
    })
    users.belongsToMany(models.goods,{
      // as:'',
      foreignKey:'user_id',
      through: {
        model: models.carts
      }
    })
    // users.belongsTo(models.carts,{
     
    //   foreignKey:'user_id',
     
    // })
  };
  return users;
};