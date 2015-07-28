/**
 * Created by matthewsaunders on 7/19/15.
 */
(function () {
    angular.module('app').controller('SocketController', ['DataRequest', 'SocketService', function(DataRequest, SocketService) {
        var self = this;
        self.rawdata = SocketService.rawdata;
        self.data = [];
        self.rawdata = [];
        self.startDate = {
            date: new Date()
        };
        self.endDate = {
            date: new Date()
        };
        self.graphDataObj = {};
        self.graphLabels = [];
        self.graphData = [];
        self.graphSeries = [];
        self.plotOneDay = true;
        self.plotOneWeek = true;

        self.hours = {
            0: {},
            1: {},
            2: {},
            3: {},
            4: {},
            5: {},
            6: {},
            7: {},
            8: {},
            9: {},
            10: {},
            11: {},
            12: {},
            13: {},
            14: {},
            15: {},
            16: {},
            17: {},
            18: {},
            19: {},
            20: {},
            21: {},
            22: {},
            23: {},
        };

        self.hoursLabels={
            "0":"12:00am",
            "1":"1:00am",
            "2":"2:00am",
            "3":"3:00am",
            "4":"4:00am",
            "5":"5:00am",
            "6":"6:00am",
            "7":"7:00am",
            "8":"8:00am",
            "9":"9:00am",
            "10":"10:00am",
            "11":"11:00am",
            "12":"12:00pm",
            "13":"1:00pm",
            "14":"2:00pm",
            "15":"3:00pm",
            "16":"4:00pm",
            "17":"5:00pm",
            "18":"6:00pm",
            "19":"7:00pm",
            "20":"8:00pm",
            "21":"9:00pm",
            "22":"10:00pm",
            "23":"11:00pm",

        };

        self.lineChartColors = [
            {"fillColor": "rgba(60,141,188,0.2) ","strokeColor": "rgba(60,141,188,1) ","pointColor": "rgba(60,141,188,1) ", "pointHighlightStroke":"rgba(60,141,188,1) "},
            {"fillColor": "rgba(141,188,60,0.2) ","strokeColor": "rgba(141,188,60,1) ","pointColor": "rgba(141,188,60,1) ", "pointHighlightStroke":"rgba(141,188,60,1) "},
            {"fillColor": "rgba(60,188,187,0.2) ","strokeColor": "rgba(60,188,187,1) ","pointColor": "rgba(60,188,187,1) ", "pointHighlightStroke":"rgba(60,188,187,1) "},
            {"fillColor": "rgba(188,60,141,0.2) ","strokeColor": "rgba(188,60,141,1) ","pointColor": "rgba(188,60,141,1) ", "pointHighlightStroke":"rgba(188,60,141,1) "},
            {"fillColor": "rgba(188,107,60,0.2) ","strokeColor": "rgba(188,107,60,1) ","pointColor": "rgba(188,107,60,1) ", "pointHighlightStroke":"rgba(188,107,60,1) "},
            {"fillColor": "rgba(188,60,77,0.2)  ","strokeColor": "rgba(188,60,77,1)  ","pointColor": "rgba(188,60,77,1)  ", "pointHighlightStroke":"rgba(188,60,77,1)  "},
            {"fillColor": "rgba(60,188,171,0.2) ","strokeColor": "rgba(60,188,171,1) ","pointColor": "rgba(60,188,171,1) ", "pointHighlightStroke":"rgba(60,188,171,1) "}
        ];

        self.initializeDates = function(){
            self.startDate.date = new Date();
            self.startDate.date.setHours(0,0,0,0);
            self.getSocketData();
        };

        self.changeStartDate = function(offset){
            if(offset == 1){
                self.plotOneDay = true;
                self.plotOneWeek = false;
            }else{
                self.plotOneDay = false;
                self.plotOneWeek = true;
            }
            var today = new Date();
            self.startDate.date = new Date();
            self.startDate.date.setDate(today.getDate() - offset);
            self.startDate.date.setHours(0,0,0,0);
            self.getSocketData();
        };

        self.changeStartDateByMonth = function(){
            self.plotOneDay = false;
            self.plotOneWeek = false;
            var today = new Date();
            self.startDate.date = new Date();
            self.startDate.date.setMonth(today.getMonth() - 1);
            self.startDate.date.setHours(0,0,0,0);
            self.getSocketData();
        };

        self.getSocketData = function(){
            DataRequest.getVolatileFacts(self.startDate.date, self.endDate.date).
                 success(function(data, status, headers, config) {
                    self.rawdata.length = 0;
                    self.rawdata.push(data["volatileData"]);
                    processSocketData();
                 }).error(function(data, status, headers, config) {
                     console.log(data);
                 });
        };

        function processSocketData(){
            self.data.length = 0;

            reports = self.rawdata.pop();
            for(i=0; i<reports.length; i++){
                facter = reports[i].facter.pop();
                timestamp = new Date(reports[i].timestamp);
                obj = {timestamp: timestamp, net_sock_info: facter.net_sock_info, connectorId: reports[i].connectorId};
                self.data.push(obj);
            }


            if(self.plotOneDay){
                filterReportsByHour();
            }else{
                filterReportsByDay();
            }
        }

        function filterReportsByHour(){

            //clear any existing data
            for(i=0; i<24; i++){
                self.hours[i] = {length: 0};
            }

            //populate data by hours
            for(i=0; i<self.data.length; i++) {
                store = {};
                curr = self.data[i];
                index = curr.timestamp.getHours();
                if(typeof curr.net_sock_info === "undefined"){
                    sockets = "";
                }else {
                    sockets = curr.net_sock_info.split("\n");
                }
                id = curr.connectorId;

                for (j = 0; j < sockets.length; j++) {
                    record = sockets[j].split("\t");
                    source = record[0];
                    port = parseInt(record[1]);


                    if (source in store) {
                        if (store[source].ports.indexOf(port) < 0) {
                            store[source].ports.push(port);
                        }
                        if (store[source].tenants.indexOf(id) < 0) {
                            store[source].tenants.push(id);
                        }
                    } else {
                        store[source] = {
                            source: source,
                            ports: [port],
                            tenants: [id]
                        }
                    }

                }

                //copy over data for this record into main data store (self.hours) without duplicating data
                for (var source in store) {
                    //true when a record for this source exists
                    if (source in self.hours[index]) {
                        //check if a tenant or port from the record just parsed needs to be added
                        for (var tenant in store[source].tenants) {
                            if (self.hours[index][source].tenants.indexOf(store[source].tenants[tenant]) < 0) {
                                self.hours[index][source].tenants.push(store[source].tenants[tenant]);
                            }
                        }

                        for (var port in store[source].ports) {
                            if (self.hours[index][source].ports.indexOf(store[source].ports[port]) < 0) {
                                self.hours[index][source].ports.push(store[source].ports[port]);
                            }
                        }
                    } else {
                        self.hours[index][source] = store[source];
                        self.hours[index].length++;
                    }
                }

            }
            processGraphDataForOneDay();
        }

        function processGraphDataForOneDay(){
            self.graphDataObj = {};
            self.graphData.length=0;
            self.graphSeries.length=0;
            self.graphLabels.length=0;
            sourceList = [];

            //figure out what data sources exist
            for(var hour in self.hours){
                for(var index in self.hours[hour]) {
                    if(sourceList.indexOf(self.hours[hour][index].source) < 0){
                        sourceList.push(self.hours[hour][index].source);
                    }
                }
            }

            //initialize data arrays
            for(var source in sourceList){
                self.graphDataObj[sourceList[source]] = [0,0,0,0,0,0,0,0,0,0,0,0,
                                            0,0,0,0,0,0,0,0,0,0,0,0,];
            }
            for(i=0; i<24; i++){
                self.graphLabels.push(self.hoursLabels[i]);
            }

            timeStep = {};
            //populate data from object
            for(var hour in self.hours){
                timeStep = {};

                for(var index in self.hours[hour]){
                    record = self.hours[hour][index];
                    for(tenant in record.tenants){
                        if(!(record.source in timeStep)){
                            timeStep[record.source] = [record.tenants[tenant]];
                            self.graphDataObj[record.source][hour]++;
                        }else if(timeStep[record.source].indexOf(record.tenants[tenant]) < 0){
                            timeStep[record.source].push(record.tenants[tenant]);
                            self.graphDataObj[record.source][hour]++;
                        }
                    }
                }
            }
            for(var source in self.graphDataObj){
                self.graphData.push(self.graphDataObj[source]);
                self.graphSeries.push(source);
            }
        }

        function filterReportsByDay(){
            //clear any existing data
            for(i=0; i<24; i++){
                self.hours[i].length=0;
            }

            //populate data by hours
            for(i=0; i<self.data.length; i++) {
                curr = self.data[i];
                index = curr.timestamp.getHours();
                store = {};
                if(typeof curr.net_sock_info === "undefined"){
                    sockets = "";
                }else {
                    sockets = curr.net_sock_info.split("\n");
                }
                id = curr.connectorId;

                for (j = 0; j < sockets.length; j++) {
                    record = sockets[j].split("\t");
                    source = record[0];
                    port = parseInt(record[1]);
                    if (source in store) {
                        if (store[source].ports.indexOf(port) < 0) {
                            store[source].ports.push(port);
                        }
                        if (store[source].tenants.indexOf(id) < 0) {
                            store[source].tenants.push(id);
                        }
                    } else {
                        store[source] = {
                            source: source,
                            ports: [port],
                            tenants: [id]
                        }
                    }
                }
            }

                for(var source in store) {
                    self.hours[index].push(store[source]);
                }


            processGraphDataForOneDay();
        }

        function processGraphDataForManyDays(){
            self.graphData.length=0;

            self.graphDataObj = {};
            self.graphData.length=0;
            self.graphSeries.length=0;
            self.graphLabels.length=0;
            sourceList = [];

            //figure out what data sources exist
            for(var hour in self.hours){
                for(var index in self.hours[hour]) {
                    if(sourceList.indexOf(self.hours[hour][index].source) < 0){
                        sourceList.push(self.hours[hour][index].source);
                    }
                }
            }

        }


    }]);
})();