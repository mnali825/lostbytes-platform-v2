module.exports = function(router) {
  var mongoose = require('mongoose');
  var User = mongoose.model('User');
  var Session = mongoose.model('Session');

  router.get('/dashboard', function(req,res) {
    if (req.user) {
      //Get all sessions from id's stored in user obj
      Session.find({_id: {$in:req.user.sessions} }, function(err, sessions) {
        console.log(sessions);
        var items = [];
        sessions.forEach(function(sess) {
          Array.prototype.push.apply(items,sess.items);
        });

        // Compress and calculate aggregate of repeated menu items
        var output = [];
        items.forEach(function(item) {
          var existing = output.filter(function(val, i) {
            return val.type.name == item.type.name;
          });
          if (existing.length) {
            var existingIndex = output.indexOf(existing[0]);
            output[existingIndex].weight += item.weight;
            output[existingIndex].cost += item.cost;
          } else {
            output.push(item);
          }
        });

        // Get total cost & weight
        var totalCost = items.reduce(function(a,b) {return a.cost+b.cost;});
        var totalWeight = items.reduce((a,b)=>a.weight+b.weight);

        res.render('dashboard', {items:output, totalCost:totalCost, totalWeight:totalWeight});
      });
    } else {
      res.redirect('/');
    }
  });
}