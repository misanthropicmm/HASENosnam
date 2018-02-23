(function (root, factory) {
    'use strict';

    // flag to use distribution folder for features / modules
    root.launchpad = root.launchpad || {};

    /**
    // Setting global variable etc.
    // Note: Please keep dev and usemin default value when you commit code to server.
    // @prop dev is for local develop mode. default false, LocalDev is for localhost:7777, SingleWidgetDev is for localhost:3000
    // @prop usemin is for load min js. default true, if you want to debug into third part libs, can set it false.
    // @prop path is for js root path.
    // @prop accountId is for brightcove video player support for marketing banner.
    */
    // TODO Here accountId should get from preference, maybe future will fix it.
    // accountId: "{$item.preferences.brightcoveAccountId.value}"
    // utils.resolvePortalPlaceholders(launchpad.getPreference('brightcoveAccountId')),
    root.launchpad.config = root.launchpad.config || {
        dev: false,
        usemin: true,
        path: "features/[BBHOST]",
        accountId: "1418446428001"
    };

    var USEMIN = Boolean(root.launchpad.config.usemin);
    var host;

    if (typeof exports === 'object') {
        host = require('os').hostname();
        module.exports = factory(root, '');
    } else if (typeof requirejs === 'function') {
        require.config(factory(root, USEMIN));
        host = root.location.host;
    }
    if (!USEMIN && host.indexOf('local') > -1) {
        console.warn('You are using unminified version of modules/features !!! @', host);
    }

})(this, function (root, useMin) {
    'use strict';
    var dist = useMin ? 'dist/' : '';
    var min = useMin ? '.min' : '';

    var path = root.launchpad.config.path || 'features/[BBHOST]';

    var config = {

        urlArgs: '_bwc_ver_',

        waitSeconds: 500,

        baseUrl: (function (launchpad) {
            return launchpad.staticRoot || './';
        })(root.launchpad || {}),

        paths: {
            /**
             * Common libs
             */
            // utility belt
            'lodash': [path + '/lodash/lodash.min', path + '/lodash/lodash'],
            // Mobile and gestures
            'hammerjs': [path + '/hammerjs/hammer.min', path + '/hammerjs/hammer'],
            // intro.js
            'intro': [path + '/intro.js/minified/intro.min', path + '/intro.js/intro'],
            // tether.js
            'tether': [path + '/tether/dist/js/tether.min'],
            // drop down widget based on tether
            'tether-select': [path + '/tether-select/dist/js/select'],
            // bootstrap-datepicker
            // 'bootstrap-datepicker': [path + '/bootstrap-datepicker/dist/js/bootstrap-datepicker.min'],
            // 'bootstrap-datepicker-zh-CN': [path + '/bootstrap-datepicker/dist/locales/bootstrap-datepicker.zh-CN.min'],
            'bootstrap-datepicker-ab':[path + '/bootstrap-datepicker-ab/datepicker-ab'],
            // date
            'moment': [path + '/moment/min/moment-with-locales'],
            'moment-tz': [path + '/moment-timezone/builds/moment-timezone-with-data.min', path + '/moment-timezone/builds/moment-timezone-with-data'],
            // graphics and animation
            'd3': [path + '/d3/d3.min', path + '/d3/d3'],

            // angular & 3rd party ng libs
            'angular': [path + '/angular/angular.min', path + '/angular/angular'],
            'angular-resource': [path + '/angular-resource/angular-resource' + min],
            'angular-sanitize': [path + '/angular-sanitize/angular-sanitize' + min],
            'angular-translate': [path + '/angular-translate/angular-translate' + min],
            'angular-dynamic-locale': [path + '/angular-dynamic-locale/tmhDynamicLocale.min'],
            'angular-bootstrap': [path + '/angular-bootstrap/ui-bootstrap-tpls' + min],
            'angular-animate': [path + '/angular-animate/angular-animate' + min],

            'file-saver': [path + '/file-saver/FileSaver' + min],

            // LP foundation
            'base': path + '/base/' + dist + 'scripts',
            'core': path + '/core/' + dist + 'scripts',
            'ui': path + '/hsbc-ui/scripts',
            'mock': path + '/mock/' + dist + 'scripts',

            // bc bright cove player
            'bc': path + '/brightcove-player/' + dist + '1418446428001',

            // HSBC modules
            'hsbc-module-bus-queue': path + '/hsbc-module-bus-queue/' + dist + 'scripts',

            // LP modules
            'module-behaviors': path + '/module-behaviors/' + dist + 'scripts',

            // requirejs-plugins
            'async': [path + '/requirejs-plugins/src/async'],
            'goog': [path + '/requirejs-plugins/src/goog']

        },
        // Register packages
        packages: [
            'base',
            'core',
            'ui',
            'mock',

            'hsbc-module-bus-queue',

            'module-behaviors'
        ],
        shim: {
            'angular': {
                exports: 'angular'
            },
            'angular-resource': {
                deps: ['angular']
            },
            'angular-translate': {
                deps: ['angular']
            },
            'angular-animate': {
                deps: ['angular']
            },
            'angular-bootstrap': {
                deps: ['angular', 'angular-animate']
            },
            'd3': {
                exports: 'd3'
            }
        }
    };

    // helpers
    // shim libraries loaded as <script> tag
    if (root.jQuery) {
        requirejs.undef('jquery');
        define('jquery', function () {
            return root.jQuery
        });
    }
    if (root.angular) {
        requirejs.undef('angular');
        define('angular', function () {
            return root.angular
        });
    }

    /**
     * RequireJS plugin to load Launchpad style modules without having to individually
     * add each module to the `paths` and `packages` configuration.
     *
     * Usage: `var eg = require('module!example');`
     *
     * With the default configuration, this will load the module in file
     * `/static/features/[BBHOST]/module-example/scripts/main.js`
     *
     */
    define('module', {
        load: function (name, req, onload, config) {
            var moduleName = name.substring(0, name.indexOf('/'));

            if (!(moduleName in config.paths)) {
                config.paths[moduleName] = path + '/' + moduleName + '/' + dist + 'scripts';
            }

            req([name], function (mod) {
                onload(mod);
            });
        },

        normalize: function (name, normalize) {
            var prefix = (name.indexOf('module-') !== 0) ?
                'module-' :
                '';

            var suffix = (name.indexOf('/') < 0) ?
                '/main' :
                '';

            return prefix + name + suffix;
        }
    });

    // Add brightcove video player support for marketing banner etc.
    var accountId = (root && root.launchpad && root.launchpad.config && root.launchpad.config.accountId || '1386823061001');
    config.paths['bc'] = path + '/brightcove-player/' + dist + accountId;

    return config;
});