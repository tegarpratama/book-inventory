const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const Book = sequelize.define('book', {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
   },
   title: DataTypes.STRING,
   author: DataTypes.STRING,
   publisher: DataTypes.STRING,
   description: DataTypes.TEXT,
   price: DataTypes.INTEGER,
   cover: DataTypes.STRING,
   totalPages: DataTypes.INTEGER,
   stock: DataTypes.INTEGER,
});

module.exports = Book;