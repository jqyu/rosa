// server.js

// modules ===========================================
var express			= require('express'),
	app				= express(),
	passport		= require('passport'),
	mongoose		= require('mongoose'),
	bodyParser		= require('body-parser'),
	methodOverride	= require('method-override');

// configs ==========================================

// config files
var config = require('./config/environment');

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
mongoose.connect(config.db.url);

// use bodyparser to get nice inputs 
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true }));
// use method override for http header workarounds
app.use(methodOverride('X-HTTP-Method-Override'));
// enable cookie support

// enable session support

// configure passport middleware
require('./server/config/pass');
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

// routes ============================================
require('./server/routes')(app); // configure our routes

// start app ==========================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log('Listening on port ' + port);

// expose app
exports = module.exports = app;
