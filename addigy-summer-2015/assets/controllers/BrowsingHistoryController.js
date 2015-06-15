/**
 * Created by ayme on 6/14/15.
 */
(function () {
    angular.module('app').controller('BrowsingHistoryController', ['DataRequest', 'DomainsInfoService', function(DataRequest, DomainInfoService) {
        var self = this;
        self.domains=DomainInfoService.domains;
        self.labels=DomainInfoService.labels;
        self.data=DomainInfoService.graphData;
        self.getActivity=function(){
            DomainInfoService.getTopDomains(self.datePickedDate.date);
        };
        //self.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
        //self.series = ['Series A'];
        //
        //self.data = [
        //    [65, 59, 80, 81, 56, 55, 40]
        //];
    }]);
})();
