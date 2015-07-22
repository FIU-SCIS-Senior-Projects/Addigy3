/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('IndexController',['$location',function($location) {
        var self = this;
        console.log($location.path());
        self.activeTab=($location.path()==='/dashboard1')?0:1;
        console.log(self.activeTab);
        self.injectSelected= function(){
            self.activeTab=2;
        };
        self.dash2Selected= function(){
            self.activeTab=1;
        };
        self.dash1Selected= function(){
            self.activeTab=0;
        };

    }]);
})();

