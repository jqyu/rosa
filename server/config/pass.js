var mongoose		= require('mongoose'),
	passport		= require('passport'),
	LocalStrategy	= require('passport-local').Strategy,
	User			= require('../models/user');

//  serialize/deserialize session
//	TODO: figure out a more secure way of doing this, secretToken?

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findOne({ _id: id }, function (err, user) {
		done(err, user);
	});
});

// use strategy
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					'errors': {
						'username': 'Email is not registered'
					}
				});
			}
			if (!user.authenticate(password)) {
				return done(null, false, {
					'errors': {
						'password': 'Password is incorrect'
					}
				});
			}
			return done(null, user);
		});
	}
));
