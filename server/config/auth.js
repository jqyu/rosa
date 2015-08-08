module.exports.ensureAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.sendStatus(401);
};

module.exports.modelAuthenticator = function (Model, name, role) {
	if (!role) {
		role = 3;
	}
	return function(req, res, next) {
		var id = req.params.id;
		Model.findOne({ _id: req.params.id }, function (err, model) {
			if (err) {
				res.sendStatus(404);
			}
			if (req.user._id === model._user || req.user.role >= role) {
				console.log('saul goodman');
				return next();
			} else {
				res.sendStatus(404);
			}
		});
	}
}
