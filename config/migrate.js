const sequelize = require('./database');
const User = require('../models/user');
const Book = require('../models/book');
const Enter = require('../models/enter')
const Exit = require('../models/exit');

User.hasMany(Book);
Book.belongsTo(User);

User.hasMany(Enter);
Enter.belongsTo(User);

Book.hasMany(Enter, {onDelete: 'cascade'});
Enter.belongsTo(Book);

Book.hasMany(Exit, {onDelete: 'cascade'});
Exit.belongsTo(Book);

sequelize.sync()
// sequelize.sync({force: true})
   .then(() => {
      return User.findByPk(1);
   })
   .then(user => {
      if(!user) {
         return User.bulkCreate(
            [
               { 
                  name: 'Admin', 
                  email: 'admin@mail.com', 
                  password: '$2y$08$qUOomlaSfodvtdKqRoLAjemSUfIqcEUBx4g55WCpeYk2hIjmKDSHS', 
                  role: 'admin' 
               },
               { 
                  name: 'Operator', 
                  email: 'operator@mail.com', 
                  password: '$2y$08$qX8hc4sQbFl9UG4pfJ.fAekxhPlV7VevU2PqWkjryUdDkNpM6Zk/e', 
                  role: 'operator' 
               }
            ]
         );
      }
      return user;
   })
   .catch(err => {
      console.log(err);
   });

module.exports = sequelize;