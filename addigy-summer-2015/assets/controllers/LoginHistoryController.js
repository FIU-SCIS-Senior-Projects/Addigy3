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
                     self.activities=data['loginHistory'];
                     self.showHistory=true;
                 }).error(function(data, status, headers, config) {
                     console.log(data);
                 });
        }
        new Morris.Line({
            element: 'myfirstchart',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            parseTime: false,
            data: [
                { hour: '8 am', value: 20 },
                { hour: '9 am', value: 10 },
                { hour: '10 am', value: 5 },
                { hour: '11 am', value: 5 },
                { hour: '12 am', value: 20 }
            ],
            // The name of the data record attribute that contains x-values.
            xkey: 'hour',
            // A list of names of data record attributes that contain y-values.
            ykeys: ['value'],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: ['Users']
        }).on('click', function(i, row){
            console.log(i, row);
        });;
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
            return month+"/"+day+"/"+year+"  "+hourStr+":"+minuteStr+":"+secondStr+" "+ampm;
    };
    }]);
})();