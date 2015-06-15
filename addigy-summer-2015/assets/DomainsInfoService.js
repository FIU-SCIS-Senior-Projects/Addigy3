/**
 * Created by ayme on 6/14/15.
 */
(function () {
    angular.module('app').service('DomainsInfoService',['DataRequest', function(DataRequest) {
        console.log('in domain service');
        var self = this;
        self.domains=null;
        self.labels = [];
        self.series = ['Top Domains'];
        self.graphData = [];

        self.getTopDomains=function(){
            DataRequest.getMostVisistedDomains().
                success(function(data, status, headers, config) {
                    self.domains=data['mostVisited'];
                    processDomainsData();
                }).error(function(data, status, headers, config) {
                     console.log(data);
                });
        };
        self.getTopDomains();
        function processDomainsData(){
            var i;
            //self.labels.splice(0,self.labels.length);
            //self.graphData.splice(0,self.data.length);
            var domainsData=[];
            for(i=0; i< self.domains.length; i++){
                var currDomain = self.domains[i];
                self.labels.push(currDomain['domain']);
                domainsData.push(currDomain['size']);
            }
            self.graphData.push(domainsData);
            console.log(self.labels);
            console.log(self.graphData);
        };
    }]);
})();