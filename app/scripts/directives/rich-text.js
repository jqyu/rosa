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
						// sanitize
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')

						// escape
						.replace(/\\\\/g, '&#92;')
						.replace(/\\\*/g, '&#42;')
						.replace(/\\~/g, '&#126;')
						.replace(/\\\[/g, '&#91;')
						.replace(/\\\]/g, '&#93;')
						.replace(/\\\(/g, '&#40;')
						.replace(/\\\)/g, '&#41;')

						// arbitrary markdown
						.replace(/\*(.+?)\*/g, '<em>$1</em>')
						.replace(/~~(.+?)~~/g, '<del>$1</del>')
						// probably should add a nofollow here...
						.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
						.replace(/((http:\/\/|https:\/\/)\S+)/g, '<a href="$1">$1</a>')

						.split('\n').join('<br>');
			}
		}
	};
});
