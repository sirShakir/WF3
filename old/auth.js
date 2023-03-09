const express = require('express')
const path = require('path');

const app = express()
 
const passport = require('passport')
 
const cookieParser = require('cookie-parser')
 
const session = require('express-session')
 
const User = require('./models/user')
 
const facebookStrategy = require('passport-facebook').Strategy

//app.set("view engine","ejs")
//app.set('view engine', 'html'); 
app.use(session({
    secret: 'ilovescotchjjscotchyscotchscotch',
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
 
passport.use(new facebookStrategy({
 
    // pull in our app id and secret from our auth.js file
    clientID        : "5988209211225462",
    clientSecret    : "dff5623fed1937bb309f55365637c2d1",
    callbackURL     : "http://localhost:5000/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
 
},// facebook will send back the token and profile
function(token, refreshToken, profile, done) {
 
    // asynchronous
    process.nextTick(function() {
 
        // find the user in the database based on their facebook id
        User.findOne({ 'uid' : profile.id }, function(err, user) {
 
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);
 
            // if the user is found, then log them in
            if (user) {
                console.log("user found")
                console.log(user)
                return done(null, user); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them
                var newUser            = new User();
 
                // set all of the facebook information in our user model
                newUser.uid    = profile.id; // set the users facebook id                  
                newUser.token = token; // we will save the token that facebook provides to the user                    
                newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                newUser.gender = profile.gender
                newUser.pic = profile.photos[0].value
                // save our user to the database
                newUser.save(function(err) {
                    if (err)
                        throw err;
 
                    // if successful, return the new user
                    return done(null, newUser);
                });
            }
 
        });
 
    })
 
}));
 
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
 
// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
 

 
app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
 
app.get('/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : path.join(__dirname, '/index.html'),
            failureRedirect : path.join(__dirname, '/auth.html')
        }),

        );
 
app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname, '/auth.html'));
})
 
app.listen(5000,() => {
    console.log("App is listening on Port 5000")
})