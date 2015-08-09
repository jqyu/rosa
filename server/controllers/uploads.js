var fs		= require('fs'),
	mongose = require('mongoose'),
	multer  = require('multer'),
	path	= require('path'),
	Upload  = require('../models/upload');

var rootPath = path.join(__dirname, '../../'),
	uploadsPath = path.join(rootPath, 'public/uploads');

// TODO: FIX EVERYTHING THIS IS ALL SO FUCKING TERRIBLE

module.exports.upload = multer({
	dest: './tmp/'
}).single('upload');

module.exports.create = function (req, res, next) {
	// TODO: fix all of this shit l0l
	// naming is terrible and everything is bad....
	var	file = req.file,
		mimetype = file.mimetype,
		filetype = mimetype && mimetype.split('/')[0],
		filePath = path.join(rootPath, file.path),
		dest = req.user.username+'/'+file.filename,
		destDir = path.join(uploadsPath, req.user.username)
		destPath = path.join(uploadsPath, dest);

	var cleanup = function(f) {
		fs.unlink(f);
		return next(new Error('Failed to upload file'));	
	};

	if (filetype !== 'image') {
		console.log('tried to upload file of type:', filetype, file);
		return cleanup(filePath);
	}

	fs.mkdir(destDir, function() {
		// we ignore the exists error and continue
		fs.rename(filePath, destPath, function(err) {
			if (err) {
				console.log('error:', err);
				return cleanup(filePath);
			}
			var newUpload = new Upload({
				_user: req.user,
				mimetype: mimetype,
				path: dest,
				size: file.size
			});
			newUpload.save()
				.then(function(upload) {
					res.json(upload);
				}, function(err) {
					console.log('error saving upload', upload);
					return cleanup(destPath);
				});
		});
	});
};

module.exports.delete = function(req, res, next) {
	req.upload.remove()
		.then(function() {
			res.sendStatus(200);
		}, function(err) {
			next(err);
		});
};
