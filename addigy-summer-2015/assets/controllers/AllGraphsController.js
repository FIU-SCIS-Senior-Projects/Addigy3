/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('AllGraphsController',['LoginDataService', '$timeout',function(LoginDataService, $timeout) {
        var self = this;
        self.graphToShow='';
        self.toIncludeHtml=[];
        self.includeHtml=[];
        self.loginIncludes=['/assets/pages/loginGraph.html', '/assets/pages/loginDetails.html'];
        self.facterIncludes=['/assets/pages/facterReport.html'];
        self.modalTitle='';

        self.expandLogin=function(){
            self.toIncludeHtml=self.loginIncludes
            self.modalTitle='Login History';
        };
        $('#graphModal').on('shown.bs.modal', function (e) {
            $timeout(function() {
                self.includeHtml.splice(0,self.includeHtml.length)
                var i;
                for(i=0; i< self.loginIncludes.length;i++)
                    self.includeHtml.push(self.loginIncludes[i]);
            });
        });
        $('#graphModal').on('hidden.bs.modal', function (e) {
            LoginDataService.pointSelected.selected=false;
        });

        self.expandFacter=function(){
            self.toIncludeHtml=self.facterIncludes;
            self.modalTitle='Facter Report';
        };
        $('#facterModal').on('shown.bs.modal', function (e) {
            $timeout(function() {
                self.includeHtml.splice(0,self.includeHtml.length)
                var i;
                for(i=0; i< self.facterIncludes.length;i++)
                    self.includeHtml.push(self.facterIncludes[i]);
            });
        });
        $('#facterModal').on('hidden.bs.modal', function (e) {

        });


    }]);
})();

