const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const ExitBook = sequelize.define('exitBook', {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
   },
   stockOut: DataTypes.INTEGER
});

module.exports = ExitBook;
