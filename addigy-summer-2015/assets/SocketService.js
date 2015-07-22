/**
 * Created by matthewsaunders on 7/19/15.
 */
(function () {
    angular.module('app').service('SocketService',['DataRequest', function(DataRequest) {
        var self = this;
        self.startDate = {
            date: new Date()
        };
        self.endDate = {
            date: new Date()
        };
        self.rawdata = [];

        self.initializeDates = function(){
            self.changeStartDate(1);
        }

        self.changeStartDate = function(offset){
            self.startDate.date=new Date();
            var today = new Date();
            self.startDate.date.setDate(today.getDate() - offset);
            self.startDate.date.setHours(0,0,0,0);
        }

        self.getSocketData = function(){
            console.log("before");
            DataRequest.getVolatileFacts(self.startDate.date, self.endDate.date).
                 success(function(data, status, headers, config) {
                    console.log("after");
                    self.rawdata.length = 0;
                    self.rawdata.push(data["volatileData"]);
                    console.log("service data");
                    //processSocketData();
                 }).error(function(data, status, headers, config) {
                     console.log(data);
                 });
        }

        //function processSocketData(){
        //    self.data.length = 0;
        //
        //    reports = self.rawdata.pop();
        //    for(i=0; i<reports.length; i++){
        //        facter = reports[i].facter.pop();
        //        timestamp = new Date(reports[i].timestamp);
        //        obj = {timestamp: timstamp, net_sock_info: facter.net_sock_info};
        //        self.data.push(obj);
        //    }
        //}


    }]);
})();