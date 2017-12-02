module.exports = function(router) {
  router.get('/start-session', function(req,res) {
    if (req.user) {
      new Session({
        items:[],
        weight:0,
        cost:0
      }).save(function(err, sess) {
        console.log(sess);
        MenuItem.find({}, function(err, menuItems) {
          res.render('session', {id:sess._id, menuItems:menuItems});  
        })
      });
    } else {
      res.redirect('/');
    }
  });
}