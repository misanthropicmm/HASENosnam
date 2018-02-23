define(function (require, exports, module) {

    'use strict';

    /**
     * Shortcut service
     * @ngInject
     * @constructor
     */
    function shortcutService($http, lpWidget, lpCoreUtils) {
        var servicePath = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('runtimeService'));

        return {
            getShortcuts: function () {
                return $http({
                    url: servicePath + '/shortcuts',
                    method: 'GET'
                });

            }
        }
    };

    module.exports = shortcutService;
});