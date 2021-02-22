const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const exit = sequelize.define('exit', {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
   },
   stockOut: DataTypes.INTEGER
});

module.exports = exit;
