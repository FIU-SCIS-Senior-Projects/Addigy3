/**
 * Created by ayme on 7/1/15.
 */
(function () {
    angular.module('app').controller('UpdatesDetailsController', ['DataRequest', function(DataRequest) {
        var self = this;
        self.updatesCount={};
        function processAvailableUpdate(data){
            for (var prop in data) {
                self.updatesCount[prop] = data[prop];
            }
        }
        function getAvailableUpdates(){
            DataRequest.getAvailableUpdates().
                success(function(data, status, headers, config) {
                    console.log(data);
                    processAvailableUpdate(data);
                }).error(function(data, status, headers, config) {
                     console.log(data);
                });
        };
        getAvailableUpdates();

        function eliminateDuplicates(arr) {
            var i, len = arr.length,
                out = [],
                obj = {};

            for (i = 0; i < len; i++) {
                obj[arr[i]] = 0;
            }
            for (i in obj) {
                out.push(i);
            }
            return out;
        }
        self.getUniqueId = function(str) {
            var len = str.length;
            var chars = [];
            for (var i = 0; i < len; i++) {
                chars[i] = str[Math.floor((Math.random() * len))];
            }
            var filtered = eliminateDuplicates(chars);
            return filtered.join('');
        }

    }]);
})();
