// server.js

// modules ===========================================
var express			= require('express'),
	app				= express(),
	http			= require('http').Server(app),
	cookieParser	= require('cookie-parser'),
	session			= require('express-session'),
	MongoStore		= require('connect-mongo')(session);
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
app.use(cookieParser());
// enable session support
var sessionMiddleware = session({
	resave: true,
	saveUninitialized: false,
	secret: config.session.secret,
	store: new MongoStore({
		url: config.db.url,
		collection: 'sessions'
	})
});
app.use(sessionMiddleware);

// configure passport middleware
require('./server/config/pass');
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

// routes ============================================
require('./server/routes')(app); // configure our routes

// start app ==========================================
// startup our app at http://localhost:8080
http.listen(port);

// initialize sockets =================================
require('./server/sockets.js')
	(require('socket.io')(http), sessionMiddleware);

// shoutout to the user
console.log('Listening on port ' + port);

// expose app
exports = module.exports = http;
