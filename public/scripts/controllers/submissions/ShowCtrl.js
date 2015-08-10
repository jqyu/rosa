angular.module('rosaApp')

.controller('SubmissionShowCtrl', function($scope, $resource, $routeParams, $location) {

	var Submission = $resource('/api/submissions/:id'),
		Comments = $resource('/api/submissions/:sid/comments');
	
	var loaded = function(submission) {
			if (!submission._id) {
				redirect404();
			}
		},
		redirect404 = function(err) {
			$location.path('/');
		};

	$scope.submission = Submission.get({ id: $routeParams.id, includes: 'comments' }, loaded, redirect404);

	$scope.isCommenting = null;
	$scope.commentText = null;

	$scope.comment = function() {
		if ($scope.commentText && $scope.currentUser) {
			$scope.isCommenting = true;
			Comments.save({
				sid: $scope.submission._id,
			},{
				text: $scope.commentText
			}, function(comment) {
				$scope.submission.comments.push(comment);
				$scope.commentText = null;
				$scope.isCommenting = false;
			}, function(err) {
				$scope.isCommenting = false;
			})
		};
	};

	$scope.delete = function() {
		Submission.delete({ id: $scope.submission._id },
				function() {
					$location.path('/');
				});
	};
});
