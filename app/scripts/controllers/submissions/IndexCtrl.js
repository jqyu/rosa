angular.module('rosaApp')

.controller('SubmissionIndexCtrl', 
['$scope', '$resource', '$routeParams',
function($scope, $resource, $routeParams) {

	var Submissions = $resource('/api/submissions');

	$scope.page = parseInt($routeParams.page, 10) || 1;
	$scope.limit = 12;
	$scope.offset = ($scope.page-1) * $scope.limit;
	$scope.submissions = Submissions.query({ offset: $scope.offset, limit: $scope.limit });

}]);
