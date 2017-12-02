var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var Session = mongoose.model('Session');
var MenuItem = mongoose.model('MenuItem');
var Item = mongoose.model('Item');

router.get('/', function(req, res) {
  res.render('index', { user: req.user });
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.post('/login', function(req,res,next) {
  // NOTE: use the custom version of authenticate so that we can
  // react to the authentication result... and so that we can
  // propagate an error back to the frontend without using flash
  // messages
  passport.authenticate('local', function(err,user) {
    if(user) {
      // NOTE: using this version of authenticate requires us to
      // call login manually
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);
  // NOTE: notice that this form of authenticate returns a function that
  // we call immediately! See custom callback section of docs:
  // http://passportjs.org/guide/authenticate/
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  User.register(new User({username:req.body.username, fname:req.body.fname, lname:req.body.lname}), 
    req.body.password, function(err, user){
    if (err) {
      // NOTE: error? send message back to registration...
      res.render('register',{message:'Your username or password is already taken'});
    } else {
      // NOTE: once you've registered, you should be logged in automatically
      // ...so call authenticate if there's no error
      passport.authenticate('local')(req, res, function() {
        res.redirect('/create-menu');
      });
    }
  });   
});

router.get('/create-menu', function(req, res) {
  if (req.user) {
    res.render('menu')
  } else {
    res.redirect('/');
  }
});

router.get('/start-session', function(req,res) {
  if (req.user) {
    new Session({
      items:[],
      weight:0,
      cost:0
    }).save(function(err, sess) {
      MenuItem.find({}, function(err, menuItems) {
        res.render('session', {id:sess._id, menuItems:menuItems});  
      })
    });
  } else {
    res.redirect('/');
  }
})

module.exports = router;
