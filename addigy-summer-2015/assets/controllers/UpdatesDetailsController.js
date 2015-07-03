/**
 * Created by ayme on 7/1/15.
 */
(function () {
    angular.module('app').controller('UpdatesDetailsController', ['DataRequest', function(DataRequest) {
        var self = this;
        self.updates=[];
        self.policiesLookup={};
        self.policies = {};
        self.policyTree = [];
        function getAvailableUpdates(){
            DataRequest.getAvailableUpdates('Addigy').
                success(function(data, status, headers, config) {
                    //console.log(data);
                    var resultUpdates = data['updates'];
                    for (var update in resultUpdates ){
                        self.updates.push(resultUpdates[update])
                    }
                    self.policies = data['policies']
                    createPoliciesLookup();
                    buildTree();
                }).error(function(data, status, headers, config) {
                     console.log(data);
                });
        };
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
                var parent = curr['parent']
                if(parent !== null) {
                    var policyId = curr['policyId'];
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
            console.log(treeList);
            console.log(self.policyTree);
        }
        function getPolicyRoots(){
            var roots = [];
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
    }]);
})();
