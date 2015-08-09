angular.module('rosaApp')

.controller('SubmissionEditCtrl', function($scope, $location, $resource, $routeParams) {
	if (!$scope.currentUser) {
		$location.path('/login');
	}

	var Submissions = $resource('/api/submissions'),
		Submission = $resource('/api/submissions/:id', null, {
			'update': { method: 'PUT' }
		});

	$scope.submission = {
		state: 0,
		uploads: [],
		title: '',
		description: ''
	};

	$scope.isLoading = false;

	if ($routeParams.id) {
		$scope.submission._id = $routeParams.id;
		$scope.isLoading = true;
		Submission.get({ id: $routeParams.id }, function(submission) {
			$scope.submission.state = submission.state;
			$scope.submission.title = submission.title;	
			$scope.submission.description = submission.description;
			for (var i in submission.uploads) {
				$scope.submission.uploads.push({
					upload: submission.uploads[i]
				});
			}

			$scope.isLoading = false;
		})
	}

	$scope.submit = function(form) {
		$scope.submission.state = 1;
		if ($scope.save(form)) {
			$scope.submission.state = 0;
		}
	};

	$scope.save = function(form) {
		form.errors = {};
		// validate title
		form.errors.title = $scope.submission.title ? null : 'required';
		// validate uploads
		var uploads = [];
		if ($scope.submission.uploads.length < 1) {
			form.errors.uploads = 'At least one image required';
		} else {
			for (var i in $scope.submission.uploads)  {
				var upload = $scope.submission.uploads[i].upload;
				if (!upload._id) {
					form.errors.uploads = 'Images are still uploading';
				}
				uploads.push(upload._id);
			}
		}
		// break on error
		for (var i in form.errors) {
			if (form.errors[i]) {
				return true;
			}
		}
		$scope.isLoading = true;
		var submission = {
				state: $scope.submission.state,
				uploads: uploads,
				title: $scope.submission.title,
				description: $scope.submission.description
			},
			// NOTE: we're optimistic and assume that the
			// server doesn't alter the contents
			saved = function(res) {
				$location.path('/submissions/'+res._id+'/edit');
			},
			updated = function(res) {
				$scope.isLoading = false;
			},
			error = function(err) {
				$scope.isLoading = false;
			};

		if ($scope.submission._id) {
			Submission.update({ id: $scope.submission._id}, submission, updated, error);
		} else {
			Submissions.save(submission, saved, error);
		}
		return;
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
