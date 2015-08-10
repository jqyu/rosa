angular.module('rosaApp')

.controller('SubmissionShowCtrl', function($scope, $resource, $routeParams, $location) {

	var Submission = $resource('/api/submissions/:id'),
		Comments = $resource('/api/submissions/:sid/comments'),
		Comment = $resource('/api/comments/:id', null, {
			'update': { method: 'PUT' }
		});
	
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

	$scope.editingId = null;
	$scope.isEditing = null;

	$scope.editComment = function(comment) {
		$scope.isEditing = true;
		if (comment.editText) {
			Comment.update(
					{ id: comment._id },
					{ text: comment.editText },
					function() {
						comment.text = comment.editText;
						$scope.editText = null;
						$scope.editCommentFocus(null);
						$scope.isEditing = false;
					}, function(err) {
						$scope.editCommentFocus(null);
						$scope.isEditing = false;	
					});
		}
	};

	$scope.editCommentFocus = function(comment) {
		$scope.editingId = comment && comment._id;
		if ( comment ) {
			comment.editText = comment.text;
		}
	};

	$scope.deleteComment = function(comment) {
		Comment.delete({ id: comment._id },
				function() {
					var idx = $scope.submission.comments.indexOf(comment);
					if (idx > -1) {
						$scope.submission.comments.splice(idx, 1);
					}
				});
	};

	$scope.delete = function() {
		Submission.delete({ id: $scope.submission._id },
				function() {
					$location.path('/');
				});
	};
});
