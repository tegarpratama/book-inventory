exports.get404 = (req, res, next) => {
   res.status(404).render('error/404', {
      pageTitle: 'Page not found',
      path: '/404',
   });
};

exports.get500 = (req, res, next) => {
   res.status(500).render('error/500', {
      pageTitle: 'Something when wrong',
      path: '/500',
   });
};