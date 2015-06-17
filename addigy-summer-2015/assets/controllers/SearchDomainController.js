/**
 * Created by ayme on 6/15/15.
 */
(function () {
    angular.module('app').controller('SearchDomainController', ['DataRequest', '$timeout','$scope', function(DataRequest, $timeout, $scope) {
        var self = this;
        self.allDomains=[];
        self.allUsers=[];
        self.domainsFiltered=[];
        self.topSelectData=[1,2,3,4,5,6,7,8,9,10];
        self.selectedDomain="All";
        self.selectedTopNum=1;
        self.selectedUser="All";
        self.daysLabels={};
        self.visitsPerDayPerDomain={};
        self.labels=[];
        self.series=[];
        self.graphData=[];
        self.startDate=0;
        self.endDate=0;
        function getAllDomains(){
            DataRequest.getAllDomains().
                success(function(data, status, headers, config) {
                    var domainsData=data['allDomains'];
                    self.allDomains=domainsData[0].domain;
                    self.allUsers=domainsData[0].username;
                }).error(function(data, status, headers, config) {
                     console.log(data);
                });
        };
        getAllDomains();

        function updateGraph(){
            var topQty=(self.selectedDomain==='All')?self.selectedTopNum:0;
            DataRequest.getDomainInfo(self.selectedDomain, self.selectedUser,
                topQty, self.startDate, self.endDate)
                .success(function(data, status, headers, config) {
                    self.domainsFiltered=data['domainList'];
                    processDomainsData();
            }).error(function(data, status, headers, config) {
                 console.log(data);
            });
        };
        $(document).ready(
            function () {
                $("#topSelect").select2().on("select2:select", function (e) {
                    self.selectedTopNum = ($('#topSelect :selected').text());
                    updateGraph();
                });
                $("#domainSelect").select2().on("select2:select", function (e) {
                    self.selectedDomain = $('#domainSelect :selected').text();
                    updateTopSelector();
                    updateGraph();
                });
                $("#userSelect").select2().on("select2:select", function (e) {
                    self.selectedUser = $('#userSelect :selected').text();
                    updateGraph();
                });
            }
        );
        function updateTopSelector(){
            if (self.selectedDomain==='All') $('#topSelect').prop('disabled', false);
            else $('#topSelect').prop('disabled', 'disabled');
        };
        self.lastMonthSelected=function(){
            var today=new Date();
            var oneMonthAgo=new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            dateRangeChanged(today, oneMonthAgo);
        };
        self.lastWeekSelected=function(){
            var today=new Date();
            var oneWeekAgo=new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
            dateRangeChanged(today, oneWeekAgo);
        };
        function dateRangeChanged(today, pastDate){
            today.setHours(23,59,0,0);
            pastDate.setHours(0,0,0,0);
            self.startDate=pastDate.getTime();
            self.endDate=today.getTime();
            populateGraphLabels();
            updateGraph();
        }
        Date.prototype.addDays = function(days) {
            var dat = new Date(this.valueOf())
            dat.setDate(dat.getDate() + days);
            return dat;
        }
        function populateGraphLabels(){
            var i=0;
            var start = new Date(self.startDate);
            var end = new Date(self.endDate);
            self.daysLabels={};
            while(start <= end){
                self.daysLabels[i]= start.toDateString();
                start = start.addDays(1);
                i++;
            }
        }
        function processDomainsData(){
            self.visitsPerDayPerDomain={};
            var i,j;
            for(i=0;i<self.domainsFiltered.length;i++){
                var visitsPerDomain={};
                var currDomain=self.domainsFiltered[i];
                var domainName=currDomain['domain'];
                var visits=currDomain['visits'];
                for(j=0;j<visits.length;j++){
                    var visitDate=new Date(visits[j]);
                    var visitDateStr=visitDate.toDateString();
                    visitsPerDomain[visitDateStr] ? visitsPerDomain[visitDateStr].value += 1 :
                        visitsPerDomain[visitDateStr] = {value: 1};
                }
                self.visitsPerDayPerDomain[domainName]=visitsPerDomain;
            }
            populateGraphData();
        }
        function populateGraphData(){
            self.series.splice(0,self.series.length);
            self.labels.splice(0,self.labels.length);
            self.graphData.splice(0,self.graphData.length);
            var domains=Object.keys(self.visitsPerDayPerDomain);
            var i,j;
            for(var key in self.daysLabels) self.labels.push(self.daysLabels[key]);
            for(i=0;i<domains.length;i++){
                var domainName=domains[i];
                self.series.push(domainName);
                var domainGraphData=[];
                var domainData=self.visitsPerDayPerDomain[domainName];
                console.log(domainData)
                for(j=0;j<self.labels.length;j++){
                    var visitCount=domainData[self.labels[j]];
                    if(visitCount==null) domainGraphData.push(0);
                    else domainGraphData.push(visitCount.value);
                }
                self.graphData.push(domainGraphData);
            }
        }

    }]);
})();
