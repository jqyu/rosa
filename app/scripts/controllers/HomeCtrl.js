angular.module('rosaApp')

.controller('HomeCtrl',
['$scope', '$routeParams',
function ($scope, $routeParams) {

	$scope.page = $routeParams.page;

}]);
