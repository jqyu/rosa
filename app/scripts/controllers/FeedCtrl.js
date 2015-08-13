angular.module('rosaApp')

.controller('FeedCtrl',
['$scope', '$routeParams', '$resource', '$location',
function ($scope, $routeParams, $resource, $location) {

	if (!$scope.currentUser ) {
		$location.path('/login');
	}

	$scope.isLoading = true;

	$scope.limit = 12;
	$scope.page = parseInt($routeParams.page || 1, 10);
	$scope.offset = ($scope.page-1) * $scope.limit;

	$scope.feed = $resource('/api/comments').query({
			limit: $scope.limit,
			offset: $scope.offset
		}, function() {
			$scope.isLoading = false;
		}, function() {
			$scope.isLoading = false;
		});

}]);
