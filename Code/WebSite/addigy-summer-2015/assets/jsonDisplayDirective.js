/**
 * Created by matthewsaunders on 6/16/15.
 */
angular.module('app').directive('collection', function () {
	return {
		restrict: "E",
		replace: true,
		scope: {
			collection: '='
		},
		template: "<ul><member ng-repeat='(key, value) in collection' member='(key, value)'></member></ul>"
	}
})

angular.module('app').directive('member', function ($compile) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			member: '='
		},
		template: "<li><ng-repeat='(key, value) in member'>{{ key }}</li>",
		link: function (scope, element, attrs) {
			if (angular.isArray(scope.member.children)) {
				element.append("<collection collection='member.children'></collection>");
				$compile(element.contents())(scope)
			}
		}
	}
})