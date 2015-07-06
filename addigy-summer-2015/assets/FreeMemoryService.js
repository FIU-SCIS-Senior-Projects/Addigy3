/**
 * Created by matthewsaunders on 6/22/15.
 */
(function () {
    angular.module('app').service('FreeMemoryService',['DataRequest', function(DataRequest) {
        var self = this;
        self.activity = [];
        self.data = [];
        self.times = [];
        self.series = ['Available Memory'];
        self.datePickedDate = {
            date: new Date()
        }

        self.getMemoryData = function(orgId, selectedTenant){
            console.log(orgId, selectedTenant);
            DataRequest.getMemory(self.datePickedDate.date, orgId.org, selectedTenant.tenant).
                 success(function(data, status, headers, config) {
                     self.activity=data['history'];
                     processMemoryData();
                 }).error(function(data, status, headers, config) {
                     console.log(data);
                 });
        }

        function processMemoryData(){
            tmp = [];
            self.data.length=0;
            self.times.length=0;

            for(i=0; i<self.activity.length; i++){
                var curr = self.activity[i];
                var memory = curr.availMemory;
                var time = curr.date;
                self.times.push(time);
                tmp.push(parseFloat(memory));
            }
            self.data.push(tmp);

        }

    }]);
})();