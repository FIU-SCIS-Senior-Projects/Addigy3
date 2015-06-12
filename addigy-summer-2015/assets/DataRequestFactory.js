/**
 * Created by ayme on 5/28/15.
 */
(function () {
    angular.module('app').factory('DataRequest', ['$http', function($http) {
        return {
            getHistory: function (login, logout) {
                return $http.post('http://127.0.0.1:8000/resource/getHistory/',{login: login,logout:logout});
            },

            getFacter: function () {
                return $http.post('http://127.0.0.1:8000/resource/getFacter/');
            }
        }
    }]);
})();