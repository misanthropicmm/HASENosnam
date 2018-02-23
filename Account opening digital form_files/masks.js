/**
 * String mask helpers.
 * @module string-mask
 */
define(function(require, exports, module) {
    'use strict';

    var StringMask = require('../libs/string-mask/src/string-mask');

    function clearDelimitersAndLeadingZeros(value) {
        var cleanValue = value.replace(/^-/, '').replace(/^0*/, '');
        cleanValue = cleanValue.replace(/[^0-9]/g, '');
        return cleanValue;
    }

    module.exports = {
        StringMask: StringMask,

        prepareNumberToFormatter: function (value, decimals) {
            return clearDelimitersAndLeadingZeros((parseFloat(value)).toFixed(decimals));
        },

numberMask: function (decimals, decimalDelimiter, thousandsDelimiter) {
            var mask = '#' + thousandsDelimiter + '##0';

            if(decimals > 0) {
                mask += decimalDelimiter;
                for (var i = 0; i < decimals; i++) {
                    mask += '0';
                }
            }

            return new StringMask(mask, {
                reverse: true
            });
        },

        decimalMask: function (decimals) {
            var mask = '###0';

            if(decimals > 0) {
                mask += '.';
                for (var i = 0; i < decimals; i++) {
                    mask += '0';
                }
            }

            return new StringMask(mask, {
                reverse: true
            });
        }
    };
});

