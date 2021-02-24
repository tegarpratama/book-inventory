module.exports = (req, res, next) => {
   if(req.isAuth) {
      return res.redirect('/login');
   }
   next();
}