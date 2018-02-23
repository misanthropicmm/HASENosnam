/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: Main Launchpad StartUp Page
 *  ----------------------------------------------------------------
 */
(function($, require, portal, launchpad) {
    'use strict';
    launchpad.i18n = {
        mergedFiles: true,
        path: launchpad.staticRoot + '/features/[BBHOST]/HSBCRequireJSConfig/i18n'
    };

    function run(portalDomModel) {
        console.log(' CXP WS4 Version : 1.0.9 \n Date : 21/07/2017 PM');
        require(['base'], function(base) {
            base.startPortal(portalDomModel, portal)
                .then(function() {
                    base.bus.publish(base.NS + '.portal.ready', portal);
                });
        });
    }
    $(document).ready(function() {
        require(['module-behaviors'], function(behaviors) {
            // add launchpad behaviors
            launchpad.behaviors = behaviors;
            try {
                portal.startup('main', run);
            } catch(err) {
                console.error('Unable to start up portal:', err.message);
            }
        });
    });
})(window.jQuery, window.requirejs, window.b$ && window.b$.portal, window.launchpad || {}, undefined);


