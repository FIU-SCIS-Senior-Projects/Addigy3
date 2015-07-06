/**
 * Created by matthewsaunders on 6/27/15.
 */
(function () {
    angular.module('app').controller('TenantsController', ['DataRequest', 'TenantsService', function(DataRequest, TenantsService) {
        var self = this;
        self.tenants = TenantsService.tenants;

        self.getTenants = TenantsService.getTenants;

        self.orgId = TenantsService.orgId;
        self.selectedTenant = TenantsService.selectedTenant;

        self.alertCallbacks = TenantsService.alertCallbacks;
    }]);
})();