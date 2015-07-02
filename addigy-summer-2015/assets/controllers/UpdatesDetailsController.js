/**
 * Created by ayme on 7/1/15.
 */
(function () {
    angular.module('app').controller('UpdatesDetailsController', ['DataRequest', function(DataRequest) {
        var self = this;
        self.updates=[];
        self.updatesId={};

        function guid() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }
        function getAvailableUpdates(){
            DataRequest.getAvailableUpdates('Addigy').
                success(function(data, status, headers, config) {
                    console.log(data);
                    var resultUpdates = data['updates'];
                    for (var update in resultUpdates ){
                        self.updates.push(resultUpdates[update])
                    }
                    console.log(self.updates);
                    //var i;
                    //for(i=0;i<data.length;i++) {
                    //    var curr = data[i];
                    //    self.updatesCount.push(curr);
                    //    self.updatesId[curr]=guid();
                    //}
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
    }]);
})();
