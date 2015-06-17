/**
 * Created by ayme on 6/15/15.
 */
(function () {
    angular.module('app').controller('SearchDomainController', ['DataRequest', '$timeout','$scope', function(DataRequest, $timeout, $scope) {
        var self = this;
        self.allDomains=[];
        self.allUsers=[];
        self.domainVisitsCount=0;
        self.domainUsers=[];
        self.domainsFiltered=[];
        self.domainSelected=false;
        self.topSelectData=[2,3,4,5,10,20];
        self.selectedDomain="All";
        self.selectedTopNum=1;
        self.selectedUser="All";
        self.daysLabels={'0':'', '1':'', '2':'', '3':'', '4':'', '5':'', '6':'', '7':'', '8':'', '9':'', '10':'',
            '11':'', '12':'', '13':'', '14':'', '15':'', '16':'', '17':'', '18':'', '19':'', '20':'', '21':'', '22':'',
            '23':'', '24':'', '25':'', '26':'', '27':'', '28':'', '29':'', '30':'', '31':''};
        self.labels=[];
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
                    self.domainsFiltered=data['domainsList'];
                    console.log(data);
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

        //$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        //$scope.series = ['Series A', 'Series B', 'Series C'];
        //$scope.data = [
        //    [65, 59, 80, 81, 56, 55, 40],
        //    [30, 45, 58, 75, 56, 53, 26],
        //    [28, 48, 40, 19, 86, 27, 90]
        //];
        self.lastMonthSelected=function(){
            var today=new Date();
            var oneMonthAgo=new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            today.setHours(23,59,0,0);
            oneMonthAgo.setHours(0,0,0,0);
            self.startDate=oneMonthAgo.getTime();
            self.endDate=today.getTime();
            populateGraphLabels();
            updateGraph();
        };
        self.lastWeekSelected=function(){
            var today=new Date();
            var oneWeekAgo=new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
            today.setHours(23,59,0,0);
            oneWeekAgo.setHours(0,0,0,0);
            self.startDate=oneWeekAgo.getTime();
            self.endDate=today.getTime();
            populateGraphLabels();
            updateGraph();
        };
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
            console.log(self.daysLabels);
        }

    }]);
})();
