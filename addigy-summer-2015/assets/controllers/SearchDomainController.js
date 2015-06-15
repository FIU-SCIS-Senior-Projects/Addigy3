/**
 * Created by ayme on 6/15/15.
 */
/**
 * Created by ayme on 5/27/15.
 */
(function () {
    angular.module('app').controller('SearchDomainController', ['DataRequest', function(DataRequest) {
        var self = this;
        self.allDomains=[];
        function getAllDomains(){
            DataRequest.getAllDomains().
                success(function(data, status, headers, config) {
                    self.allDomains=data['allDomains'];
                }).error(function(data, status, headers, config) {
                     console.log(data);
                });
        };
        getAllDomains();
        $.fn.select2.defaults = $.extend($.fn.select2.defaults, {
            allowClear: true, // Adds X image to clear select
            closeOnSelect: true, // Only applies to multiple selects. Closes the select upon selection.
            placeholder: 'Select...',
            minimumResultsForSearch: 15 // Removes search when there are 15 or fewer options
        });
        $(document).ready(
            function () {
                var configParamsObj = {
                placeholder: 'Select a domain...', // Place holder text to place in the select
                minimumResultsForSearch: 3 // Overrides default of 15 set above
            };
            $("#singleSelectExample").select2(configParamsObj).on("select2:select", function (e) {
                console.log("select2:select", e); });
        });

    }]);
})();
