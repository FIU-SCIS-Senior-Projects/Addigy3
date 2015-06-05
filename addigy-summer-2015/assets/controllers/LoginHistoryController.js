/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('LoginHistoryController', ['DataRequest', function(DataRequest) {
        var self = this;
        self.activities=null;
        self.showHourDetail=false;
        self.usersPerHour={};
        self.labels = [];
        self.series = ['Login History'];
        self.data = [];
        self.usersAtHour=[];
        self.calendarMaxDate=new Date();

        self.today = function() {
            self.dt = new Date();
        };
        self.getActivity = function(){
            self.showHourDetail=false;
            var chosenDate = self.dt;
            chosenDate.setHours(0,0,0,0);
            var startTime=chosenDate.getTime()/1000;
            chosenDate.setHours(23,0,0,0);
            var endTime=chosenDate.getTime()/1000;
            DataRequest.getHistory(startTime, endTime).
                success(function(data, status, headers, config) {
                    self.activities=data['loginHistory'];
                    processLoginData();
                }).error(function(data, status, headers, config) {
                     console.log(data);
                });
        }
        self.today();
        populateTimesArray(getCurrentHour());
        self.getActivity();
        self.onPointClick = function (points, evt) {
            var hour=points[0].label;
            self.usersAtHour=self.usersPerHour[hour];
            self.showHourDetail=true;
        };

        function populateTimesArray(lastHour) {
            self.usersPerHour={};
            var i;
            for(i=1;i<=lastHour;i++){
                self.usersPerHour[i]=[]
            }
        };
        function isShowingToday(){
            var todayDate = new Date();
            var selectedData = self.dt;
            return todayDate.setHours(0,0,0,0) == selectedData.setHours(0,0,0,0);
        }
        function isStillLoggedIn(logout){
            return logout ==9999999999;
        }
        function getCurrentHour(){
            return new Date().getHours();
        }
        function getDateBeginingTimeStamp(){
            var selected = self.dt;
            selected.setHours(0,0,0,0);
            return selected.getTime()/1000;
        }
        function processLoginData(){
            if(isShowingToday()) populateTimesArray(getCurrentHour());
            else populateTimesArray(23);
            var i, j,k;
            for(i=0; i<self.activities.length;i++){
                var curr = self.activities[i];
                var userAct = curr.activity;
                for(j=0;j<userAct.length;j++){
                    var currAct = userAct[j];
                    var loginDate = new Date(currAct.login*1000);
                    var logoutDate = new Date(currAct.logout*1000);
                    var loginHour = loginDate.getHours();
                    var logoutHour = logoutDate.getHours();
                    if(loginDate.getMinutes()!=0&&loginHour!=23)
                        loginHour+=1;
                    if(isStillLoggedIn(currAct.logout)){
                        if(isShowingToday())
                            logoutHour=getCurrentHour();
                        else
                            logoutHour=23;
                    }
                    if(currAct.login<getDateBeginingTimeStamp())
                        loginHour=1;
                    for(k=loginHour;k<=logoutHour;k++)
                        self.usersPerHour[k].push(new user(curr.username, currAct.login, currAct.logout, curr.connectorId));
                }
            }
            populateGraphData();
        }
        function populateGraphData(){
            self.labels.length=0;
            self.data.length=0;
            var values=[];
            for (var key in self.usersPerHour) {
                self.labels.push(key);
                var value= self.usersPerHour[key];
                values.push(value.length);
            }
            self.data.push(values);
        }
        function user(username,login,logout, connectorId) {
            this.username=username;
            this.login=login;
            this.logout=logout;
            this.connectorId = connectorId;
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
            return month+"/"+day+"/"+year+"  "+hourStr+":"+minuteStr+":"+secondStr+" "+ampm;
        };
        self.clear = function () {
            self.dt = null;
        };
        // Disable weekend selection
        self.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
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
    }]);
})();