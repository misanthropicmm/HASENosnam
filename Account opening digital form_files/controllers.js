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
    function MainCtrl(lpWidget, $scope, $filter, lpCoreUtils, lpCoreBus, shortcutService, $location,$rootScope, $timeout) {
	    this.scope = $scope;
		this.scope.lpCoreBus =lpCoreBus;
        var vm = this;
		var errorFlag=false;
		
        var servicePath = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('runtimeService'));
        vm.isDesignMode = !!bd.designMode;
		
        // Get available shortcuts
        shortcutService.getShortcuts()
            .then(function (response) {
                vm.shortcuts = response.data.items.length && response.data.items || [];
				
                updateConfiguration();
				
				
            }, function () {
 			   errorFlag=true;
 			   vm.scope.lpCoreBus.publish('errorKey',errorFlag);
            });

        if (vm.isDesignMode) {


            // Add available shortcuts to the preferences
            lpWidget.addEventListener('preferences-form', function (evt) {
                var prefs = evt.detail.customPrefsModel = b$.portal.portalModel.filterPreferences(lpWidget.model.preferences.array);
                var shortcurtsPreference = $filter('filter')(prefs, {name: 'shortcut'}, true)[0];

                shortcurtsPreference.inputType.options = [];

                if (!vm.shortcuts.length) {
                    shortcurtsPreference.inputType.options.push({
                        label: 'No shortcut available',
                        value: ''
                    });
                } else {
                    angular.forEach(vm.shortcuts, function (value) {
                        shortcurtsPreference.inputType.options.push({
                            label: value.name,
                            value: value.name
                        });
                    });
                }
            });

            lpWidget.model.addEventListener('PrefModified', function () {
                updateConfiguration();

                $scope.$apply();
            });
        }

        function updateConfiguration() {

            var shortcut = lpWidget.getPreference('shortcut');

            if (!shortcut) {
                vm.missingPreference = 'shortcut';
                return;
            }

            delete $scope.missingPreference;

            vm.shortcut = vm.shortcuts.filter(function (s) {
                return s.name === shortcut;
            })[0];
            var languages = {'en-us':'en-US', 'zh-hk':'zh-HK', 'zh-cn':'zh-CN'}
            var locale = localStorage.getItem('locale');
            vm.config = {
                runtimePath: servicePath,
                project: vm.shortcut.project,
                flow: vm.shortcut.flow,
                theme: vm.shortcut.theme,
                languageCode: languages[locale],// vm.shortcut.languageCode,
                branch: vm.shortcut.version,
				shortcut: vm.shortcut.name,
				portal: 'digital-forms'
				
            };

            $scope.$broadcast('configUpdated', vm.config);
			$scope.$on('update',function(){
				lpCoreBus.publish('refreshSession');
			});
				
        }

        vm.parameters = {
            noTools: true
        };
		
    }

    module.exports = MainCtrl;
});