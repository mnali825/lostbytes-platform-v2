module.exports = function(router) {
  var mongoose = require('mongoose');
  var User = mongoose.model('User');
  var Session = mongoose.model('Session');

  router.get('/dashboard', function(req,res) {
    if (req.user) {
      Session.find({_id: {$in:req.user.sessions} }, function(err, sessions) {
        console.log(sessions);
        var items = [];
        sessions.forEach(function(sess) {
          Array.prototype.push.apply(items,sess.items);
        });
        res.render('dashboard', {items:items});
      });
    } else {
      res.redirect('/');
    }
  });
}