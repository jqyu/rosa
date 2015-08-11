angular.module('rosaApp')

.controller('UsersEditCtrl',

['$scope', '$routeParams', '$resource', '$location',
function ($scope, $routeParams, $resource, $location) {

	var User = $resource('/api/users/:username', null, {
		update: { method: 'PUT' }	
	});

	$scope.isLoading = true;
	$scope.isSaving = false;

	$scope.user = User.get({ username: $routeParams.username },
			function () {
				$scope.isLoading = false;
			}, function() {
				$location.path('/');
			});

	$scope.save = function() {
		$scope.isSaving = true;
		User.update({
			username: $scope.user.username
		}, {
			biography: $scope.user.biography
		}, function() {
			$location.path('/users/'+$scope.user.username);
		}, function() {
			$location.path('/users/'+$scope.user.username);
		});
	};
}]);
