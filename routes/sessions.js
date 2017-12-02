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
          Session.findOne({_id:req.params.sid}, function(err, sess) {
            sess.items.push(item);
            sess.weight += item.weight;
            sess.cost += item.cost;
            sess.save(function(err, sess) {
              console.log(sess);
            });
          });
        });
      });
    }
  });

  router.post('/api/finish-session?s=:id', function(req,res) {
    Session.findOne({_id:req.params.id}, function(err, sess) {
      User.findOne({username:req.params.username}, function(err, user) {
        user.sessions.push(sess._id);
        user.save(function(err, user) {
          console.log(user);
        });
      });
    });
  });
}