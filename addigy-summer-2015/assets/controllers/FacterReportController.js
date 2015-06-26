/**
 * Created by matthewsaunders on 6/5/15.
 */

(function () {
    angular.module('app').controller('FacterReportController', ['FacterReportService', function(FacterReportService, sce) {
        var self = this;
        self.showFacter = true;
        self.data = FacterReportService.data;
        self.table = FacterReportService.table;

        self.displayFacter = function(){
            FacterReportService.getFacter();
        }


        function parseJson(json){
            jsonStr = '{"';
            output = "<div><table class='table table-condensed'>";

            for(var key in json){
                output += "<tr><td>" + key + "</td><td>";

                if(key == "undefined" || json[key] == "undefined") {
                    console.log(key + ": " +json[key]);
                }
                if( typeof(json[key]) == "object" && json[key] != null ){
                    output += processFacterReport(json[key]);
                    processFacterReport(json[key]);
                }else{
                    output += json[key];
                }
            }
            output += "</td></tr></table></div>";
            return output;
        }

    }]);
})();

function displayTable() {
    document.getElementById("facterTable").innerHTML = "hello world";
}