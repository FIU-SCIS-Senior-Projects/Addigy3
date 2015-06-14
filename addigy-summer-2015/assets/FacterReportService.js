/**
 * Created by matthewsaunders on 6/11/15.
 */
(function () {
    angular.module('app').service('FacterReportService',['DataRequest', function(DataRequest) {
        var self = this;
        self.data = null;
        self.table = "";

        self.getFacter = function(){
             console.log("in getFacter");
             DataRequest.getFacter().
                 success(function(data, status, headers, config) {
                     self.data=data["facterReport"];
                     processFacterReport(self.data);
                     console.log("getfacter");
                 }).error(function(data, status, headers, config) {
                     console.log(data);
                 });
        }

        function processFacterReport(json){
            console.log("in processFacterReport");
            jsonStr = '{"';
            self.table += "<div><table class='table table-condensed'>";

            for(var key in json){
                self.table += "<tr><td>" + key + "</td><td>";

                if(key == "undefined" || json[key] == "undefined") {
                    console.log(key + ": " +json[key]);
                }
                if( typeof(json[key]) == "object" && json[key] != null ){
                    self.table += processFacterReport(json[key]);
                    processFacterReport(json[key]);
                }else{
                    self.table += json[key];
                }
            }
            self.table += "</td></tr></table></div>";
        }

    }]);
})();