module.exports = function(router) {
  var mongoose = require('mongoose');
  var User = mongoose.model('User');
  var Session = mongoose.model('Session');

  router.get('/dashboard', function(req,res) {
    if (req.user) {
      //Get all sessions from id's stored in user obj
      Session.find({_id: {$in:req.user.sessions} }, function(err, sessions) {
        if (sessions != '') {
          console.log('we still here');
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
          var totalCost = 0;
          var totalWeight = 0;
          var recentWeight = 0;
          var recentCost = 0;

          
          items.forEach(function(ele) {
            totalCost+=ele.cost;
            totalWeight+=ele.weight;
          });
          recentCost = items[0].cost;
          recentWeight = items[0].weight;
          

          res.render('dashboard', {items:output, totalCost:totalCost, totalWeight:totalWeight, recentWeight:recentWeight, recentCost:recentCost});              
        } else {
          res.render('dashboard', {totalCost:0, totalWeight:0,recentWeight:0,recentCost:0});
        }

      });
    } else {
      res.redirect('/');
    }
  });
}
