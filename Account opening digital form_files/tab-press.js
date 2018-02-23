/**
 *when tab press do something
 *
 * @module tab press
 */

define( function (require, exports) {

    'use strict';

    exports.tabPress = function() {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if(event.which === 9 && !event.shiftKey) {
                    scope.$apply(function (){
                        scope.$eval(attrs.tabPress);
                    });
                    event.preventDefault();
                }else {
                    return
                }
            });
        };
    }
});