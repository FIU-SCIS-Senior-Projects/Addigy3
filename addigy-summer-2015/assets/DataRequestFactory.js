/**
 * Created by ayme on 5/28/15.
 */
(function () {
    angular.module('app').factory('DataRequest', ['$http', function($http) {
        return {
            getHistory: function (login, logout) {
                return $http.post('/resource/getLoginHistory/',{login: login,logout:logout});
            },
            getFacter: function () {
                return $http.post('/resource/getFacter/');
            },
            getMostVisistedDomains: function () {
                return $http.post('/resource/getMostVisistedDomains/');
            },
            getAllDomains: function () {
                return $http.post('/resource/getAllDomains/');
            },
            getDomainInfo: function (domain, user, qtyToSelect, startDate, endDate, type) {
                return $http.post('/resource/getDomainInfo/', {domain:domain, user:user,
                    qtyToSelect:qtyToSelect, startDate:startDate, endDate:endDate, type:type});
            }
        }
    }]);
})();