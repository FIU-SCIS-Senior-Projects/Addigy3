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

        function initializeDates(){
            self.endDate.date.setHours(23,59,59,999);
            self.startDate.date.setHours(0,0,0,0);
        }
        initializeDates();

        self.changeStartDate = function(offset){
            var today = new Date();
            self.startDate.date = today.setDate(today.getDate() - offset).setHours(0,0,0,0);
        }

        self.getVolatileFacts = function(){
            //loadVolatileFacts();
        }



    }]);
})();