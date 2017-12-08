module.exports = function(router) {
  var mongoose = require('mongoose');
  var MenuItem = mongoose.model('MenuItem');

  router.get('/create-menu', function(req, res) {
    if (req.user) {
      MenuItem.find({}, function(err, menuItems) {
        // console.log(menuItems)
        res.render('menu', { menuItems: menuItems.reverse() });
      });
    } else {
      res.redirect('/');
    }
  });

  router.post('/api/create-menu-item', function(req, res) {
    new MenuItem({
      name: req.body.name,
      cost: Number(req.body.cost)
    }).save(function(err, menuItem) {
      console.log(menuItem);
    });
  });

  router.put('/api/create-menu-item/:itemId', function(req, res) {
    MenuItem.findOne({ _id: req.params.itemId }, function(err, item) {
      req.body.name
        ? (item.name = req.body.name)
        : (item.cost = Number(req.body.cost));

      item.save(function(err, item) {
        console.log('successfully updated menu item');
        if (err) {
          res.send(err);
        }
      });
    });
  });

  router.delete('/api/create-menu-item/:itemId', function(req, res) {
    MenuItem.findByIdAndRemove(req.params.itemId, (err, item) => {
      let response = {
        message: 'Successfully deleted menu item'
      };
      res.status(200).send(response);
    });
  });
};
