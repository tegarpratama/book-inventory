exports.getIndex = (req, res, next) => {
   res.render('main', {
      pageTitle: 'Dashboard',
      path: '/',
      view: 'pages/dashboard/index.ejs',
      csrfToken: req.csrfToken(),
      type: req.flash('type'),
      message: req.flash('message')
   });
};