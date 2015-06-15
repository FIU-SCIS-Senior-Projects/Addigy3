/**
 * Created by ayme on 6/14/15.
 */
(function () {
    angular.module('app').controller('BrowsingHistoryController', ['DataRequest', 'DomainsInfoService', function(DataRequest, DomainInfoService) {
        var self = this;
        self.domains=DomainInfoService.domains;
        self.labels=DomainInfoService.labels;
        self.data=DomainInfoService.graphData;
        self.series=DomainInfoService.series;
        self.getActivity=function(){
            DomainInfoService.getTopDomains(self.datePickedDate.date);
        };
    }]);
})();
