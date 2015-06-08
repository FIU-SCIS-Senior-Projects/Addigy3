/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('AllGraphsController',['LoginData', '$timeout',function(LoginData, $timeout) {
        var self = this;
        self.graphToShow='';
        self.toIncludeHtml=[];
        self.includeHtml=[];
        self.loginIncludes=['/assets/pages/loginGraph.html', '/assets/pages/loginDetails.html'];
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
            LoginData.pointSelected.selected=false;
        });
    }]);
})();

