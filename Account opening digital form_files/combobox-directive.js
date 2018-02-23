define(function(require, exports, module) {

    'use strict';


    // @ngInject
    exports.hsbcCombobox = function(lpCoreBus, lpCoreUtils, lpCoreI18n, lpUIUtils, lpCoreI18nUtils) {

        function templateFn() {
            return '<div class="combobox-label"><label id="cb1-label" for="cb1-edit" lp-i18n="{{title}}"></label></div>'+
                    '<div class="hsbc-combobox">' +
                        '<div class="input-icon" tabindex="0" ng-mousedown="showSelectedOption($event)" ng-keydown="keydownHandler($event,item)" ng-blur="blurHandler($event)">' +
                            '<input id="cb1-edit" class="hsbc-listbox dropdown-input" role="combobox" aria-expanded={{showDropdown}} aria-autocomplete="list" aria-owns="owned_listbox" aria-activedescendant="selected_option" readonly value="{{selectOptionValue}}" ng-blur="blurHandler($event)"/>'+
                            '<div class="icon icon-combobox" ng-class="{&#39;icon-chevron-down&#39;:!showDropdown,&#39;icon-chevron-up&#39;:showDropdown}"></div>'+
                        '</div>'+
                        '<ul role="listbox" aria-hidden="{{showDropdown}}" id="owned_listbox" class="dropdown-container owned_listbox" ng-show="showDropdown">'+
                            '<li class="option selected_option" aria-hidden="{{showDropdown}}" role="presentation" id="selected_option" tabindex="0" ng-blur="blurHandler($event)" ng-mousedown="showSelectedOption($event,item)" ng-keydown="keydownHandler($event,item)" ng-repeat="item in options" ng-init="liInit(item)"><a role="menuitem" tabindex="-1" href="#" lp-i18n="{{item.label}}"></a></li>'+
                        '</ul>' +
                    '</div>';
        }

        function linkFn(scope, element, attrs) {

            var selectOptionFormat = function(){
                scope.selectOptionValue = lpCoreI18n.instant(scope.selectOption? scope.selectOption.label: '');
                scope.selectOptionValue = lpUIUtils.decodeHtmlEntity(scope.selectOptionValue);
            };

            scope.liInit = function (item) {
                if(scope.defaultSelectOption === item.value) {
                    scope.selectOption = item;
                    selectOptionFormat();
                }
            };
            
            scope.blurHandler = function($event){
                var next = null;

                if($event.relatedTarget){
                    next = $event.relatedTarget;
                }else{
                    next = document.activeElement;
                }
                var $target = $(next);
                if($target.hasClass("option") || $target.hasClass("dropdown-input")){

                }else{
                    scope.showDropdown = false;
                }

            };

            scope.keydownHandler = function($event,item){
                if($event.keyCode === 13){
                    scope.showDropdown = !scope.showDropdown;
                    if(item && scope.selectOption && (scope.selectOption.value !== item.value)){
                        scope.selectOption = item;
                        selectOptionFormat();
                        scope.onSelectedOption({selectOption : item});
                    }
                }
            };

            scope.showSelectedOption = function (event,item) {
                if(event.type === 'mousedown' && event.button == 0){
                    if(item && scope.selectOption && (scope.selectOption.value !== item.value)){
                        scope.selectOption = item;
                        selectOptionFormat();
                        scope.onSelectedOption({selectOption : item});
                    }
                    scope.showDropdown = !scope.showDropdown;
                }
            };

            lpCoreBus.subscribe('clear.select.option', function (value) {
                scope.selectOption = lpCoreUtils.find(scope.options, {value: value});
                selectOptionFormat();
            });

            scope.$root.$on('$translateChangeSuccess',function () {
                selectOptionFormat();
            });
        }

        return {
            restrict: 'E',
            scope: {
                options: '=',
                title: '=info',
                defaultSelectOption: '@',
                onSelectedOption: '&onSelectedOption'
            },
            template: templateFn,
            link: linkFn
        };
    };

});
