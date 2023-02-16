var config = {};
config.mongodb='mongodb://127.0.0.1:27017/WaveFinder';
//config.mongodb='mongodb://localhost/WaveFinder';

//Session configuration object
config.session = {};

//Cookie configuration object
config.cookie = {};

//Create a renadom string to sign the session data
//Bigger is better, more entropy is better
//The is OK for dev, change for production
config.session.secret = '7j&1tH!cr4F*1U';

//Define the domain for which this cookie is to be set
config.cookie.domain = 'localhost:5000';

module.exports = config;