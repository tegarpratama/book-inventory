const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const IncomeBook = sequelize.define('incomeBook', {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
   },
   stockIn: DataTypes.INTEGER
});

module.exports = IncomeBook;
