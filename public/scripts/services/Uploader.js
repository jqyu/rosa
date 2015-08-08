angular.module('rosaApp')

.service('Uploader', function($rootScope) {

	this.queue = [];

	this.upload = function() {
		var self = this,
			obj = this.queue[0];

		// clear deleted results
		while (obj && obj.upload === null) {
			this.queue.splice(0, 1);
			obj = this.queue[0];
		}
		
		// terminate callback loop
		if (!obj) { return; }

		// upload first queued object
		obj.isUploading = true;
		obj.progress = 0;
		obj.percent = 0;
		obj.percentage = '0%';

		var form = new FormData();
		var xhr = new XMLHttpRequest();

		form.append('upload', obj.upload);

		xhr.upload.onprogress = function(e) {
			obj.progress = e.loaded;
			obj.percent = e.loaded/e.total;
			$rootScope.$digest();
		};
		xhr.onreadystatechange = function(e) {
			if (this.readyState === 4) {
				obj.upload = JSON.parse(this.responseText);
				obj.isQueued = false;
				obj.isUploading = false;
				self.queue.splice(0, 1);
				self.upload();
				$rootScope.$digest();
			}
		};
		xhr.open('POST', 'api/uploads');
		xhr.send(form);
	};

	this.push = function(obj) {
		obj.isQueued = true;
		this.queue.push(obj);
		if (this.queue.length === 1) {
			this.upload();
		}
	};

});
