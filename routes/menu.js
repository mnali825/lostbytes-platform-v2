module.exports = function(router) {
  var mongoose = require('mongoose');
  var MenuItem = mongoose.model('MenuItem');

  router.get('/create-menu', function(req, res) {
    if (req.user) {
      MenuItem.find({}, function(err, menuItems) {
        res.render('menu', {menuItems:menuItems});
      });
    } else {
      res.redirect('/');
    }
  });

  router.post('/api/create-menu-item', function(req,res) {
    new MenuItem({
      name:req.body.name,
      cost:Number(req.body.cost)
    }).save(function(err, menuItem) {
      console.log(menuItem);
    });
  });
}