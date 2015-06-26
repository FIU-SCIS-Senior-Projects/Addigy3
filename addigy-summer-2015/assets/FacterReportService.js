/**
 * Created by matthewsaunders on 6/11/15.
 */
(function () {
    angular.module('app').service('FacterReportService',['DataRequest', function(DataRequest) {
        var self = this;
        self.data = [];
        self.table = "";

        self.getFacter = function(){
            DataRequest.getFacter().
                 success(function(data, status, headers, config) {
                     self.data.push(data["facterReport"]);
                     //self.table = processFacterReport(self.data[0]);
                    console.log(self.data[0]);
                 }).error(function(data, status, headers, config) {
                     console.log(data);
                 });
        }

        function processFacterReport(json){
            self.table = parseJson(json);
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

        self.getFreeMemory = function(){

        }

    }]);
})();
