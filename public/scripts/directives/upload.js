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

			scope.percentage = null;
			scope.progressRightStyle = {
				transform: 'rotate(180deg)'	
			};
			scope.progressLeftStyle = {
				transform: 'rotate(180deg)'	
			};

			scope.$watch('model.percent', function(percent) {
				scope.percentage = Math.round(percent * 100) + '%';
				var amtRight = 2 * Math.min(0.5, percent) + 1;
				var amtLeft = 2 * Math.max(0.5, percent);
				scope.progressRightStyle.transform = 'rotate(' + (180 * amtRight) + 'deg)';
				scope.progressLeftStyle.transform = 'rotate(' + (180 * amtLeft) + 'deg)';
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
