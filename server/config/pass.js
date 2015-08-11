var	passport		= require('passport'),
	LocalStrategy	= require('passport-local').Strategy,
	User			= require('../models/user');

//  serialize/deserialize session

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findOne({ _id: id }, function (err, user) {
		if(err) {
			// TODO: reset session
		}
		done(err, user);
	});
});

// use strategy
passport.use(new LocalStrategy(
	function(username, password, done) {

		// all usernames should be lowercase
		username = username && username.toLowerCase();

		User.findOne({ username: username }, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					'errors': {
						'username': 'not registered' 
					}
				});
			}
			if (!user.authenticate(password)) {
				return done(null, false, {
					'errors': {
						'password': 'incorrect'
					}
				});
			}
			return done(null, user);
		});
	}
));
