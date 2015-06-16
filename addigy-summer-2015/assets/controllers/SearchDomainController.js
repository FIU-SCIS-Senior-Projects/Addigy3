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
        self.topSelectData=[2,3,4,5,10,20];
        self.selectedDomain="All";
        self.selectedTopNum=1;
        self.selectedUser="All";
        self.selectedStart=0;
        self.selectedEnd=0;

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
                topQty, self.selectedStart, self.selectedEnd)
                .success(function(data, status, headers, config) {
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
            if (self.selectedDomain==='All') {
                $('#topSelect').prop('disabled', false);
            }
            else {
                $('#topSelect').prop('disabled', 'disabled');
            }
        };
    }]);
})();
