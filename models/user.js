var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var passportLocalMongoose = require('passport-local-mongoose'); 

//Create a schema
var Users = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Please enter a username'],
      unique: [true, 'Usernames must be unique']
    },
    // password:{
    //   type: String,
    //   required: [true, 'Please enter a password'],
    // },
    // name: {
    //   type: String,
    //   required: [true, 'Please enter a name'],
    // },
    // admin: {
    //   type: Boolean,
    //   default: false
    // },
    hash: {
      type: String,
      required: [
          true, 
          'There was a problem creating your password'
      ]
    },
    salt: {
        type: String,
        required: [
            true, 
            'There was a problem creating your password'
        ]
    }
});

  Users.plugin(uniqueValidator);
  Users.plugin(passportLocalMongoose);
  
  module.exports = mongoose.model('User', Users);
