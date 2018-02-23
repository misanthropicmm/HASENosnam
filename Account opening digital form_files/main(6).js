/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Filename : main.js
 *  Description: ${widget.description}
 *  ----------------------------------------------------------------
 */

define(function (require, exports, module) {

    'use strict';

    module.name = 'hsbc-widget-forms-onboarding';

    // External Dependencies
    var base = require('base');
    var core = require('core');
    var ui = require('ui');
    var factories = require('./factories');
    var controllers = require('./controllers');

    var deps = [
        core.name,
        ui.name,
        'forms-ui'
    ];
	
    module.exports = base.createModule(module.name, deps)
        .constant('WIDGET_NAME', module.name)
        .controller('MainCtrl',controllers)
        .factory('shortcutService',factories);
});