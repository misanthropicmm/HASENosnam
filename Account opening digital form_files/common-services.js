/**
 * Common Services
 * @module commonServices
 */
define(function(require, exports, module) {
    'use strict';
    /**
     * @ngdoc service // Mark the object as a service
     * @name angular.module.service:CommonServices // Provide the module and the service name
     * @ngInject
     * @constructor
     * @requires $http // provides $http service dependency
     * @requires $q // provides $q service dependency
     * @description service for Consuming a RESTful Web Service with 'getcall' method for http get request
     * @returns {object} Object containing various service methods such as getCall,  etc
     **/
    function CommonServices(lpCoreUtils, lpWidget) {
        function localeFormat() {
            var locale = localStorage.getItem('locale');
            var localeTemp = '';
            if(locale){
                localeTemp = locale.split('-')[0] +'_'+locale.split('-')[1].toUpperCase();
            }
            return localeTemp;
        }
        /**
         * @ngdoc method
         * @name generateURL
         * @methodOf angular.module.service:CommonServices
         * @description This method gives the valid URL in order to redirect
         * form existing GBB to B2G which contains valid information of locale also for redirecting purpose
         * @param {string} relativeURL is a string which contains the actual URL to which we need to append the locale information
         * @param {string} setLocale is the current locale value for GBB
         * @returns {string} Valid formatted string of newly generated URL which is all set for redirecting to B2G with valid locale information
         **/
        function generateUrl(hostPreferenceName, linkPreferenceName) {
            var b2gLocale = localeFormat();
            b2gLocale = (!b2gLocale) ?'en_US' : b2gLocale;
            var hostPreferenceValue = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference(hostPreferenceName));
            var linkPreferenceValue = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference(linkPreferenceName));
            var linkValue = '';
            if( hostPreferenceName === 'businessWebsiteHost') {
                var languageOptions = {
                    'en_US' : 'en-gb',
                    'zh_CN' : 'zh-cn',
                    'zh_HK' : 'zh-hk'
                };
                linkValue = hostPreferenceValue + '/' + languageOptions[b2gLocale] + linkPreferenceValue;
            } else {
                var languageOptions = {
                    'en_US' : '',
                    'zh_CN' : '_cn',
                    'zh_HK' : '_zh'
                };
                linkValue = hostPreferenceValue + linkPreferenceValue;
                linkValue = linkValue.replace('/1/2/commercial/', '/1/2/commercial' + languageOptions[b2gLocale] + '/');

            }
            return linkValue;
        }
        return {
            'localeFormat':localeFormat,
            'generateUrl': generateUrl
        };
    }
    /**
     * Export Models
     */
    module.exports = CommonServices;
});