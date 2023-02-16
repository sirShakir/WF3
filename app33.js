var createError = require('http-errors');
var express = require('express');
//const session = require('express-session');
var mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var path = require('path');
var cookieParser = require('cookie-parser');
var Users = require('./models/users');
mongoose.connect('mongodb://127.0.0.1:27017/WaveFinder', {useNewUrlParser: true});
var app = express();
//app.use(cookieParser());
//~line 32 before routes
app.use(require('express-session')({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(Users.createStrategy());


//passport.use(Users.createStrategy());
passport.serializeUser(function(user, done){
    done(null,{
      id: user._id,
      username: user.username,
    });
  });
passport.deserializeUser(Users.deserializeUser());






// app.use(function(req,res,next){
//     var userSession={};
//     if(req.isAuthenticated()){
//       userSession = req.session.passport.user;
//     }
//     req.app.locals = {
//       session: {
//         user: userSession
//       }
//     }
//     next();
// });
// app.use(function(req,res,next){
//     if(req.isAuthenticated()){
//       console.log("Great you are authenicated")
//       return next();
//     }
//     console.log("Not authenicated")
//     res.sendFile(path.join(__dirname, '/public/noauth.html'));
//   });




app.get('/user/create', function(req,res,next){ 
    var data = req.body;
    Users.register(new Users({
      username: "qaz",
    }), 
    "qaz", 
    function(err, user){
 
      if(err){
  
        return res.json({
          success: false, 
          user: req.body, 
          errors: err
        });
        
      }
      //res.redirect('/land/users/login');
      console.log("demo user was created")
    });
});
app.post('/user/create', function(req,res,next){ 
    var data = req.body;
    User.register(new Users({
      username: data.username,
    }), 
    data.password, 
    function(err, user){
 
      if(err){
  
        return res.json({
          success: false, 
          user: req.body, 
          errors: err
        });
        
      }
      //res.redirect('/land/users/login');
      console.log("success")
    });
});
// Get all users
app.get('/users', (req, res) => {
    if(req.isAuthenticated()){
        Users.find((err, users) => {
        if (err) {
            res.send(err);
        } else {
            res.send(users);
        }
        }); 
    }
    else{
        res.send("you are not authorized");
    }
   
});

app.get('/noauth', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/noauth.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/login.html'));
});
// app.post('/login', passport.authenticate('local'),function(req, res){
//     var data = req.body;
//     console.log(data)
//     res.sendFile(path.join(__dirname, '/public/login.html'));
// });

// app.post('/login', passport.authenticate('local', {
//     successRedirect: '/success',
//     failureRedirect: '/noauth',
// }));
// app.post('/login',function(req, res){
//     var data = req.body;
//     console.log(data)
//     res.sendFile(path.join(__dirname, '/public/login.html'));
// });

app.post('/login', function(req, res, next) {
    //
    passport.authenticate('local', function(err, user, info) {
 
      if (err) { 
        
        return res.json({success:false, error: err});
      }
  
      if (!user) {
        console.log(user);
        console.log(info)
        return res.json({success:false, error: info.message });
      }
  
      req.logIn(user, function(err) {
  
        if (err) { 
          return res.json({success:false, error: err });
        }
  
        //we will use a console.log() to test the session data
        console.log(req.session);
  
        return res.json({success:true, user: user });
  
      });
    })(req, res, next);
  });

app.listen(5000,() => {
    console.log("App is listening on Port 5000")
})







