// modules
var path = require('path'),
	auth = require('./config/auth');

module.exports = function(app, config) {

	// server routes ================================

	var users = require('./controllers/users'),
		session = require('./controllers/session');

	// authentication routes
	
	// sign up
	app.post('/auth/users', users.create);
	// check if user exists
	app.get('/auth/users/:username/exists', users.exists);


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
		.get(users.show)
		.put(auth.ensureAuthenticated, users.update);

	// submissions
	var submissions = require('./controllers/submissions'),
		Submission = require('./models/submission'),
		submissionsAuthenticator = auth.modelAuthenticator(Submission, 'submission', 2);

	app.route('/api/submissions')
		.get(submissions.index)
		.post(auth.ensureAuthenticated, submissions.process, submissions.create);
	app.route('/api/submissions/:id')
		.get(submissions.show)
		.put(auth.ensureAuthenticated, submissionsAuthenticator, submissions.process, submissions.update)
		.delete(auth.ensureAuthenticated, submissionsAuthenticator, submissions.delete);
	app.route('/api/submissions/:id/hearts')
		.post(auth.ensureAuthenticated, submissions.heart)
		.delete(auth.ensureAuthenticated, submissions.unheart);
	app.route('/api/submissions/:id/feature')
		.post(auth.ensureMod, submissions.feature)
		.delete(auth.ensureMod, submissions.unfeature);

	// comments
	var comments = require('./controllers/comments'),
		Comment = require('./models/comment'),
		commentsAuthenticator = auth.modelAuthenticator(Comment, 'comment', 2);

	app.route('/api/submissions/:id/comments')
		.post(auth.ensureAuthenticated, comments.create);

	// temporary until more fully-featured feed is introduced
	app.route('/api/comments')
		.get(auth.ensureAuthenticated, comments.index);

	app.route('/api/comments/:id')
		.put(auth.ensureAuthenticated, commentsAuthenticator, comments.update)
		.delete(auth.ensureAuthenticated, commentsAuthenticator, comments.delete);


	// uploads
	var uploads = require('./controllers/uploads'),
		Upload = require('./models/upload'),
		uploadsAuthenticator = auth.modelAuthenticator(Upload, 'upload', 2);

	app.route('/api/uploads')
		.post(auth.ensureAuthenticated, uploads.upload, uploads.create);
	app.route('/api/uploads/:id')
		.delete(auth.ensureAuthenticated, uploadsAuthenticator, uploads.delete);

	
	// frontend routes ==============================

	// set up view engine for static version
	var statics = require('./controllers/statics');
	app.set('views', './server/views');
	app.set('view engine', 'jade');

	// route to handle all angular requests
	app.get('*', function(req, res) {

		// initialize angular cookie store
		if(req.user) {
			res.cookie('user', JSON.stringify(req.user.info));
		}
	
		// determine whether or not to serve static page	
		var fragment = req.query._escaped_fragment_,
			userAgent = req.headers['user-agent'];
		if (fragment === '') {
			fragment = req.url.split('?')[0];
		}

		if (!fragment) {
			// load our public/index.html file
			return res.sendFile('views/index.html', { root: path.join(__dirname, '../dist') });
		}

		// serve static version of page =====
		return statics(req, res, fragment, config);
	});

};
