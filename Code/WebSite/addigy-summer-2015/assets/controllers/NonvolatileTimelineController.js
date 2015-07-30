/**
 * Created by matthewsaunders on 7/1/15.
 */
(function () {
    angular.module('app').controller('NonvolatileTimelineController', ['DataRequest', 'NonvolatileTimelineService', 'TenantsService', function(DataRequest, NonvolatileTimelineService, TenantsService) {
        var self = this;

        self.startDate = NonvolatileTimelineService.startDate;
        self.endDate = NonvolatileTimelineService.endDate;
        self.data = NonvolatileTimelineService.data;
        self.deltas = NonvolatileTimelineService.deltas;
        self.changeStartDate = NonvolatileTimelineService.changeStartDate;
        self.initializeDates = NonvolatileTimelineService.initializeDates;
    }]);
})();