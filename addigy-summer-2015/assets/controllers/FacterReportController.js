/**
 * Created by matthewsaunders on 6/5/15.
 */

(function () {
    angular.module('app').controller('FacterReportController', ['FacterReportService', function(FacterReportService, sce) {
        var self = this;
        console.log("in controller facter");
        self.showFacter = false;
        FacterReportService.getFacter();
        self.table = FacterReportService.table;

        self.displayTable = function(){
            console.log("in displayTable");
            self.showFacter=true;
            self.table = FacterReportService.table;
            console.log(self.table);
            console.log("done in displayTable");
            console.log(self.table);
        }
    }]);
})();