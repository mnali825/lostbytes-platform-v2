module.exports = function(router) {
  router.get('/create-menu', function(req, res) {
    if (req.user) {
      res.render('menu')
    } else {
      res.redirect('/');
    }
  });
}