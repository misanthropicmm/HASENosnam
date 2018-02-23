define(function(require, exports, module) {

    'use strict';
    require('bootstrap-datepicker-ab');
    require('moment-tz');

    // @ngInject
    exports.hsbcDatepicker = function() {

        function templateFn() {
            return '<div class="hsbc-datepicker-container">' +
                        '<div class="inner-addon right-addon date">' +
                            '<input type="text" class="form-control"><span class="add-on hsbc-calendar-icon"></span>' +
                        '</div>' +
                    '</div>';
        }

        function linkFn(scope, element, attrs) {
            element.find('.hsbc-datepicker-container .date').datepicker();
        }

        return {
            restrict: 'AE',
            template: templateFn,
            link: linkFn
        };
    };

    // @ngInject
    exports.hsbcDaterange = function(lpCoreUtils, lpCoreBus, lpCoreI18nUtils) {

        function templateFn() {
            
            return '<div class="hsbc-datepicker-container">' +
                    '<div class="inner-addon right-addon">' +
                        '<label for="input1" style="visibility: hidden;"></label>' +
                        '<input id="input1" type="text" class="date form-control" ng-class="status" placeholder="{{dateFromPlaceholderText}}">' +
                    '</div>' +
                    '<div class="inner-addon right-addon">' +
                        '<label for="input2" style="visibility: hidden;"></label>' +
                        '<input id="input2" type="text" class="date form-control" ng-class="status" placeholder="{{dateToPlaceholderText}}">' +
                    '</div>' +
                 '</div>';
        }

        function linkFn(scope, element, attrs) {
            scope.currentLocale = '';
            scope.dateFromPlaceholderText = '';
            scope.dateToPlaceholderText = '';
            scope.status = attrs.status;

            var dataPickerFrom = {
                'en-US':'From',
                'zh-CN':'由',
                'zh-HK':'由'
            };
            var dataPickerTo = {
                'en-US':'To',
                'zh-CN':'至',
                'zh-HK':'至'
            };

            var firstInput = element.find('.hsbc-datepicker-container #input1');
            var lastInput = element.find('.hsbc-datepicker-container #input2');

            var moment = lpCoreUtils.date;
            var num = parseInt(attrs.activeDates.split('|')[0], 10);
            var unit = attrs.activeDates.split('|')[1];
            var cDate = attrs.currentDate ? attrs.currentDate : moment().locale('en').tz('Asia/Hong_Kong').format('D MMM YYYY');

            var outputFormat = null;
            var prevMonthDate = null;
            var today = null;
            var prevCDate = '';
            var weekDayFormat = '';
            var inputFormats = ["yyyy/M/d"];

            // when user config x|month, the available start date is 1st in that month
            if(unit === 'month'){
                prevCDate = moment(cDate).set('date',1);
            }else {
                prevCDate = cDate;
            }

            lpCoreBus.subscribe(lpCoreI18nUtils.LOCALE_CHANGE_EVENT, function (lang) {
                scope.dateFromPlaceholderText = dataPickerFrom[lang];
                scope.dateToPlaceholderText = dataPickerTo[lang];

                if(lang === 'en-US'){
                    Date.dp_locales = Date.dp_locales_en;
                    prevMonthDate = moment(prevCDate).subtract((num - 1), unit).locale('en').format('D MMM YYYY');
                    today = cDate;
                    outputFormat = 'd MMM yyyy';
                    weekDayFormat = 'short';
                }else{
                    Date.dp_locales = Date.dp_locales_zh;
                    prevMonthDate = moment(prevCDate).subtract((num - 1), unit).locale('zh-cn').format('LL');
                    today = moment(cDate).locale('zh-cn').format('LL');
                    outputFormat = 'yyyy年M月d日';
                    weekDayFormat = 'narrow';
                }

                if(!scope.currentLocale){
                    var dateInitObj = {
                        inputFormat : inputFormats,
                        weekDayFormat : weekDayFormat,
                        outputFormat : outputFormat,
                        min : prevMonthDate,
                        max : today
                    };

                    firstInput.datepicker(dateInitObj);
                    lastInput.datepicker(dateInitObj);
                }else{
                    var oldFirstDate = firstInput.datepicker('getDate');
                    firstInput.datepicker('setLocales', Date.dp_locales);
                    firstInput.datepicker('inputFormat', inputFormats);
                    firstInput.datepicker('outputFormat', outputFormat);
                    firstInput.datepicker('weekDayFormat', weekDayFormat);
                    firstInput.datepicker('min', prevMonthDate);
                    firstInput.datepicker('max', today);
                    if(firstInput.val() !== ''){
                        firstInput.datepicker('setDate', oldFirstDate);
                    }

                    var oldLastDate = lastInput.datepicker('getDate');
                    lastInput.datepicker('setLocales', Date.dp_locales);
                    lastInput.datepicker('inputFormat', inputFormats);
                    lastInput.datepicker('outputFormat', outputFormat);
                    lastInput.datepicker('weekDayFormat', weekDayFormat);
                    lastInput.datepicker('min', prevMonthDate);
                    lastInput.datepicker('max', today);
                    if(lastInput.val() !== ''){
                        lastInput.datepicker('setDate',oldLastDate);
                    }
                }

                scope.currentLocale = lang;
            });

        }

        return {
            restrict: 'AE',
            template: templateFn,
            link: linkFn
        };
    };
});