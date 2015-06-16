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
        self.domainSelected=false;
        self.topSelectData=[2,3,4,5,10,20];
        self.selectedDomain="All";
        self.selectedTopNum=1;
        self.selectedUser="All";
        self.months=['Jan','Feb','March','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
        self.labels=[];

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
            populateGraphScale();
            var topQty=(self.selectedDomain==='All')?self.selectedTopNum:0;
            var fromDate = new Date(self.startDate);
            fromDate = fromDate.setHours(0,0,0,0);
            var toDate = new Date(self.endDate);
            toDate = toDate.setHours(23,59,0,0);
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
        Date.prototype.addDays = function(days) {
            var dat = new Date(this.valueOf())
            dat.setDate(dat.getDate() + days);
            return dat;
        }
        function populateGraphScale(){
            var elapsedTime = self.endDate.getTime()-self.startDate.getTime();
            var elapsedDays = elapsedTime / (1000*60*60*24);
            if(elapsedDays<2) setScaleToHours();
            else if(elapsedDays>=2 && elapsedDays<14) setScaleToDays();
            else if(elapsedDays>=14 && elapsedDays<31) setScaleToWeeks();
            else setScaleToMonths();
        }
        function setScaleToHours(){
            self.labels.splice(0, self.labels.length);
            var stopDate=0;
            if(isDateToday(new Date(self.startDate)))
                stopDate=new Date().getHours();
            else stopDate=23;
            var i;
            for(i=0;i<=stopDate;i++){
                self.labels.push(i);
            }
            console.log(self.labels);
        }
        function setScaleToDays(){
            self.labels.splice(0,self.labels.length);
            var currentDate = new Date(self.startDate);
            while (currentDate <= self.endDate) {
                self.labels.push(currentDate.toDateString());
                currentDate = currentDate.addDays(1);
            }
            console.log(self.labels);
        }
        function setScaleToWeeks(){
            self.labels.splice(0,self.labels.length);
            var currentDate = new Date(self.startDate);
            while (currentDate <= self.endDate) {
                self.labels.push(currentDate.toDateString()+"-"+currentDate.addDays(7).toDateString())
                currentDate = currentDate.addDays(8);
            }
            console.log(self.labels);
        }
        function setScaleToMonths(){
            self.labels.splice(0,self.labels.length);
            var currMonth=self.startDate.getMonth();
            var endMonth = self.endDate.getMonth();
            while (currMonth <= endMonth) {
                self.labels.push(self.months[currMonth]);
                currMonth++;
            }
            console.log(self.labels);
        }
        function isDateToday(inputDate){
            var todaysDate = new Date();
            return (inputDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0));

        }
        //$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        //$scope.series = ['Series A', 'Series B', 'Series C'];
        //$scope.data = [
        //    [65, 59, 80, 81, 56, 55, 40],
        //    [30, 45, 58, 75, 56, 53, 26],
        //    [28, 48, 40, 19, 86, 27, 90]
        //];

    }]);
})();
