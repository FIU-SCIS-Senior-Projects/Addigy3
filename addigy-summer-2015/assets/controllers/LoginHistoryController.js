/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('LoginHistoryController', ['DataRequest', function(DataRequest) {
        var self = this;
        self.showHistory=false;
        self.activities=null;
        self.getHistory = function(){
             DataRequest.getHistory().
                 success(function(data, status, headers, config) {
                     self.activities=data["loginHistory"];
                     self.showHistory=true;
                 }).error(function(data, status, headers, config) {
                     console.log(data);
                 });
        }
        self.dateToString = function (timestamp){
            var date = new Date(timestamp*1000);
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            var militaryHour = date.getHours();
            var hours = militaryHour;
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var ampm = 'AM';
            if(militaryHour>12){
                ampm = 'PM';
                hours = militaryHour % 12;
            }
            var hourStr = hours<10?'0'+hours:''+hours;
            var minuteStr = minutes<10?'0'+minutes:''+minutes;
            var secondStr = seconds<10?'0'+seconds:''+seconds;
            return month+"/"+day+"/"+year+" - "+hourStr+":"+minuteStr+":"+secondStr+" "+ampm;
    };
    }]);
})();