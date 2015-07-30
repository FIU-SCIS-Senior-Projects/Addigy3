/**
 * Created by matthewsaunders on 7/18/15.
 */
/**
 * Created by matthewsaunders on 6/5/15.
 */

(function () {
    angular.module('app').controller('InjectFacterController', ['FacterReportService','$http', function(FacterReportService, $http) {
        var self = this;
        self.showFacter = true;
        self.data = {
            report: null,
            org: 'Addigy',
            connector: '1111',
            server: 'wda-dev.cis.fiu.edu'
        }
        self.table = FacterReportService.table;

        self.initialFacter = function(){
            FacterReportService.getFacter();
            self.data.report = JSON.stringify(FacterReportService.data);
        }

        self.injectData = function(){
            console.log(self.data.report);
            $http.post('http://'+self.data.server+'/resource/storeCollectedData/', {orgId: self.data.org,
                connectorId:self.data.connector, facterReport: JSON.parse(self.data.report)}).
              success(function(data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                    console.log("woohoo!!");
              }).
              error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                    console.log("boo :(");
              });
        }


    }]);
})();
