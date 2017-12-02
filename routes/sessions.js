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
      res.render('session', {id:'guest'});
    }
  });

  router.post('/api/add-item?s=:sid&t=tid', function(req,res) {
    if (req.params.sid == 'guest') {

    } else {
      MenuItem.findOne({_id:req.params.tid}, function(err, menuItem) {
        new Item({
          type:menuItem,
          weight:Number(req.body.weight),
          cost:Number(req.body.weight)*Number(menuItem.cost)
        }).save(function(err, item) {
          Session.findOne({_id:req.params.sid}, function(err, ses) {
            sess.items.push(item);
            sess.save(function(err, sess) {
              console.log(sess);
            });
          });
        });
      });
    }
  });
}