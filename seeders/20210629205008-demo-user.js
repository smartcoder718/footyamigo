'use strict';
const bcrypt = require('bcryptjs');
const password = bcrypt.hashSync("Vishal123", 10)


console.log(password)
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: 'Vishal Basumatary',
      email: 'vishalbty@gmail.com',
      role: 'trial',
      password: password,
      telegram: 342833991,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};