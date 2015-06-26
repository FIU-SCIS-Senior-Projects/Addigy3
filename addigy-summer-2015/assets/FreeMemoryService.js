/**
 * Created by matthewsaunders on 6/22/15.
 */
(function () {
    angular.module('app').service('FreeMemoryService',['DataRequest', function(DataRequest) {
        var self = this;
        self.activity = [];
        self.data = [];
        self.times = [];
        self.series = ['Available Memory (Mb)'];
        self.datePickedDate={'date':new Date()};
        self.selectedDate=new Date();


        self.getMemoryData = function(chosenDate){

            self.selectedDate=chosenDate;
            DataRequest.getMemory(self.selectedDate.toISOString()).
                 success(function(data, status, headers, config) {
                     self.activity = []
                     self.activity=data['history'];
                     processMemoryData();
                 }).error(function(data, status, headers, config) {
                     console.log(data);
                 });
        }

        function processMemoryData(){
            //clear out existing data
            self.times.length=0;
            self.data.length=0;
            tmp = [];

            //populate data based on new date
            for(i=0; i<self.activity.length; i++){
                var curr = self.activity[i];
                var memory = curr.availMemory;
                var datetime = curr.date;
                //var time = datetime.split(' ')[1]
                self.times.push(datetime);
                tmp.push(parseFloat(memory));
            }
            self.data.push(tmp);

        }

    }]);
})();