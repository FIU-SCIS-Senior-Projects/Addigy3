/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('AllGraphsController',['LoginData', '$timeout',function(LoginData, $timeout) {
        var self = this;
        self.graphToShow='';
        $('#graphModal').on('shown.bs.modal', function (e) {
            $timeout(function() {
                self.graphToShow='/assets/pages/loginGraph.html';
            });
        });
        $('#graphModal').on('hidden.bs.modal', function (e) {
            LoginData.pointSelected.selected=false;
        })
    }]);
})();

