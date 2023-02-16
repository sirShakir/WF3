var mongoose = require('mongoose');
// var uniqueValidator = require('mongoose-unique-validator');
// var passportLocalMongoose = require('passport-local-mongoose'); 

//Create a schema
var Checkins = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Please enter a username'],
    },
    lat: {
      type: String,
      required: [
          true, 
          'There was a problem creating your lat'
      ]
    },
    lon: {
        type: String,
        required: [
            true, 
            'There was a problem creating your lon'
        ]
    },
    event:{
        type: String,
        required: [true, 'Please enter a event'],
    },
    note:{
        type: String,
        optional: [true, 'Please enter a note'], 
    },
    group:{
        type: String,
        optional: [true, 'Please enter a note'], 
    },
    created: {
        type: Date,
        default: Date.now
    },
});

// Checkins.plugin(uniqueValidator);
// Checkins.plugin(passportLocalMongoose);
  
  module.exports = mongoose.model('Checkin', Checkins);
