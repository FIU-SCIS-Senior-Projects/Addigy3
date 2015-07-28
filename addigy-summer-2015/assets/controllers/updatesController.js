/**
 * Created by ayme on 6/26/15.
 */
'use strict';

/* Controllers */
(function () {
    google.load("visualization", "1", {packages:["gauge"]});
    google.setOnLoadCallback(function () {
        angular.bootstrap(document.body, ['app']);
    });
    angular.module('app').controller('UpdatesController', ['DataRequest', function(DataRequest) {
        var self = this;
        self.dataTable = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['Updates', 0],
          ['Devices', 0],
        ]);
        var options = {
          width: 800, height: 240,
          minorTicks: 5
        };
        function getUpdatesConnectorsCount(){
            DataRequest.getUpdatesConnectorsCount().
                success(function(data, status, headers, config) {
                    //console.log(data);
                    var uCount = data['updatesCount'];
                    var connCount = data['connectorsCount']
                    self.dataTable.setValue(0, 1,uCount);
                    self.dataTable.setValue(1, 1,connCount);
                    self.chart.draw(self.dataTable, options);
                }).error(function(data, status, headers, config) {
                     console.log(data);
                });
        };
        self.chart = new google.visualization.Gauge(document.getElementById('chartdiv'));
        getUpdatesConnectorsCount();
    }]);
})();
