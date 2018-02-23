/**
 * General DOM helpers.
 * @module dom
 */
define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var core = require('core');
    var lpCoreUtils = base.utils;
    var moment = lpCoreUtils.date;

    function debugDate(date, type) {
        console.debug(type, date.format(type));
    }

    var shortName = {
        shortDay: {'en-US': 'D MMM', 'zh-CN': 'MoDo', 'zh-HK': 'MoDo'},
        longDay: {'en-US': 'D MMM YYYY', 'zh-CN': 'LL', 'zh-HK': 'LL'},
        shortTime: {'en-US': 'HH:mm', 'zh-CN': 'HH:mm', 'zh-HK': 'HH:mm'},
        longTime: {'en-US': 'HH:mm:ss', 'zh-CN': 'HH:mm:ss', 'zh-HK': 'HH:mm:ss'},
        fullTime: {'en-US': 'D MMM YYYY HH:mm:ss', 'zh-CN': 'LL HH:mm:ss', 'zh-HK': 'LL HH:mm:ss'},
        zone: {'en-US': ' (HKT)', 'zh-CN': ' (香港时间)', 'zh-HK': ' (香港時間)'}
    };

    exports.shortName = shortName;

    exports.moment = moment;

    exports.CLEAR_DATE_EVENT = 'clear.date';

    /**
     * date format function
     */
    exports.dateFormat = function(date, lang, t) {
        moment.locale(lang);
        var d = moment(date);
        if (lpCoreUtils.endsWith(t, 'Z')) {
            // Because not restructure bower, can not load moment-tz successfully, so hard code HKT here.
            var tz = t.substring(0, t.length-1);
            // debugDate(d, shortName[tz][lang]);
            return d.format(shortName[tz][lang]) + shortName.zone[lang];
        } else {
            // debugDate(d, shortName[t][lang]);
            return d.format(shortName[t][lang]);
        }
//        var z = moment.tz('America/Los_Angeles').format('z');
//        console.debug('z: ', z);
    };
});
