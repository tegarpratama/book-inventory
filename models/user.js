const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const User = sequelize.define('user', {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
   },
   email: DataTypes.STRING,
   password: DataTypes.STRING,
   role: DataTypes.STRING
});

module.exports = User;
