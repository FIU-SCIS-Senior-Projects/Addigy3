/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('DashboardsController',['LoginDataService', '$timeout',function(LoginDataService, $timeout) {
        var self = this;
        self.graphToShow='';
        self.toIncludeHtml=[];
        self.includeHtml=[];
        self.loginIncludes=['/assets/pages/loginGraph.html','/assets/pages/loginDetails.html'];
        self.facterIncludes=['/assets/pages/facterReport.html'];
        self.memoryIncludes=['/assets/pages/freeMemory.html'];
        self.modalTitle='';
        self.domainsIncludes=['/assets/pages/browsingHistory.html','/assets/pages/searchDomains.html'];
        self.updatesIncludes=['/assets/pages/updatesDetails.html'];
        self.timelineIncludes=['/assets/pages/timeline.html'];
        self.cpuMemUtilizationIncludes = ['/assets/pages/volatileData.html'];
        self.socketUsageIncludes = ['/assets/pages/socketGraph.html', '/assets/pages/socketDetails.html'];
        self.expandLogin=function(){
            self.toIncludeHtml=self.loginIncludes;
            self.modalTitle='Login History';
        };
        self.expandDomains=function(){
            self.toIncludeHtml=self.domainsIncludes;
            self.modalTitle='Software Metering';
        };
        self.expandUpdates=function(){
            self.toIncludeHtml=self.updatesIncludes;
            self.modalTitle='Software Updates';
        };
        self.expandMemory=function(){
            self.toIncludeHtml=self.memoryIncludes;
            self.modalTitle='Available Memory';
        };
        self.expandTimeline=function(){
            self.toIncludeHtml=self.timelineIncludes;
            self.modalTitle='Event Timeline';
        };
        self.expandCpuMemUtilization=function(){
            self.toIncludeHtml=self.cpuMemUtilizationIncludes;
            self.modalTitle='CPU and Memory Utilization';
        };
        self.expandSocketInfo=function(){
            self.toIncludeHtml=self.socketUsageIncludes;
            self.modalTitle='Socket Usage';
        };
        $('#graphModal').on('shown.bs.modal', function (e) {
            $timeout(function() {
                self.includeHtml.splice(0,self.includeHtml.length);
                var i;
                for(i=0; i< self.toIncludeHtml.length;i++)
                    self.includeHtml.push(self.toIncludeHtml[i]);
            });
        });
        $('#graphModal').on('hidden.bs.modal', function (e) {
            LoginDataService.pointSelected.selected=false;
        });

        self.expandFacter=function(){
            self.toIncludeHtml=self.facterIncludes;
            self.modalTitle='Facter Report';
        };
     


    }]);
})();

