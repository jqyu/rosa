angular.module('rosaApp')

.directive('richText',
function() {
	return {
		template: '<p ng-repeat="lines in paragraphs" ng-bind-html="parse(lines)"></p>',
		scope: {
			richText: '='
		},
		link: function(scope, element) {
			scope.$watch('richText', function(text) {
				scope.paragraphs = text ? text.split('\n\n') : [];
			});

			scope.parse = function(text) {
				// TODO: better formatting like links and stuff
				return text
						.replace('&', '&amp;')
						.replace('<', '&lt;')
						.replace('>', '&gt;')
						.replace('\n', '<br />');
			}
		}
	};
});
