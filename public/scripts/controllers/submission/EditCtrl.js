angular.module('rosaApp')

.controller('SubmissionEditCtrl', function($scope, $location) {
	if (!$scope.currentUser) {
		$location.path('/login');
	}

	$scope.submission = {
		state: 0,
		uploads: [],
		title: '',
		description: ''
	};

	$scope.selectText = 'Select Images'

	$scope.submit = function(form) {
		if (!form.errors) {
			form.errors = {};
		}
		form.errors.title = form.title ? null : 'required';
		if (!form.title) {
			return;	
		}
		// TODO: flatten upload array
		console.log('sup');
	};

	$scope.pushUploads = function(uploads) {
		if (uploads && uploads.length) {
			for (var i = 0; i < uploads.length; i++) {
				$scope.submission.uploads.push({
					upload: uploads[i]
				});
			}
			$scope.selectText = 'Add Images';
			$scope.$digest();
		}
	}

	$scope.clearUpload = function(upload) {
		var idx = $scope.submission.uploads.indexOf(upload);
		if (idx >= 0) {
			$scope.submission.uploads.splice(idx, 1);
			if($scope.submission.uploads.length === 0) {
				$scope.selectText = 'Select Images';
			}
		}
	}
});
