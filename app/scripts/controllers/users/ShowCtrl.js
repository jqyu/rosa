angular.module('rosaApp')

.controller('UsersShowCtrl',
['$scope', '$routeParams', '$resource', '$location',
function ($scope, $routeParams, $resource, $location) {

	var User = $resource('/api/users/:username', null, {
		update: { method: 'PUT' }	
	});

	$scope.isLoading = true;
	$scope.isLoaded = false;

	$scope.user = User.get({ username: $routeParams.username },
			function (user) {
				$scope.isLoading = false;
				$scope.isLoaded = true;
				$scope.query = {
					userId: user._id
				};
				$scope.page = $routeParams.page;
			}, function (err) {
				$location.path('/');
			});

}]);
