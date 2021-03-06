/**
 * Created by matthewsaunders on 7/1/15.
 */
(function () {
    angular.module('app').service('VolatileDataService',['DataRequest', function(DataRequest) {
        var self = this;
        self.startDate = {
            date: new Date()
        };
        self.endDate = {
            date: new Date()
        };
        self.data = [];
        self.rawdata = [];
        self.cpuMemData = [];
        self.labels = [];
        self.callbacks = [];
        self.series = ['CPU', 'Memory'];

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
                    //processVolatileData();
                    processCpuMemGraphData();
                 }).error(function(data, status, headers, config) {
                     console.log(data);
                 });
        }

        volatileFacts = ["memoryfree", "memoryfree_mb", "sp_uptime", "system_uptime", "uptime_seconds", "sys_cpu_usage"];

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
        }

        function processCpuMemGraphData(){
            self.cpuMemData.length = 0;
            self.labels.length = 0;
            reports = self.rawdata.pop();

            cpuData = [];
            memData = [];

            labelFilter = Math.ceil(reports.length / 10);

            for(i=0; i<reports.length; i++){
                facter = reports[i].facter.pop();
                if(facter.hasOwnProperty('sys_cpu_usage') && facter.hasOwnProperty('memoryfree_mb')) {
                    timestamp = reports[i].timestamp;
                    obj = {};
                    avail = parseFloat(facter.memoryfree_mb);
                    size = parseFloat(facter.memorysize_mb);
                    obj['memoryUsage'] = (size - avail) / size;
                    obj['cpuUsage'] = facter.sys_cpu_usage;

                    cpuData.push(parseFloat(facter.sys_cpu_usage).toFixed(2));
                    memData.push((100 * (size - avail) / size).toFixed(2));
                    if (i % labelFilter == 0) {
                        self.labels.push(new Date(timestamp).toLocaleString());
                    } else {
                        self.labels.push("");
                    }
                }
            }

            self.cpuMemData.push(cpuData, memData);
        }

        self.registerCallback = function(fun){
            self.callbacks.push(fun);
        };

        self.alertCallbacks = function(){
            for(i=0; i<self.callbacks.length; i++){
                self.callbacks[i]();
            }
        }

    }]);
})();