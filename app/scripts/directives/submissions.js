angular.module('rosaApp')

.directive('submissions',
['$resource',
function ($resource) {
	return {
		scope: {
			query: '=',
			rootPath: '&',
			page: '='
		},
		templateUrl: 'views/submissions/index.html',
		link: function(scope, element, attrs) {

			scope.isLoading = true;
			scope.page = parseInt(scope.page, 10) || 1;
			scope.limit = attrs.limit || 12;
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