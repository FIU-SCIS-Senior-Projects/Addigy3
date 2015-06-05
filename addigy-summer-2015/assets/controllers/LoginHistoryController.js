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

        populateTimesArray();
        getHistory();
        function getHistory(){
            DataRequest.getHistory().
                success(function(data, status, headers, config) {
                    self.activities=data['loginHistory'];
                    processLoginData();
                }).error(function(data, status, headers, config) {
                     console.log(data);
                });
        };
        self.getHistoryFromChooser = function(date){
            DataRequest.getHistory().
                success(function(data, status, headers, config) {
                    self.activities=data['loginHistory'];
                    processLoginData();
                }).error(function(data, status, headers, config) {
                     console.log(data);
                });
        }
        self.onPointClick = function (points, evt) {
            var hour=points[0].label;
            self.usersAtHour=self.usersPerHour[hour];
            self.showHourDetail=true;
        };

        function populateTimesArray() {
            var i;
            for(i=1;i<24;i++){
                self.usersPerHour[i]=[]
            }
        };
        function processLoginData(){
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
        //function generateGraph(data){
        //    var line = new Morris.Line({
        //        element: 'line-chart',
        //        resize: true,
        //        parseTime: false,
        //        data: data,
        //        xkey: 'hour',
        //        ykeys: ['value'],
        //        labels: ['Users'],
        //        lineColors: ['#3C8DBC'],
        //        lineWidth: 2,
        //        hideHover: 'auto',
        //        gridTextColor: "#000000",
        //        gridStrokeWidth: 0.4,
        //        pointSize: 4,
        //        pointStrokeColors: ["#efefef"],
        //        gridLineColor: "#efefef",
        //        gridTextFamily: "Open Sans",
        //        gridTextSize: 10
        //    }).on('click', function(i, row){
        //            var d = new Date();
        //            var n = d.getHours();
        //            console.log(n);
        //            console.log(i, row);
        //        });
        //}
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

        self.today = function() {
            self.dt = new Date();
        };
        self.today();
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

        var tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          var afterTomorrow = new Date();
          afterTomorrow.setDate(tomorrow.getDate() + 2);
          self.events =
            [
              {
                date: tomorrow,
                status: 'full'
              },
              {
                date: afterTomorrow,
                status: 'partially'
              }
            ];

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