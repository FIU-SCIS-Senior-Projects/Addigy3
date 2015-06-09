/**
 * Created by ayme on 6/5/15.
 */
(function () {
    angular.module('app').service('LoginData',['DataRequest', function(DataRequest) {
        var self = this;
        self.usersPerHour={};
        self.selectedDate=new Date();
        self.activities=null;
        self.labels = [];
        self.series = ['Login History'];
        self.graphData = [];
        self.showHourDetail=false;
        self.pointSelected={'selected':false};
        self.usersAtHour={'values':[]};
        self.datePickedDate={'date':new Date()};
        self.hoursLabels={
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
        self.getActivity=function(chosenDate){
            self.selectedDate=chosenDate;
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
        };
        function populateTimesArray(lastHour) {
            self.usersPerHour={};
            var i;
            for(i=0;i<=lastHour;i++){
                self.usersPerHour[i]=[]
            }
        };
        populateTimesArray(getCurrentHour());
        self.getActivity(self.selectedDate);
        function isShowingToday(){
            var todayDate = new Date();
            var selectedData = self.selectedDate;
            return todayDate.setHours(0,0,0,0) == selectedData.setHours(0,0,0,0);
        }
        function isStillLoggedIn(logout){
            return logout ==9999999999;
        }
        function getCurrentHour(){
            return new Date().getHours();
        }
        function getDateBeginingTimeStamp(){
            var selected = self.selectedDate;
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
                    if(logoutHour==0)
                        self.usersPerHour[0].push(new user(curr.username, currAct.login, currAct.logout, curr.connectorId));
                    for(k=loginHour;k<=logoutHour;k++){
                        self.usersPerHour[k].push(new user(curr.username, currAct.login, currAct.logout, curr.connectorId));
                    }

                }
            }
            populateGraphData();
        }
        function populateGraphData(){
            self.labels.length=0;
            self.graphData.length=0;
            var values=[];
            for (var key in self.usersPerHour) {
                self.labels.push(key);
                var value= self.usersPerHour[key];
                values.push(value.length);
            }
            self.graphData.push(values);
        }
        function user(username,login,logout, connectorId) {
            this.username=username;
            this.login=login;
            this.logout=logout;
            this.connectorId = connectorId;
        }
    }]);
})();