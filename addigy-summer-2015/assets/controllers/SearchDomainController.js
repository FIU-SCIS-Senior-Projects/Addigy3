/**
 * Created by ayme on 6/15/15.
 */
(function () {
    angular.module('app').controller('SearchDomainController', ['DataRequest', '$timeout','$scope', function(DataRequest, $timeout, $scope) {
        var self = this;
        self.allDomains=[];
        self.allUsers=[];
        self.domainsFiltered=[];
        self.topSelectData = [{id:0,text:1},{id:1,text:2},{id:2,text:3},{id:3,text:4},{id:4,text:5}, {id:5,text:6} ,{id:6,text:7}, {id:7,text:8},{id:8,text:9}, {id:9,text:10}];
        self.selectedDomain="All";
        self.selectedTopNum=1;
        self.selectedUser="All";
        self.selectedType="All";
        self.daysLabels={};
        self.visitsPerDayPerDomain={};
        self.labels=[];
        self.series=[];
        self.graphData=[];
        self.startDate=0;
        self.endDate=0;
        var faviconurl =
        self.lineChartColors = [
            {"fillColor": "rgba(60,141,188,0.2) ","strokeColor": "rgba(60,141,188,1) ","pointColor": "rgba(60,141,188,1) ", "pointHighlightStroke":"rgba(60,141,188,1) "},
            {"fillColor": "rgba(141,188,60,0.2) ","strokeColor": "rgba(141,188,60,1) ","pointColor": "rgba(141,188,60,1) ", "pointHighlightStroke":"rgba(141,188,60,1) "},
            {"fillColor": "rgba(60,188,187,0.2) ","strokeColor": "rgba(60,188,187,1) ","pointColor": "rgba(60,188,187,1) ", "pointHighlightStroke":"rgba(60,188,187,1) "},
            {"fillColor": "rgba(188,60,141,0.2) ","strokeColor": "rgba(188,60,141,1) ","pointColor": "rgba(188,60,141,1) ", "pointHighlightStroke":"rgba(188,60,141,1) "},
            {"fillColor": "rgba(188,107,60,0.2) ","strokeColor": "rgba(188,107,60,1) ","pointColor": "rgba(188,107,60,1) ", "pointHighlightStroke":"rgba(188,107,60,1) "},
            {"fillColor": "rgba(188,60,77,0.2)  ","strokeColor": "rgba(188,60,77,1)  ","pointColor": "rgba(188,60,77,1)  ", "pointHighlightStroke":"rgba(188,60,77,1)  "},
            {"fillColor": "rgba(60,188,171,0.2) ","strokeColor": "rgba(60,188,171,1) ","pointColor": "rgba(60,188,171,1) ", "pointHighlightStroke":"rgba(60,188,171,1) "}
        ];
        self.options = {
            legendTemplate : '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%>' +
            '<li><span style=\"padding: 8px; background-color:<%=datasets[i].strokeColor%>\">' +
            '<img style=\"background-color:#F7F7D4;\" src="<%=datasets[i].label.indexOf(".")===-1?"assets/img/mac_app_favicon-16x16.png":"http://www.google.com/s2/favicons?domain="+datasets[i].label%>"/>' +
            '</span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
        }
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
            var typeToSend=(self.selectedDomain!=='All')?'All':self.selectedType
            DataRequest.getDomainInfo(self.selectedDomain, self.selectedUser,
                topQty, self.startDate, self.endDate, typeToSend)
                .success(function(data, status, headers, config) {
                    self.domainsFiltered=data['domainList'];
                    if (self.domainsFiltered.length!==0) processDomainsData();
                    else setValuesForNoDomains();
            }).error(function(data, status, headers, config) {
                 console.log(data);
            });
        };
        $(document).ready(
            function () {
                $("#topSelect").select2({data: self.topSelectData}).on("select2:select", function (e) {
                    self.selectedTopNum = ($('#topSelect :selected').text());
                    updateGraph();
                });
                $("#domainSelect").select2().on("select2:select", function (e) {
                    self.selectedDomain = $('#domainSelect :selected').text();
                    if(self.selectedDomain!=="All"){
                        $('#cloudBtn').addClass('disabled');
                        $('#allTypesBtn').addClass('disabled');
                        $('#systBtn').addClass('disabled');
                    }
                    else{
                        document.getElementById("cloudBtn").className = document.getElementById("cloudBtn").className.replace(/\bdisabled\b/,'');
                        document.getElementById("allTypesBtn").className = document.getElementById("allTypesBtn").className.replace(/\bdisabled\b/,'');
                        document.getElementById("systBtn").className = document.getElementById("systBtn").className.replace(/\bdisabled\b/,'');
                    }
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
            setGraphForLastWeek();
        };
        self.cloudAppsSelected=function(){
            self.selectedType="cloud";
            updateGraph();
        };
        self.allAppsSelected=function(){
            self.selectedType="All";
            updateGraph();
        };
        self.systemAppsSelected=function(){
            self.selectedType="syst";
            updateGraph();
        };
        function setGraphForLastWeek (){
            var today=new Date();
            var oneWeekAgo=new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
            dateRangeChanged(today, oneWeekAgo);
        }
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
                for(j=0;j<self.labels.length;j++){
                    var visitCount=domainData[self.labels[j]];
                    if(visitCount==null) domainGraphData.push(0);
                    else domainGraphData.push(visitCount.value);
                }
                self.graphData.push(domainGraphData);
            }
        }
        setGraphForLastWeek();

        function setValuesForNoDomains(){
            self.series.splice(0,self.series.length);
            self.labels.splice(0,self.labels.length);
            self.graphData.splice(0,self.graphData.length);
            for(var key in self.daysLabels) self.labels.push(self.daysLabels[key]);
            self.series.push(self.selectedDomain);
            var data=[];
            for(var label in self.daysLabels) data.push(0);
            self.graphData.push(data);
        }
    }]);
})();
