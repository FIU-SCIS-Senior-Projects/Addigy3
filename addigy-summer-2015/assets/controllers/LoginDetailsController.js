/**
 * Created by ayme on 6/5/15.
 */
/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('LoginDetailsController', ['LoginData', function(LoginData) {
        var self = this;
        self.usersAtHour=LoginData.usersAtHour;
        self.pointSelected=LoginData.pointSelected;
        self.usersAtHour=LoginData.usersAtHour;

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