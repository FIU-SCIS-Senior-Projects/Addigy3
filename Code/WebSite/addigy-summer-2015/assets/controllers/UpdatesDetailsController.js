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
        self.allUpdates = [];

        self.daysLabels={};
        self.visitsPerDayPerDomain={};
        self.labels=[];
        self.series=[];
        self.graphData=[];

        self.lineChartColors = [
            {"fillColor": "rgba(60,141,188,0.2) ","strokeColor": "rgba(60,141,188,1) ","pointColor": "rgba(60,141,188,1) ", "pointHighlightStroke":"rgba(60,141,188,1) "},
            {"fillColor": "rgba(141,188,60,0.2) ","strokeColor": "rgba(141,188,60,1) ","pointColor": "rgba(141,188,60,1) ", "pointHighlightStroke":"rgba(141,188,60,1) "},
            {"fillColor": "rgba(60,188,187,0.2) ","strokeColor": "rgba(60,188,187,1) ","pointColor": "rgba(60,188,187,1) ", "pointHighlightStroke":"rgba(60,188,187,1) "},
            {"fillColor": "rgba(188,60,141,0.2) ","strokeColor": "rgba(188,60,141,1) ","pointColor": "rgba(188,60,141,1) ", "pointHighlightStroke":"rgba(188,60,141,1) "},
            {"fillColor": "rgba(188,107,60,0.2) ","strokeColor": "rgba(188,107,60,1) ","pointColor": "rgba(188,107,60,1) ", "pointHighlightStroke":"rgba(188,107,60,1) "},
            {"fillColor": "rgba(188,60,77,0.2)  ","strokeColor": "rgba(188,60,77,1)  ","pointColor": "rgba(188,60,77,1)  ", "pointHighlightStroke":"rgba(188,60,77,1)  "},
            {"fillColor": "rgba(60,188,171,0.2) ","strokeColor": "rgba(60,188,171,1) ","pointColor": "rgba(60,188,171,1) ", "pointHighlightStroke":"rgba(60,188,171,1) "}
        ];

        function getAvailableUpdates(){
            var startDate = getStartDate();
            var endDate = getEndDate();
            DataRequest.getAvailableUpdates('Addigy', startDate, endDate).
                success(function(data, status, headers, config) {
                    console.log(data);
                    var resultUpdates = data['updates'];
                    for (var update in resultUpdates ){
                        self.updates[update]=resultUpdates[update];
                        self.allUpdates.push(resultUpdates[update].updateName);
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
                    populateGraphLabels();
                    processUpdatesActivity(data['updatesActivity'])
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
            console.log(self.policyTree);
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
        self.getDevices=function(policyId,update){
            var devices = [];
            var policyUpdts = self.policiesUpdates[policyId];
            if(!policyUpdts) return devices;
            var i;
            for (i=0;i<policyUpdts.length;i++){
                var currUpdt = policyUpdts[i];
                if(currUpdt.update===update)
                    devices.push(currUpdt.connectorId);
            }
            console.log(devices);
            return devices;
        };
        self.hasDevices=function(policyId,update){
            var devices = self.getDevices(policyId,update);
            return devices.length>0;
        }

        function getEndDate(){
            var today=new Date();
            today.setHours(23,59,0,0);
            return today.getTime();
        }
        function getStartDate(){
            var today=new Date();
            var oneMonthAgo=new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            today.setHours(23,59,0,0);
            oneMonthAgo.setHours(0,0,0,0);
            return oneMonthAgo.getTime();
        }


        Date.prototype.addDays = function(days) {
            var dat = new Date(this.valueOf())
            dat.setDate(dat.getDate() + days);
            return dat;
        };
        function populateGraphLabels(){
            var i=0;
            var start = new Date(getStartDate());
            var end = new Date(getEndDate());
            self.daysLabels={};
            while(start <= end){
                self.daysLabels[i]= start.toDateString();
                start = start.addDays(1);
                i++;
            }
        }
        function populateGraphData(){
            self.series.splice(0,self.series.length);
            self.labels.splice(0,self.labels.length);
            self.graphData.splice(0,self.graphData.length);
            var domains=Object.keys(self.visitsPerDayPerDomain);
            var i,j;
            for(var key in self.daysLabels) self.labels.push(self.daysLabels[key]);
            for(i=0;i<domains.length;i++){
                var domainName=domains[i];
                if(domainName.indexOf('OS')!==-1) continue;
                self.series.push(domainName);
                var domainGraphData=[];
                var domainData=self.visitsPerDayPerDomain[domainName];
                for(j=0;j<self.labels.length;j++){
                    var visitCount=domainData[self.labels[j]];
                    if(visitCount==null) domainGraphData.push(0);
                    else domainGraphData.push(visitCount.value);
                }
                self.graphData.push(domainGraphData);
            }
        }
        function processUpdatesActivity(updatesActivity){
            self.visitsPerDayPerDomain={};
            for (var update in updatesActivity) {
                var visitsPerDomain={};
                var visits=updatesActivity[update];
                 for(j=0;j<visits.length;j++){
                    var visitDate=new Date(visits[j]);
                    var visitDateStr=visitDate.toDateString();
                    visitsPerDomain[visitDateStr] ? visitsPerDomain[visitDateStr].value += 1 :
                        visitsPerDomain[visitDateStr] = {value: 1};
                }
                self.visitsPerDayPerDomain[update]=visitsPerDomain;
                populateGraphData();
            }
        }
    }]);
})();
