// modules
var path = require('path'),
	auth = require('./config/auth');


module.exports = function(app) {

	var users = require('./controllers/users'),
		uploads = require('./controllers/uploads');

	// server routes ================================

	// authentication routes
	
	// sign up
	app.post('/auth/users', users.create);
	// check if user exists
	app.get('/auth/users/:username/exists', users.exists);

	var session = require('./controllers/session');

	// session endpoints 
	app.route('/auth/session')
		// get current session
		.get(auth.ensureAuthenticated, session.session)
		// log in (create new session)
		.post(session.login)
		// log out (delete current session)
		.delete(session.logout);

	// api calls
	
	// get user by username 
	app.route('/api/users/:username')
		.get(users.show);

	// create upload
	app.route('/api/uploads')
		.post(auth.ensureAuthenticated, uploads.upload, uploads.create);
	// delete upload
	app.route('/api/uploads/:id')
		.delete(uploads.delete);

	
	// frontend routes ==============================
	// route to handle all angular requests
	app.get('*', function(req, res) {

		// initialize angular cookie store
		if(req.user) {
			res.cookie('user', JSON.stringify(req.user.info));
		}

		// load our public/index.html file
		res.sendFile('views/index.html', { root: path.join(__dirname, '../public') });
	});

};
