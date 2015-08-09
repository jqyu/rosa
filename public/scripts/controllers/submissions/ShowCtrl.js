angular.module('rosaApp')

.controller('SubmissionShowCtrl', function($scope, $resource, $routeParams, $location) {

	var Submission = $resource('/api/submissions/:id');
	
	var loaded = function(submission) {
			if (!submission._id) {
				redirect404();
			}
		},
		redirect404 = function(err) {
			$location.path('/');
		}

	$scope.submission = Submission.get({ id: $routeParams.id }, loaded, redirect404);
});
