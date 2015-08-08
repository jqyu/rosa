var fs		= require('fs'),
	mongose = require('mongoose'),
	multer  = require('multer'),
	path	= require('path'),
	Upload  = require('../models/upload');

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
		rootPath = path.join(__dirname, '../../'),
		filePath = path.join(rootPath, file.path),
		dest = req.user.username+'/'+file.filename,
		destDir = path.join(rootPath, 'public/uploads/', req.user.username)
		destPath = path.join(rootPath, 'public/uploads', dest);

	var cleanup = function(f) {
		fs.unlink(f);
		return next(new Error('Failed to upload file'));	
	};

	if (filetype !== 'image') {
		console.log('tried to upload file of type:', filetype, file);
		return cleanup(filePath);
	}

	fs.mkdir(destDir, function() {
		fs.rename(filePath, destPath, function(err) {
			if (err) {
				console.log('error:', err);
				return cleanup(filePath);
			}
			var newUpload = new Upload({
				mimetype: mimetype,
				path: dest,
				size: file.size,
				userId: req.user.id
			});
			newUpload.save(function(err, upload) {
				if (err) {
					console.log('error saving upload', upload);
					return cleanup(destPath);
				}
				res.json(upload);
			});
		});
	});
};
