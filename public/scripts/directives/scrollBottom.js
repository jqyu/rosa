angular.module('rosaApp')

.directive('scrollBottom', function($timeout) {
	return {
		scope: {
			scrollBottom: '='
		},
		link: function(scope, element) {
			var manualScrolled = false,
				scrollToBottom = function() {
					if ( !manualScrolled ) {
						$timeout(function() {
							// POSSIBLE TODO: animate scroll
							element[0].scrollTop = element[0].scrollHeight;
						});
					}
				};
				
			element.bind('scroll', function() {
				var dist = element[0].scrollHeight
							- element[0].scrollTop
							- element[0].offsetHeight;
				if (dist > 10) {
					manualScrolled = true;
					element.addClass('scrolled');
				} else {
					manualScrolled = false;
					element.removeClass('scrolled');
				}
			});

			scope.$watchCollection('scrollBottom', scrollToBottom);
			scrollToBottom();
		}
	};
});
