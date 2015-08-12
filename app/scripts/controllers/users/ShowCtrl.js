angular.module('rosaApp')

.controller('UsersShowCtrl',
['$scope', '$routeParams', '$resource', '$location',
function ($scope, $routeParams, $resource, $location) {

	var User = $resource('/api/users/:username', null, {
		update: { method: 'PUT' }	
	});

	$scope.isLoading = true;
	$scope.isLoaded = false;
	$scope.username = $routeParams.username;
	$scope.page = $routeParams.page;

	$scope.user = User.get({ username: $routeParams.username },
			function (user) {
				$scope.isLoading = false;
				$scope.isLoaded = true;
				$scope.query = {
					userId: user._id
				};
			}, function (err) {
				$location.path('/');
			});

}]);
