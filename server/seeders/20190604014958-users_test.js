'use strict';
const md5 = require('md5')
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
    return queryInterface.bulkInsert('Users',[
        {
          user_id:100000077,
          username:'admin',
          password:md5('123456'),
          createdAt: new Date,
          updatedAt: new Date
        },
        {
          user_id:100000580,
          username:'chenhu',
          password:md5('123456'),
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
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
