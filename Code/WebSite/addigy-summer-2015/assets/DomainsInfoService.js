/**
 * Created by ayme on 6/14/15.
 */
(function () {
    angular.module('app').service('DomainsInfoService',['DataRequest', function(DataRequest) {
        var self = this;
        self.domains=null;
        self.labels = [];
        self.series = ['Top Domains'];
        self.graphData = [];

        self.getTopDomains=function(){
            DataRequest.getMostVisistedDomains().
                success(function(data, status, headers, config) {
                    self.domains=data['mostVisited'];
                    if (self.domains.length===0)
                        populateEmptyGraph();
                    else
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
        };
        function populateEmptyGraph(){
            var domainsData=[];
            self.series.splice(0,self.series.length);
            self.series.push("no domains found")
            var i;
            for(i=0; i< 5; i++){
                self.labels.push("");
                domainsData.push(0);
            }
            self.graphData.push(domainsData);
        }
    }]);
})();