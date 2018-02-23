/**
 * General DOM helpers.
 * @module dom
 */
define(function(require, exports, module) {
    'use strict';

    /**
     * Moves attributes from srcElem to destElem, using values from attrs, excluding the blacklist.
     *
     * @param {Element} srcElem
     * @param {Element} destElem
     * @param {Object} blacklist
     */
    exports.moveAttributes = function(srcElem, destElem, blacklist) {
        // Transfer attributes from srcElem to the destElem.
        var moveAttrs = srcElem.prop('attributes');
        var i;

        for (i = 0; i < moveAttrs.length; i++) {
            if (blacklist.indexOf(moveAttrs[i].name) === -1) {
                destElem.attr(moveAttrs[i].name, moveAttrs[i].value);
                srcElem.attr(moveAttrs[i].name, null);
            }
        }
    };
});
