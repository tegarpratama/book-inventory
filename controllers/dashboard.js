exports.getIndex = (req, res, next) => {
   res.render('main', {
      pageTitle: 'Dashboard',
      path: '/',
      view: 'pages/dashboard/index.ejs',
      type: req.flash('type'),
      message: req.flash('message')
   });
};