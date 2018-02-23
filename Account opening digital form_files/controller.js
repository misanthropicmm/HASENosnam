/**
 * Controllers
 * @module controllers
 */
define(function (require, exports, module) {

    'use strict';
    
    var CONSTANT_COOKIES_PATH = '/portalserver';
    var CONSTANT_COOKIES_EXPIRES = '4 * 7 * 24 * 60 * 60';
	var sessionModalClosed = true;
	var firstTimeOut, secondTimeout;
	var refreshTimerFlag = false;

    /**
     * Main controller
     * @ngInject
     * @constructor
     */
    function TopbarController($scope, lpPortal, lpWidget, lpCoreUtils, $window, $http, lpCoreBus, $uibModal, $rootScope) {
        var thisCtrl = this;
        var b2gLocale = this.localeFormat(localStorage.getItem('locale'));
		$rootScope.idleModalAliveTime = lpWidget.getPreference("idleModalAliveTime") * 60 * 1000;	// 5 mins
		$rootScope.threshlodTime = lpWidget.getPreference("threshlodTime") * 60 * 1000; // 20 mins is sessionTimeoutInterval
        thisCtrl.isLoggedIn = false;
        thisCtrl.toggleLeftMenu = function(){
            window.toggleLeftMenu();
        }

      function popupLink(){
            var link='http://www.business.hsbc.com.hk/en-gb';
            var headerMiddle = '';
            b2gLocale=='en_US'? headerMiddle='en-gb': b2gLocale=='zh_HK'? headerMiddle='zh-hk':headerMiddle='zh-cn';
            link=link.replace('en-gb',headerMiddle);
            var width = 730;
            var height = 500;
            var popup_x  = (screen.width  - width) / 2;
            var popup_y  = (screen.height - height) / 2;
            window.open(link,'importantPages','width='+width+',height='+height+',resizable=yes,menubar=no,toolbar=no,directories=no,location=no,scrollbars=yes,status=no,left='+popup_x+',top='+popup_y);
            $scope.currentSelectedIndex = newIndex;
        }
        $scope.popupLink = popupLink;

        function isShowDivider(item) {
            if(item.id === '1'){
                thisCtrl.languages[1].isShowDivider = true;
            } else if(item.id === '3') {
                thisCtrl.languages[0].isShowDivider = true;
            }
        }

        function findLanguageByLocale(locale) {
            for (var lang in thisCtrl.languages) {
                if (thisCtrl.languages[lang].locale == locale ) {
                    return thisCtrl.languages[lang];
                }
            }
            return thisCtrl.languages[0];
        }

        function getSelectedLocale() {
            var locale = 'en-us';
            var index = thisCtrl.localeIndexInPath();
            if ( index > -1 ) {
                //url end with //
                var path = document.location.pathname;
                locale = path.substring(index+2,path.length);
            } else {
                var idxObj = this.localeIndexInPathBySection();
                if( idxObj.pos > -1 ){
                    //url with section header
                    locale = idxObj.lang;
                }
            }
            return locale;
        }

        function localeIndexInPathBySection() {
            var obj = {pos:-1, lang:'en-us'};
            var pathname = document.location.pathname;
            if ( pathname == undefined ) {
                return obj;
            }

            var localeIndexOfPath = -1;
            for (var la in thisCtrl.languages) {
                var locale = thisCtrl.languages[la].locale;
                localeIndexOfPath = pathname.indexOf(locale);
                if ( localeIndexOfPath > -1 ) {
                    obj = {pos:localeIndexOfPath, lang:locale};
                    return obj;
                }
            }

            return obj ;
        }

        function localeIndexInPath() {
            var pathname = document.location.pathname;
            if ( pathname == undefined ) {
                return -1;
            }
            var localeIndexOfPath = pathname.lastIndexOf('//');
            return localeIndexOfPath ;
        }

        function switchLang(item, fromInit) {
            var locale = item.locale;
            var oldLocal = localStorage.getItem('locale');
            var url = $window.location.href;
            var newUrl = url.replace(oldLocal, locale);
			
            
			var formSession = window.sessionStorage.getItem('FORMS-SESSION');
			
            var subscribeUrl = window.location.origin + b$.portal.config.serverRoot+'/services/forms/server/language/'+formSession+'/'+locale;

            try {
                if(formSession !== null) {
                    $http.post(subscribeUrl).then(function successCallback(responsePayLoad, status, header, config) {
                        if(!fromInit) {
                            $window.location.href = newUrl;
                        }
                    }, function errorCallback(errorPayLoad, status, header, config) {
                        throw new Error('Invalid form session');
                    });
                } else {
                    $window.location.href = newUrl;
                }
            } catch(err) {
                $window.location.href = newUrl;
            }
        };

        thisCtrl.switchLang = switchLang;
        thisCtrl.localeIndexInPathBySection = localeIndexInPathBySection;
        thisCtrl.localeIndexInPath = localeIndexInPath;
        thisCtrl.getSelectedLocale = getSelectedLocale;
        thisCtrl.getSelectedLocale = getSelectedLocale
        thisCtrl.findLanguageByLocale = findLanguageByLocale;
        thisCtrl.isShowDivider = isShowDivider;

        thisCtrl.languages =[
            {label: 'English', id: '1', locale:'en-us', cookieLocal: 'en_US', logoImage: 'hsbc-logo-en-us', tagging_data: 'landing_topBar_langEN', isShowDivider: false},
            {label: '繁體', id: '3', locale:'zh-hk', cookieLocal: 'zh_HK', logoImage: 'hsbc-logo-zh-hk', tagging_data: 'landing_topBar_langSC', isShowDivider: false},
            {label: '简体', id: '2', locale:'zh-cn', cookieLocal: 'zh_CN', logoImage: 'hsbc-logo-zh-cn', tagging_data: 'landing_topBar_langTC', isShowDivider: false}
        ];

        var preLocale = thisCtrl.getSelectedLocale();
        thisCtrl.selectedLanguage = thisCtrl.findLanguageByLocale(preLocale);
        thisCtrl.isShowDivider(thisCtrl.selectedLanguage);
        localStorage.setItem('locale', thisCtrl.selectedLanguage.locale);
        $.cookie('currentLocale', thisCtrl.selectedLanguage.cookieLocal, {expires: CONSTANT_COOKIES_EXPIRES, path: CONSTANT_COOKIES_PATH});
        //switchLang(thisCtrl.selectedLanguage, true);	
		
        // Session Handler
		function sessionTimer(){
			if(sessionModalClosed){
				lpCoreBus.publish('logout', 'Session timeout.');
				sessionModalClosed = false;
				if(!sessionModalClosed){
					secondTimeout = window.setTimeout(function(){
						$window.sessionStorage.clear();
						$window.location.reload();
					},$rootScope.idleModalAliveTime);
				}
			}
		};
		lpCoreBus.subscribe('refreshSession',function(){
			if(refreshTimerFlag) {
				window.clearTimeout(firstTimeOut);
				window.clearTimeout(secondTimeout);
				firstTimeOut = window.setTimeout(sessionTimer,$rootScope.threshlodTime);
			} else {
				refreshTimerFlag = true;
				firstTimeOut = window.setTimeout(sessionTimer,$rootScope.threshlodTime);
			}
		});
		
        this.currentLanguage=b2gLocale;
        lpCoreBus.subscribe('logout', function() {
            if (!$rootScope.expiredModal || ($rootScope.expiredModal.ctrl && $rootScope.expiredModal.ctrl.closed)) {
                var templateUrl = lpCoreUtils.getWidgetBaseUrl(lpWidget) + '/templates/session-expired-template.html?ver=1.0';
                $rootScope.expiredModal =  $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    ariaLabelledBy: 'modal-title-bottom',
                    ariaDescribedBy: 'modal-body-bottom',
                    templateUrl: templateUrl,
                    controller: function($uibModalInstance, $scope,$window) {
                        this.iconType = 'error';
                        this.scope = $scope;
                        this.closed = false;
                        this.reloadPage = function(){
                            $window.sessionStorage.clear();
                            $window.location.reload();
                        };
						this.redirectPage = function(){
                            $window.sessionStorage.clear();
							$window.location.reload();
                        };
                        $uibModalInstance.ctrl = this;
                    },
                    controllerAs: 'warningModalCtrl'
                });
            } else {
                $rootScope.expiredModal.ctrl.scope.$apply();
            }
        });

        $scope.activeNls = false;
        $scope.activeNlsClick = function () {
            if(!$scope.activeNls){
                $scope.activeNls = true;
            }else{
                $scope.activeNls = false;
            }
        };
    }
    
    TopbarController.prototype.localeFormat = function (locale) {
        var localeTemp = '';
        if(locale){
            localeTemp = locale.split('-')[0] +'_'+locale.split('-')[1].toUpperCase();
        }
        return localeTemp;
    }

    module.exports = TopbarController;
});
