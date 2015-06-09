/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('LoginGraphController', ['DataRequest', 'LoginDataService', function(DataRequest, LoginDataService) {
        var self = this;
        self.activities=LoginDataService.activities;
        self.usersPerHour=LoginDataService.usersPerHour;
        self.labels = LoginDataService.labels;
        self.series = LoginDataService.series;
        self.data = LoginDataService.graphData;
        self.pointSelected=LoginDataService.pointSelected;
        self.calendarMaxDate=new Date();
        self.datePickedDate=LoginDataService.datePickedDate;
        self.getActivity=function(){
            LoginDataService.getActivity(self.datePickedDate.date);
        };
        self.toggleMin = function() {
            self.minDate = self.minDate ? null : new Date();
        };
        self.toggleMin();

        self.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            self.opened = true;
        };
        self.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        self.formats = ['MMMM-dd-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        self.format = self.formats[0];
        self.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);
                for (var i=0;i<self.events.length;i++){
                    var currentDay = new Date(self.events[i].date).setHours(0,0,0,0);
                    if (dayToCheck === currentDay) {
                        return self.events[i].status;
                    }
                }
            }
            return '';
        };
        function parseLabel(label){
            var replaced = label.replace(":","");
            return replaced;
        };
        self.onPointClick = function (points, evt) {
            var i;
            for(i=0;i<self.labels.length;i++)
                $('#'+parseLabel(self.labels[i])).collapse("hide");
            $('#detailsCollapse').collapse("show");
            var element = $('#'+parseLabel((points[0]).label));
            element.collapse("toggle");
            element.get(0).scrollIntoView();
            var hour=points[0].label;
            LoginDataService.usersAtHour.values=LoginDataService.usersPerHour[hour];
            self.pointSelected.selected=true;
        };
    }]);
})();
