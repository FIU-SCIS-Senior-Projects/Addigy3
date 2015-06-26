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
        self.lineChartColors = [
            {"fillColor": "rgba(60,141,188,0.5) ","strokeColor": "rgba(60,141,188,0.8) ","highlightFill": "rgba(60,141,188,0.75) ", "highlightStroke":"rgba(60,141,188,1) "}
        ];
        self.getActivity=function(){
            DomainInfoService.getTopDomains(self.datePickedDate.date);
        };
    }]);
})();
