/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app', ['ngRoute', 'chart.js', 'ui.bootstrap']).config(function($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'assets/pages/dashboard1.html',
        }).when('/dashboard1',{
            templateUrl: 'assets/pages/dashboard1.html',
        }).when('/dashboard2',{
            templateUrl: 'assets/pages/dashboard2.html',
        }).otherwise({
            redirectTo: '/'
        });
    });
})();