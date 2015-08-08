angular.module('rosaApp')

.directive('upload', function(Uploader) {
	return {
		restrict: 'C',
		scope: {
			model: '=ngModel',
			clearAction: '&',
		},
		templateUrl: 'views/components/upload.html',
		link: function(scope, element, attrs) {
			scope.tempUrl = null;
			
			// monolithic upload handler
			scope.$watch('model.upload', function(upload) {
				if (upload && upload._id) {
					// image uploaded, remove temp url
					scope.tempUrl = null;
				} else if (upload && upload.toString() === '[object File]' && !upload.queued) {
					// queue self for uploading
					scope.tempUrl = URL.createObjectURL(upload);
					Uploader.push(scope.model);
				} else if (upload === null) {
					// delete self 
					if (scope.clearAction) {
						scope.clearAction({
							upload: scope.model
						});
					}
				}
			});

			scope.swap = function(upload) {
				if (upload) {
					scope.model.upload = upload;
					scope.$digest();
				}
			};

			scope.clear = function() {
				scope.model.upload = null;
			};
		}
	}
});
