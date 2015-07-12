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
var config = require('./server/config/environment');

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
mongoose.connect(config.db.url);

// configure passport middleware
require('./server/config/pass');

// express configs 
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 

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
