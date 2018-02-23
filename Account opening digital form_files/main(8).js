define(function(require, exports, module) {
    'use strict';

    module.name = 'hsbc-ui';

    var base = require('base');

    // 3rd party vendor
    // Using angular boostrap
    require('angular-bootstrap');

    var dep = [
        'ui.bootstrap',
        require('./utils/main').name,
        require('./components/hsbc-select/scripts/main').name,
        require('./components/hsbc-checkbox/scripts/main').name,
        require('./components/hsbc-modal/scripts/main').name,
        require('./components/hsbc-datepicker/scripts/main').name,
        require('./components/hsbc-daterange/scripts/main').name,
        require('./components/hsbc-combobox/scripts/main').name,
        // ui utils
        require('./utils/main').name
    ];

    module.exports = base.createModule(module.name, dep)
                        .directive( require('./directives/enter-press'))
                        .directive( require('./directives/tab-press'));

});

