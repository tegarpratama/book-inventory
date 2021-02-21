const Sequelize = require('sequelize');

const sequelize = new Sequelize(
   'book-inventory',
   'root',
   'root',
   {
      dialect: 'mysql',
      host: 'localhost',
      logging: false
   }
);

module.exports = sequelize;