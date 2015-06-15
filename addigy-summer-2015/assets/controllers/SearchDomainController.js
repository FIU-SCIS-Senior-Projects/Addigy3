/**
 * Created by ayme on 6/15/15.
 */
/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('SearchDomainController', ['DataRequest', function(DataRequest) {
        var self = this;
        self.allDomains=[];
        self.allUsers=[];
        self.domainVisitsCount=0;
        self.domainUsers=[];
        self.domainSelected=false;
        self.topSelectData=[1,5,10,20];
        self.selectedDomain="";
        self.selectedTopNum="";
        self.selectedUser="";

        function getAllDomains(){
            DataRequest.getAllDomains().
                success(function(data, status, headers, config) {
                    var domainsData=data['allDomains'];
                    self.allDomains=domainsData[0].domain;
                    self.allUsers=domainsData[0].username;
                    console.log(self.allUsers);
                }).error(function(data, status, headers, config) {
                     console.log(data);
                });
        };
        getAllDomains();
        $.fn.select2.defaults = $.extend($.fn.select2.defaults, {
            allowClear: true, // Adds X image to clear select
            closeOnSelect: true, // Only applies to multiple selects. Closes the select upon selection.
            placeholder: 'Select...',
            minimumResultsForSearch: 15 // Removes search when there are 15 or fewer options
        });
        self.update = function() {
            console.log('selected');
            console.log(self.selectedDomain);
            console.log(self.selectedTopNum);
        };
        function updateGraph(){
            DataRequest.getDomainInfo(self.selectedDomain)
                .success(function(data, status, headers, config) {
                    self.domainVisitsCount=0;
                    self.domainUsers.length=0;
                    var domainsList = data['domainList'];
                    var i;
                    for(i=0; i<domainsList.length;i++){
                        var currDomain=domainsList[i];
                        self.domainVisitsCount+=currDomain['visits'].length;
                        self.domainUsers.push(currDomain['username']);
                    }
                    console.log(self.domainVisitsCount);
                    self.domainSelected=true;
            }).error(function(data, status, headers, config) {
                 console.log(data);
            });
        };
        $(document).ready(
            function () {
                //var configParamsObj = {
                //    placeholder: 'Select a domain...', // Place holder text to place in the select
                //    minimumResultsForSearch: 3 // Overrides default of 15 set above
                //};
                $("#topSelect").select2().on("select2:select", function (e) {
                    self.selectedTopNum = $('#topSelect :selected').text();
                });
                $("#domainSelect").select2({placeholder:"Select Domain"}).on("select2:select", function (e) {
                    self.selectedDomain = $('#domainSelect :selected').text();
                    updateGraph();
                });
                $("#userSelect").select2({placeholder:"Select User"}).on("select2:select", function (e) {
                    self.selectedUser = $('#userSelect :selected').text();
                });
            });
    }]);
})();
