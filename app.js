const mongoose = require('mongoose');
const session = require('express-session');
//const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const app = express();
var User = require('./models/user');
var Checkin = require('./models/checkin');

var path = require('path');
const MongoStore = require('connect-mongo')(session);

const bodyParser = require('body-parser');
const { stringify } = require('querystring');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/WaveFinder', {useNewUrlParser: true});

app.use(require('express-session')({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
  
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  
app.post('/register', (req, res) => {
    //console.log(req.body.username)
    //console.log(req.body.password)

    User.register(new User({ username: req.body.username }), 
    req.body.password, (err, user) => {
    if (err) {
      //console.log(err);
      return res.status(500).json({ message: 'Failed to register user' });
    }
    passport.authenticate('local')(req, res, () => {
      //console.log("User registered");
      return res.status(201).json({ message: 'User registered successfully' });
    });
  });
});
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}));
app.get('/noauth', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/noauth.html'));
});
app.get('/', (req, res) => {
    //console.log("are we here?")

    if(req.isAuthenticated()){   
       // console.log("goood")

        res.sendFile(path.join(__dirname, 'public/index.html'));
    }else{
        //.log("badd")
        res.sendFile(path.join(__dirname, 'public/login.html'));
    }
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/register.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/login.html'));
});

app.post('/checkin', (req, res) => {
    //console.log("Checkin System is working")
    if(req.isAuthenticated()){
        // console.log(req.body.username)
        // console.log(req.body.lat)
        // console.log(req.body.lon)
        // console.log(req.body.event)
        // console.log(req.body.note)
        // console.log(req.body.group)
        Checkin.create(new Checkin({ 
            username: req.body.username ,
            lat: req.body.lat ,
            lon: req.body.lon, 
            event: req.body.event, 
            note: req.body.note, 
            group: req.body.group
        }))
        res.sendFile(path.join(__dirname, '/public/index.html'));


    }
    else{
        res.send("you are not authorized");
    }
   
});
app.get('/checkins', (req, res) => {
    //console.log("Checkin System is working")
    if(req.isAuthenticated()){
        Checkin.find((err, checkins) => {
            if (err) {
                res.send(err);
            } else {

                //console.log(checkins)
                res.json(checkins)
            }
            }); 

    }
    else{
        res.send("you are not authorized");
    }
   
});
app.get('/checkin', (req, res) => {
    //console.log("Checkin System is working")
    if(req.isAuthenticated()){
  
        res.sendFile(path.join(__dirname, '/public/checkin.html'));

    }
    else{
        res.send("you are not authorized");
    }
   
});
app.get('/users', (req, res) => {
    if(req.isAuthenticated()){
        User.find((err, users) => {
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

app.get('/user', (req, res) => {
    //console.log(req.session.passport.user)
    if(req.isAuthenticated()){
        User.findOne({'username': req.session.passport.user}, function(err, users){
            if(err){
              return res.send('Error');
            }
            //console.log(users)
            res.json(users);
          });
    }
    else{
        res.send("you are not authorized");
    }
   
});

app.use(express.static('public'));
app.use(express.static('images'));


app.listen(3000, () => {
  console.log('Server started on port 3000');
});


const sdk = require('api')('@fsq-developer/v1.0#17kgj534lcjp10ly');

app.get('/getbars', (req, res) => {
    if(req.isAuthenticated()){
        sdk.auth('fsq31nZd/LHTXe2cEt1nsSXfkshfuV8aRRATkqYL5G9jEJk=');
        sdk.placeSearch({query: 'Nightclub', near: 'New%20York', limit: '50'})
        .then(({ data }) => res.json(data)) 
          .catch(err => res.send(err));
    }
    else{
        res.send("you are not authorized");
    }
   
});
