/**
 * Created by ayme on 7/1/15.
 */
(function () {
    angular.module('app').controller('UpdatesDetailsController', ['DataRequest', function(DataRequest) {
        var self = this;
        self.updates={};
        self.policiesLookup={};
        self.policies = {};
        self.policyTree = [];
        self.machineUpdates = {};
        self.policiesNames={};
        self.machinePolicy={};
        self.policiesUpdates={};

        function getAvailableUpdates(){
            DataRequest.getAvailableUpdates('Addigy').
                success(function(data, status, headers, config) {
                    console.log(data);
                    var resultUpdates = data['updates'];
                    for (var update in resultUpdates ){
                        self.updates[update]=resultUpdates[update];
                    }
                    var machUpdates = data['machinesUpdates'];
                    machUpdates.forEach(function (machine) {
                        self.machineUpdates[machine.policyId]=machine.updates;
                        machine.updates.forEach(function (update){
                            var policyUpdt = self.policiesUpdates[machine.policyId];
                            if(!policyUpdt){
                                policyUpdt = [];
                                policyUpdt.push({"connectorId":machine.connectorId, "update":update});
                                self.policiesUpdates[machine.policyId]=policyUpdt;
                            }else{
                                policyUpdt.push({"connectorId":machine.connectorId, "update":update});
                            }
                        });

                    });
                    self.policies = data['policies']
                    createPoliciesLookup();
                    buildTree();
                }).error(function(data, status, headers, config) {
                     console.log(data);
                });
        }
        getAvailableUpdates();
        String.prototype.hashCode = function() {
          var hash = 0, i, chr, len;
          if (this.length == 0) return hash;
          for (i = 0, len = this.length; i < len; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
          }
          return hash;
        };
        function createPoliciesLookup(){
            var i;
            for(i=0; i< self.policies.length;i++){
                var curr = self.policies[i];
                self.policiesNames[curr.policyId]=curr.policyName;
                var parent = curr.parent;
                if(parent !== null) {
                    var policyId = curr.policyId;
                    var children = self.policiesLookup[parent];
                    if (!children)
                        self.policiesLookup[parent] = [policyId];
                    else
                        children.push(policyId);
                }
            }
        }
        function getDescendants(policyId){
            var children = self.policiesLookup[policyId];
            if(!children)
                return [];
            var allChildren = [].concat(children);
            children.forEach(function(child) {
                allChildren = allChildren.concat(getDescendants(child));
            });
            return allChildren;
        }
        function buildTree(){
            var treeList = [];
            var i;
            var roots = getPolicyRoots();
            for(i=0; i< roots.length;i++){
                var currRoot = roots[i];
                var rootNode = getPolicyTree(currRoot);
                treeList.push(rootNode);
                self.policyTree.push(rootNode);
            }
        }
        function getPolicyRoots(){
            var roots = [];
            var i;
            for(i=0; i< self.policies.length;i++){
                var curr = self.policies[i];
                var parent = curr['parent'];
                if(parent === null)
                    roots.push(curr['policyId']);
            }
            return roots;
        }
        function getPolicyTree(policyId){
            var root = {"policyId": policyId, "parent":null, "children":[]};
            var children = self.policiesLookup[policyId];
            if(children) {
                children.forEach(function (child) {
                    var childNode = getPolicyTree(child);
                    childNode.parent = root;
                    root.children.push(childNode);
                });
            }
            return root;
        }
        function getTotalUpdateCount(policyId, update){
            var totalCount = 0;
            totalCount+=getPolicyUpdateCount(policyId,update);
            var descendants = getDescendants(policyId);
            descendants.forEach(function(desc){
                totalCount += getPolicyUpdateCount(desc, update)
            });
            return totalCount;
        }
        function getPolicyUpdateCount(policyId, update){
            var updates = self.machineUpdates[policyId];
            if(!updates)
                return 0;
            if (updates.indexOf(update)!=-1)
                return 1;
            return 0;
        }
        self.policyHasUpdates = function(update){
            return function(item){
              return getTotalUpdateCount(item.policyId, update)>0;
            }
        };
        self.getPolicyTotalCount= function(policyId, update){
            return getTotalUpdateCount(policyId, update);
        };
        self.policyHasChildren=function(policyId){
            var children = self.policiesLookup[policyId];
            if(!children) return false;
            return children.length>0;
        };
        self.getConnectorId=function(policyId,update){
            var policyUpdts = self.policiesUpdates[policyId];
            if(!policyUpdts) return "connectorId not available";
            var i;
            for (i=0;i<policyUpdts.length;i++){
                var currUpdt = policyUpdts[i];
                if(currUpdt.update===update)
                    return currUpdt.connectorId;

            }
            return "connectorId not available";
        };
    }]);
})();
