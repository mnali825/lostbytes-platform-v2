module.exports = function(router) {
  var mongoose = require('mongoose');
  var Session = mongoose.model('Session');
  var MenuItem = mongoose.model('MenuItem');
  var Item = mongoose.model('Item');
  var User = mongoose.model('User');

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

  // router.post('/api/add-item/s=:sid&t=:tid', function(req,res) {
  //   if (req.params.sid == 'guest') {

  //   } else {
  //     MenuItem.findOne({_id:req.params.tid}, function(err, menuItem) {
  //       console.log('this is the menuitem we are adding: '+ menuItem);
  //       var item = new Item({
  //         type:menuItem,
  //         weight:Number(req.body.weight),
  //         cost:Number(req.body.weight)*Number(menuItem.cost)
  //       }).save(function(err, item) {
  //         console.log(err);
  //         console.log('here: '+item);
  //         Session.findOne({_id:req.params.sid}, function(err, sess) {
  //           console.log('found the sesh: '+sess);
  //           console.log(item);
  //           sess.items.push(item);
  //           sess.weight += item.weight;
  //           sess.cost += item.cost;
  //           sess.save(function(err, sess) {
  //             console.log(sess);
  //             res.status(200).send(req.body);
  //           });
  //         });
  //       });
  //     });
  //   }
  // });

  router.post('/api/complete-session', function(req,res) {
    Session.findOne({_id:req.body.id}, function(err, sess) {
      // Add all items to sess, then on save, add sess id to user
      var items = JSON.parse(req.body.data);
      items.forEach(function(ele) {
        MenuItem.findOne({'_id':ele.tid}, function(err, menuItem) {
          new Item({
            type:menuItem,
            weight:ele.weight,
            cost:ele.cost
          }).save(function(err, item) {
            sess.items.push(item);
            sess.weight += item.weight;
            sess.cost += item.cost;
            sess.save(function(err,sess) {
              console.log(sess);
            });
          });
        });
      });
      User.findOne({username:req.user.username}, function(err, user) {
        user.sessions.push(sess._id);
        user.save(function(err, user) {
          console.log(user);
          res.redirect('/dashboard');
        });
      });
    });
  });

  router.post('/api/cancel-session', function(req,res) {
    Session.findOne({_id:req.body.id}).remove(function(err,sess) {
      console.log('removed: '+sess);
      res.redirect('/dashboard');
    });
  });
}