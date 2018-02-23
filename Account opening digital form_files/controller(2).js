/**
 * Controllers
 * @module controllers
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * Main controller
     * @ngInject
     * @constructor
     */
    function FooterCtrl($scope, lpPortal, lpWidget, lpCoreUtils,commonServices) {
		var locale = localStorage.getItem('locale');
            var localeTemp = '';
            if(locale){
                localeTemp = locale.split('-')[0] +'_'+locale.split('-')[1].toUpperCase();
            }
        this.cookielocale=localeTemp;
        $scope.navigationLinks =[
            {
                linkTitle:'LABEL_LINK_MESSAGEANDSTATEMENT',
                linkUrl: commonServices.generateUrl('messageStatementHost', 'messageStatement'),
                order:0    
            }
        ];

        this.popupLink = function (link) {
            var width = 730;
            var height = 500;
            var popup_x  = (screen.width  - width) / 2;
            var popup_y  = (screen.height - height) / 2;
            window.open(link,'importantPages','width='+width+',height='+height+',resizable=yes,menubar=no,toolbar=no,directories=no,location=no,scrollbars=yes,status=no,left='+popup_x+',top='+popup_y);
        };

       /* this.currentYear = (new Date().getFullYear());*/
    }

    module.exports = FooterCtrl;
});
