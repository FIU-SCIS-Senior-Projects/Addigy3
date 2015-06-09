/**
 * Created by ayme on 6/5/15.
 */
(function () {
    angular.module('app').controller('LoginDetailsController', ['LoginDataService', function(LoginDataService) {
        var self = this;
        self.pointSelected=LoginDataService.pointSelected;
        self.usersAtHour=LoginDataService.usersAtHour;
        self.showingDate=LoginDataService.datePickedDate;
        self.labels = LoginDataService.labels;
        self.dateToOnlyDateString= function (date) {
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            return month+"/"+day+"/"+year;
        };
        self.dateToOnlyTimeString = function (timestamp){
            var date = new Date(timestamp*1000);
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
            return hourStr+":"+minuteStr+":"+secondStr+" "+ampm;
         };
        self.getUsersAtHour=function(hour){
            LoginDataService.usersAtHour.values=LoginDataService.usersPerHour[hour];
            return LoginDataService.usersAtHour.values;
        };
        self.parseLabel=function(label){
            var replaced = label.replace(":","");
            return replaced;
        };
    }]);
})();
