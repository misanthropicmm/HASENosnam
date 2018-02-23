define(function(require, exports, module) {
    'use strict';

    module.name = 'ui.hsbc-select';

    var base = require('base');
    var core = require('core');

    module.exports = base
        .createModule(module.name, [
            core.name
        ]);
});
