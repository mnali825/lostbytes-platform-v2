var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Item = new mongoose.Schema({
  name:String,
  weight:Number,
  cost:Number
});

var Session = new mongoose.Schema({
  time:{type:Date, default:Date.now},
  items:[Item],
  weight:Number,
  cost:Number

})

var User = new mongoose.Schema({
  username:String,
  password:String,
  fname:String,
  lname:String,
  sessions:[String]
});


// NOTE: we're using passport-local-mongoose as a plugin
// our schema for user looks pretty thin... but that's because
// the plugin inserts salt, password and username
User.plugin(passportLocalMongoose);
mongoose.model('User', User)
// mongoose.model('Image', Image)


mongoose.connect('mongodb://localhost/lostbytes-v2');
