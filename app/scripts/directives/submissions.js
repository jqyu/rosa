angular.module('rosaApp')

.directive('submissions',
['$rootScope', '$resource',
function ($rootScope, $resource) {
	return {
		scope: {
			query: '=',
			rootPath: '@',
			page: '='
		},
		templateUrl: 'views/submissions/index.html',
		link: function(scope, element, attrs) {

			scope.config = $rootScope.config;
			scope.imageParams = $rootScope.imageParams;

			scope.isLoading = true;
			scope.page = parseInt(scope.page, 10) || 1;
			scope.limit = parseInt(attrs.limit, 10) || 12;
			scope.offset = (scope.page-1) * scope.limit;

			var Submissions = $resource('/api/submissions'),
				finished = function() { scope.isLoading = false; }
				query = scope.query || {};

			query.offset = scope.offset;
			query.limit = scope.limit;

			scope.submissions = Submissions.query(query, finished, finished);
		}
	};

}]);
