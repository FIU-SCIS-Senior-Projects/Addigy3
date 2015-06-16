/**
 * Created by ayme on 6/15/15.
 */
/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('SearchDomainController', ['DataRequest', '$timeout','$scope', function(DataRequest, $timeout, $scope) {
        var self = this;
        self.allDomains=[];
        self.allUsers=[];
        self.domainVisitsCount=0;
        self.domainUsers=[];
        self.domainSelected=false;
        self.topSelectData=[2,3,4,5,10,20];
        self.selectedDomain="All";
        self.selectedTopNum=1;
        self.selectedUser="All";

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
            var fromDate = new Date(self.startDate);
            fromDate = fromDate.setHours(0,0,0,0);
            //fromDate=fromDate/1000;
            var toDate = new Date(self.endDate);
            toDate = toDate.setHours(23,59,0,0);
            //toDate = toDate/1000;
            DataRequest.getDomainInfo(self.selectedDomain, self.selectedUser,
                topQty, fromDate, toDate)
                .success(function(data, status, headers, config) {
                    console.log(data);
            }).error(function(data, status, headers, config) {
                 console.log(data);
            });
        };
        self.dateRangeChanged = function(){
            updateGraph();
        }
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
        self.endDate = new Date();
        self.startDate = new Date (self.endDate);
        self.startDate=self.startDate.setMonth(self.startDate.getMonth()-1);
        self.minStartDate = new Date('05/01/15'); //fixed date
        self.maxStartDate = self.endDate; //init value
        self.minEndDate = self.startDate; //init value
        self.maxEndDate = self.endDate; //fixed date same as $scope.maxStartDate init value

        self.startChanged = function(){
            self.minEndDate = new Date(self.startDate);
            //console.log(self.minEndDate);
            updateGraph();
        };
        self.endChanged = function(){
            self.maxStartDate = self.endDate;
            updateGraph();
        };
        self.openStart = function() {
            $timeout(function() {
                self.startOpened = true;
            });
        };
        self.openEnd = function() {
            $timeout(function() {
                self.endOpened = true;
            });
        };
        self.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };
    }]);
})();
