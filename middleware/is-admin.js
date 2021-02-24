module.exports = (req, res, next) => {
   if (req.session.userRole != 'admin') {
      return res.redirect('/404');
   }
   next();
}