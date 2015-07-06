/**
 * Created by matthewsaunders on 7/1/15.
 */
(function () {
    angular.module('app').controller('VolatileDataController', ['DataRequest', 'VolatileDataService', 'TenantsService', function(DataRequest, VolatileDataService, TenantsService) {
        var self = this;

        self.startDate = VolatileDataService.startDate;
        self.endDate = VolatileDataService.endDate;

    }]);
})();