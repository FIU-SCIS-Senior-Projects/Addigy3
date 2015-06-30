/**
 * Created by ayme on 6/26/15.
 */
'use strict';

/* Controllers */
(function () {
    google.load("visualization", "1", {packages:["timeline"]});
    google.setOnLoadCallback(function () {
        angular.bootstrap(document.body, ['app']);
    });
    angular.module('app').controller('LoginsPerMachineController', ['LoginDataService', function(LoginDataService) {
        var self = this;
        var options = {
            colors: ['#3c8dbc', '#3cbc6b', '#bc3c8d', '#bc6b3c', '#bc3c4d', '#8dbc3c', '#3cbcab'],
          };
        var chart = new google.visualization.Timeline(document.getElementById('chartdiv'));
        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({ type: 'string', id: 'User' });
        dataTable.addColumn({ type: 'date', id: 'Start' });
        dataTable.addColumn({ type: 'date', id: 'End' });
        dataTable.addRows([
          [ 'Washington', new Date(1789, 3, 29), new Date(1797, 2, 3) ],
            [ 'Washington', new Date(1780, 3, 29), new Date(1785, 2, 3) ],
          [ 'Adams',      new Date(1797, 2, 3),  new Date(1801, 2, 3) ],
          [ 'Jefferson',  new Date(1801, 2, 3),  new Date(1809, 2, 3) ]]);

        chart.draw(dataTable, options);
         $(document).ready(
            function () {
                $("#connectorIdSelect").select2().on("select2:select", function (e) {

                });
            }
        );
    }]);
})();
