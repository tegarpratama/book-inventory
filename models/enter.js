const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const enter = sequelize.define('enter', {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
   },
   stockIn: DataTypes.INTEGER
});

module.exports = enter;
