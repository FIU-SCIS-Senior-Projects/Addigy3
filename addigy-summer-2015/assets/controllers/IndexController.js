/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('IndexController',['$location',function($location) {
        var self = this;
        self.activeTab=($location.path()==='/dashboard1'||$location.path()==='/')?0:1;
        self.dash2Selected= function(){
            self.activeTab=1;
        };
        self.dash1Selected= function(){
            self.activeTab=0;
        };

    }]);
})();

