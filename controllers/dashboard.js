exports.getIndex = (req, res, next) => {
   res.render('main', {
      pageTitle: 'Dashboard',
      path: '/',
      view: 'dashboard/index.ejs'
   });
};