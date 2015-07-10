/**
 * Created by matthewsaunders on 7/1/15.
 */
(function () {
    angular.module('app').service('NonvolatileTimelineService',['DataRequest', function(DataRequest) {
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
        self.deltas = [];

        self.initializeDates = function(){
            self.changeStartDate(1);
        }

        self.changeStartDate = function(offset){
            self.startDate.date=new Date();
            var today = new Date();
            self.startDate.date.setDate(today.getDate() - offset);
            self.startDate.date.setHours(0,0,0,0);
            self.data.length=0;
            self.getTimeline();
        }

        self.getTimeline = function(){
            DataRequest.getNonvolatileTimeline(self.startDate.date, self.endDate.date).
                 success(function(data, status, headers, config) {
                    self.rawdata.length = 0;
                    self.rawdata.push(data["timelineData"]);
                    processNonvolatileData();
                 }).error(function(data, status, headers, config) {
                     console.log(data);
                 });
        }

        volatileFacts = ["memoryfree", "memoryfree_mb", "sp_uptime", "system_uptime", "uptime_seconds"];

        function processNonvolatileData(){
            self.data.length = 0;
            reports = self.rawdata.pop();
            for(i=0; i<reports.length; i++){
                facter = reports[i].facter.pop();
                timestamp = reports[i].timestamp;
                obj = {};

                for (var property in facter) {
                    if( !(volatileFacts.indexOf(property) > -1) ){
                        obj[property] = facter[property];
                    }
                }
                origobj = { 'facter': obj,
                            'timestamp': timestamp,
                            'orgId': reports[i].orgId,
                            'connectorId': reports[i].connectorId};
                self.data.push(origobj);
            }
            findDeltas();
        }

        function findDeltas(){
            self.deltas.length = 0;
            if(self.data.length == 0){
                return [];
            }
            stack = [];
            baseReport = self.data[0].facter;
            for(i=1; i<self.data.length; i++){
                currentFacter = self.data[i].facter;
                currentTimestamp = self.data[i].timestamp;
                for (var property in currentFacter) {
                    if(baseReport[property] == null) {
                        obj = {
                            'timestamp': Date.parse(currentTimestamp),
                            'orgId': self.data[i].orgId,
                            'connectorId': self.data[i].connectorId,
                            'property': property,
                            'oldValue': baseReport[property],
                            'newValue': currentFacter[property]
                        };
                        self.deltas.push(obj);

                        baseReport[property] = currentFacter[property];
                    }else if(baseReport[property] != currentFacter[property] && typeof baseReport[property] != 'object'){
                        when = new Date(currentTimestamp);
                        console.log(when);
                        obj = {
                            'time': when.toLocaleTimeString(),
                            'date': when.toLocaleDateString(),
                            'orgId': self.data[i].orgId,
                            'connectorId': self.data[i].connectorId,
                            'property': property,
                            'oldValue': baseReport[property],
                            'newValue': currentFacter[property]
                        };

                        stack.push(obj);

                        baseReport[property] = currentFacter[property];
                    }
                }
            }
            //put the deltas in chronological order
            count = stack.length;
            for(i=0; i<count; i++) {
                self.deltas.push(stack.pop());
            }
        }

    }]);
})();