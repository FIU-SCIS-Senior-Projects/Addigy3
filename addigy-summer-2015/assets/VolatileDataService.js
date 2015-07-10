/**
 * Created by matthewsaunders on 7/1/15.
 */
(function () {
    angular.module('app').service('VolatileDataService',['DataRequest', function(DataRequest) {
        var self = this;
        self.volatileFactsFile = "lib/volatileFacts.json";
        self.startDate = {
            date: new Date()
        };
        self.endDate = {
            date: new Date()
        };
        self.data = [];
        self.rawdata = [];

        self.initializeDates = function(){
            self.changeStartDate(1);
        }

        self.changeStartDate = function(offset){
            self.startDate.date=new Date();
            var today = new Date();
            self.startDate.date.setDate(today.getDate() - offset);
            self.startDate.date.setHours(0,0,0,0);
            self.data.length=0;
            self.getVolatileFacts();
        }

        self.getVolatileFacts = function(){
            DataRequest.getVolatileFacts(self.startDate.date, self.endDate.date).
                 success(function(data, status, headers, config) {
                    self.rawdata.length = 0;
                    self.rawdata.push(data["volatileData"]);
                    processVolatileData();
                 }).error(function(data, status, headers, config) {
                     console.log(data);
                 });
        }

        volatileFacts = ["memoryfree", "memoryfree_mb", "sp_uptime", "system_uptime", "uptime_seconds"];

        function processVolatileData(){
            self.data.length = 0;
            reports = self.rawdata.pop();
            for(i=0; i<reports.length; i++){
                facter = reports[i].pop();
                obj = {};
                for(j=0; j<volatileFacts.length; j++){
                    fact = volatileFacts[j];
                    obj[fact] = facter[fact];
                }
                self.data.push(obj);
            }
            console.log(self.data);
        }

    }]);
})();