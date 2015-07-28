/**
 * Created by matthewsaunders on 7/1/15.
 */
'use strict';

(function () {
    google.load('visualization', '1', {packages: ['corechart', 'line']});
    google.setOnLoadCallback(function () {
        angular.bootstrap(document.body, ['app']);
    });
    angular.module('app').controller('VolatileDataController', ['DataRequest', 'VolatileDataService', function(DataRequest, VolatileDataService) {
        var self = this;
        self.startDate = VolatileDataService.startDate;
        self.endDate = VolatileDataService.endDate;
        self.cpuMemData = VolatileDataService.cpuMemData;
        self.labels = VolatileDataService.labels;
        self.series = VolatileDataService.series;
        self.getVolatileFacts = VolatileDataService.getVolatileFacts;
        self.changeStartDate = VolatileDataService.changeStartDate;
        self.initializeDates = VolatileDataService.initializeDates;







    }]);
})();