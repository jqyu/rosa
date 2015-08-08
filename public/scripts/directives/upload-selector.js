angular.module('rosaApp')

.directive('uploadSelector', function() {
	return {
		scope: {
			multiple: '@',
			selectText: '@',
			selectAction: '&'
		},

		templateUrl: 'views/components/upload-selector.html',

		link: function(scope, element, attrs) {
			var multiple = attrs.multiple || attrs.multiple === '';
			if (multiple) {
				element.find('input').attr('multiple', true);
			}
			scope.browse = function() {
				element.find('input')[0].click();
			};
			scope.select = function(obj) {
				var files = [];
				// casts to array 
				for (var i = 0; i < obj.files.length; i++) {
					files.push(obj.files[i]);
				}
				scope.selectAction({
					files: multiple ?
							files :
							files[0]
				});
			};
		}
	};
});
