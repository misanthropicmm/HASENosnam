/**
 * Directive
 * @module directives
 */
define( function (require, exports) {

    'use strict';

    exports.enterPress = function() {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.enterPress);
                    });
                    event.preventDefault();
                }
            });
        };
    }
});