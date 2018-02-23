/**
 * Directive
 * @module directives
 */
define( function (require, exports) {

    'use strict';
    
    // @ngInject
    exports.hsbcDaterangeDropdown = function (lpCoreUtils, lpCoreBus, lpCoreI18nUtils, lpCoreI18n, lpUIUtils, $rootScope) {
        var templateStr = 
        '<div class="hsbc-daterange-dropdown-container">' +
            '<div class="drop-btn" tabindex="0" ng-click="toggleDrop($event)" ng-class="dropBtnShowClass">' +
                '<span class="btn-title" ng-bind="buttonTitle"></span>' +
                '<div class="icon" ng-class="toggleIcon"></div>' +
            '</div>' +
            '<div class="drop-container ng-hide" ng-show="showDrop">' +
                '<div class="panel-body">' +
                    '<div class="daterange-tip" lp-i18n="{{dateTipInfo}}"></div>' +
                    '<div class="two-date-pickers">' +
                        '<hsbc-daterange data-active-dates={{dates}}></hsbc-daterange>' +
                    '</div>' +
                    '<div ng-show="!validRange" class="error">' +
                        '<span class="icon icon-h3 icon-circle-delete"></span>' +
                        '<span class="type type__14">{{dateError}}</span>' +
                    '</div>' +
                    '<div class="btn-view-result"><button ng-click="viewResult()" ng-disabled="isBtnDisabled" class="btn hsbc-btn-secondary-jade" lp-i18n="View Result"></button></div>' +
                '</div>' +
            '</div>' +
        '</div>';

        return {
            restrict: 'EA',
            scope: {
                'onToggleDrop': '&onToggleDrop',
                'onStartChange': '&onStartChange',
                'onEndChange': '&onEndChange',
                'dates': '@activeDates',
                'currentDate': '@currentDate',
                'status': '@status',
                'tipInfo': '@tipInfo'
            },
            replace: false,
            template: templateStr,
            link: function (scope, element, attrs) {
                
                var moment = lpCoreUtils.date;
                // if current date is not specified, use Hong Kong time(GTM+8)
                if(!attrs.currentDate){
                    require('moment-tz');
                    scope.currentDate = moment().locale('en').tz('Asia/Hong_Kong').format('D MMM YYYY');
                }

                scope.currentLanguage = '';
                scope.dateTipInfo = attrs.tipInfo;
                scope.buttonTitle = '';

                var dateErrorList = {
                    'en-US':'To Date should not be earlier than From Date. Please specify again.',
                    'zh-CN':'结束日期不应早于开始日期。请从新输入。',
                    'zh-HK':'結束日期不應早於開始日期。請從新輸入。'
                };
                var buttonTitleList = {
                    'en-US':'Custom date range',
                    'zh-CN':'指定日期',
                    'zh-HK':'指定日期'
                };

                var firstInput = element.find('.hsbc-datepicker-container #input1');
                var lastInput = element.find('.hsbc-datepicker-container #input2');

                var init = function () {
                    scope.showDrop = false;
                    scope.dropBtnShowClass = '';
                    scope.validRange = true;
                    scope.isBtnDisabled = true;
                    scope.status = '';
                    scope.toggleIcon = 'icon-chevron-down';
                };

                scope.toggleDrop = function(event){
                    scope.showDrop = !scope.showDrop;
                    scope.dropBtnShowClass = scope.showDrop ? 'show-drop-btn' : '';
                    scope.toggleIcon = scope.showDrop ? 'icon-chevron-up' : 'icon-chevron-down';
                    var selectedDate = event ? false : true;
                    scope.onToggleDrop({selectedDate:selectedDate, from: firstInput.datepicker('getDate'), to: lastInput.datepicker('getDate')});
                };

                scope.viewResult = function(){
                    var isLocaleChinese = scope.currentLanguage.indexOf('zh-') > -1;
                    var momentFrom = moment(firstInput.datepicker('getDate'));
                    var momentTo = moment(lastInput.datepicker('getDate'));
                    scope.validRange = momentFrom.isAfter(momentTo) ? false : true;
                    if(scope.validRange){
                        if(isLocaleChinese){
                            scope.buttonTitle = moment(firstInput.datepicker('getDate')).locale('zh-cn').format('LL') + ' - ' + moment(lastInput.datepicker('getDate')).locale('zh-cn').format('LL');
                        }else{
                            scope.buttonTitle = moment(firstInput.datepicker('getDate')).locale('en').format('D MMM YYYY') + ' - ' + moment(lastInput.datepicker('getDate')).locale('en').format('D MMM YYYY');
                        }
                        this.toggleDrop();
                        scope.status = '';
                    }else{
                        scope.status = 'date-error';
                    }
                };

                element.find('.hsbc-datepicker-container #input1').on('change', function(e) {
                    firstInput.datepicker('initializeDate');
                    firstInput.datepicker('updateInput');
                    scope.onStartChange({value: firstInput.datepicker('getDate')});
                    setBtnDisabled();
                });

                element.find('.hsbc-datepicker-container #input2').on('change', function(e) {
                    lastInput.datepicker('initializeDate');
                    lastInput.datepicker('updateInput');
                    scope.onEndChange({value: lastInput.datepicker('getDate')});
                    setBtnDisabled();
                });

                var setBtnDisabled = function () {
                    scope.isBtnDisabled = !(firstInput.val() && lastInput.val());
                    scope.$apply();
                };

                lpCoreBus.subscribe(lpCoreI18nUtils.LOCALE_CHANGE_EVENT, function (lang) {
                    if(lang !== scope.currentLanguage){
                        scope.dateError = dateErrorList[lang];

                        if(scope.buttonTitle && scope.buttonTitle.indexOf(' - ') > -1){
                            var arr = scope.buttonTitle.split(' - ');
                            var start = arr[0];
                            var end = arr[1];

                            if((scope.currentLanguage.indexOf('zh-') > -1) && !(lang.indexOf('zh-') > -1)){
                                start = moment(start, 'YYYY年M月D日').locale('en').format('D MMM YYYY');
                                end = moment(end, 'YYYY年M月D日').locale('en').format('D MMM YYYY');

                            }else if(!(scope.currentLanguage.indexOf('zh-') > -1) && (lang.indexOf('zh-') > -1)){
                                start = moment(start).locale('zh-cn').format('LL');
                                end = moment(end).locale('zh-cn').format('LL');
                            }
                            scope.buttonTitle = start + ' - ' + end;
                        }else{
                            scope.buttonTitle = buttonTitleList[lang];
                        }

                        scope.currentLanguage = lang;
                    }
                });

                lpCoreBus.subscribe('clear.date',function () {
                    firstInput.val('');
                    lastInput.val('');

                    scope.buttonTitle = buttonTitleList[scope.currentLanguage];

                    init();
                });

                init();
            }
        };
    }
});