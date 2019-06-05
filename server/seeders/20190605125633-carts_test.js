'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Carts',[
      {
        user_id: 100000580,
        product_id: 201710004,
        product_count: 1,
        checked: 0,
        createdAt: new Date,
        updatedAt: new Date
      },
      {
        user_id: 100000580,
        product_id: 201710006,
        product_count: 2,
        checked: 0,
        createdAt: new Date,
        updatedAt: new Date
      }
    ],{
      timestamps:true
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
     return queryInterface.bulkDelete('Carts', null, {});
  }
};
