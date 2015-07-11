module.exports = function(app) {

	// server routes ================================
	// handles api calls and authentication routes
	


	// frontend routes ==============================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		// load our public/index.html file
		res.sendfile('./public/views/index.html');
	});

};
