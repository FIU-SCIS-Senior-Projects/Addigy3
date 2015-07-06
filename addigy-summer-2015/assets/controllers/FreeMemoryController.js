/**
 * Created by matthewsaunders on 6/19/15.
 */
(function () {
    angular.module('app').controller('FreeMemoryController', ['DataRequest', 'FreeMemoryService', 'TenantsService', function(DataRequest, FreeMemoryService, TenantsService) {
        var self = this;
        self.data = FreeMemoryService.data;
        self.labels = FreeMemoryService.times;
        self.series = FreeMemoryService.series;
        self.datePickedDate=FreeMemoryService.datePickedDate;
        self.calendarMaxDate=new Date();
        self.orgId = TenantsService.orgId;
        self.selectedTenant = TenantsService.selectedTenant;

        self.formats = ['MMMM-dd-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        self.format = self.formats[0];

        self.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        self.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            self.opened = true;
        };

        self.getMemoryData = function(){
            FreeMemoryService.getMemoryData(self.orgId, self.selectedTenant);
        };

        self.onClick = function (points, evt) {
            console.log(points, evt);
          };

        self.registerCallback = function(){
            TenantsService.registerCallback(self.getMemoryData);
        }
        self.registerCallback();
    }]);
})();