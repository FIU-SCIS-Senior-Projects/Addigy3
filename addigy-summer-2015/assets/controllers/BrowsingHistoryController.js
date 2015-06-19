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
            {"fillColor": "rgba(60,141,188,0.5) ","strokeColor": "rgba(60,141,188,0.8) ","highlightFill": "rgba(60,141,188,0.75) ", "highlightStroke":"rgba(60,141,188,1) "},
            {"fillColor": "rgba(141,188,60,0.5) ","strokeColor": "rgba(141,188,60,0.8) ","highlightFill": "rgba(141,188,60,0.75) ", "highlightStroke":"rgba(141,188,60,1) "},
            {"fillColor": "rgba(60,188,187,0.5) ","strokeColor": "rgba(60,188,187,0.8) ","highlightFill": "rgba(60,188,187,0.75) ", "highlightStroke":"rgba(60,188,187,1) "},
            {"fillColor": "rgba(188,60,141,0.5) ","strokeColor": "rgba(188,60,141,0.8) ","highlightFill": "rgba(188,60,141,0.75) ", "highlightStroke":"rgba(188,60,141,1) "},
            {"fillColor": "rgba(188,107,60,0.5) ","strokeColor": "rgba(188,107,60,0.8) ","highlightFill": "rgba(188,107,60,0.75) ", "highlightStroke":"rgba(188,107,60,1) "},
            {"fillColor": "rgba(188,60,77,0.5) ","strokeColor": "rgba(188,60,77,0.8) ","highlightFill": "rgba(188,60,77,0.75) ", "highlightStroke":"rgba(188,60,77,1) "},
            {"fillColor": "rgba(60,188,171,0.5) ","strokeColor": "rgba(60,188,171,0.8) ","highlightFill": "rgba(60,188,171,0.75) ", "highlightStroke":"rgba(60,188,171,1) "}
        ];
        self.getActivity=function(){
            DomainInfoService.getTopDomains(self.datePickedDate.date);
        };
    }]);
})();
