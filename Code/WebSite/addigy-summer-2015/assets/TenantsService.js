/**
 * Created by matthewsaunders on 6/27/15.
 */
(function () {
    angular.module('app').service('TenantsService',['DataRequest', function(DataRequest) {
        var self = this;
        self.tenants = [];
        self.orgId = {
            org: null
        };
        self.activity = {};
        self.selectedTenant = {
            tenant: null
        };
        self.callbacks = [];

        self.getTenants = function(Id){
            self.orgId.org = Id;
            DataRequest.getTenants(self.orgId.org).
                 success(function(data, status, headers, config) {
                     self.activity=data['Tenants'];
                     processTenants();
                 }).error(function(data, status, headers, config) {
                     console.log(data);
                 });

        }

        function processTenants(){
            for(i=0; i<self.activity.length; i++){
                self.tenants.push(self.activity[i]);
            }
            self.selectedTenant.tenant = self.tenants[0];
            self.alertCallbacks();
        }

        self.registerCallback = function(fun){
            self.callbacks.push(fun);
        };

        self.alertCallbacks = function(){
            for(i=0; i<self.callbacks.length; i++){
                self.callbacks[i]();
            }
        }

    }]);
})();