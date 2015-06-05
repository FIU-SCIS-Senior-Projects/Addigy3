/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app', ['ngRoute', 'chart.js', 'ui.bootstrap']).config(function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'assets/pages/allGraphs.html'
        }).when('/allGraphs',{
            templateUrl: 'assets/pages/allGraphs.html'
        }).otherwise({
            redirectTo: '/'
        });
    });
})();