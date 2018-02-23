/**
 * undefined - Copyright © 2018 Backbase B.V - All Rights Reserved
 * Version 0.0.1
 * undefined
 * @license
 */
(function (root, factory) {
	'use strict';
	if (typeof module !== 'undefined' && typeof module.exports === 'object') {
		module.exports = factory(require('vendor-bb-angular'), require('vendor-bb-angular-sanitize'), require('vendor-bb-ng-file-upload'));
	} else {
		return factory(root.angular);
	}
}(this, function (angular) {

	(function() {
	'use strict';

	/**
	 * The forms UI module
	 */
	var app = angular.module('forms-ui', ['ngSanitize','ngFileUpload']);
	app.value('$sessionStorage', window.sessionStorage);

	/**
	 * Useful constants
	 */
	app.constant('formConsts', {

		//keepalive ping interval
		PING_INTERVAL: 1000 * 60,

		//session expired related errors
		AQUIMA_SESSION_EXCEPTION: 'com.aquima.web.api.exception.UnknownSubscriptionException',
		SESSION_EXPIRED_ERR: 'SESSION_EXPIRED',
		UNKNOWN_ERR: 'UNKNOWN_ERR',
		UNABLE_TO_CREATE_SESSION_ERR: 'UNABLE_TO_CREATE_SESSION',

		//unknown/missing app related errors
		AQUIMA_UNKNOWN_APP_EXCEPTION: 'com.aquima.interactions.portal.exception.UnknownApplicationException',
		UNKNOWN_APP_ERR: 'UNKNOWN_APP',

		//unavailable language related errors
		AQUIMA_UNKNOWN_LANG_EXCEPTION: 'com.aquima.interactions.metamodel.exception.UnknownLanguageException',
		UNKNOWN_LANG_ERR: 'UNKNOWN_LANG'

	});

	/**
	 * Sets up:
	 * - Debug mode
	 * - The template base
	 */
	/*@ngInject*/
	app.config(["$provide", "$logProvider", "$httpProvider", function($provide, $logProvider, $httpProvider) {

		var debug = true;
		$logProvider.debugEnabled(debug);
		$provide.value('debugEnabled', debug);

		$httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.withCredentials = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}]);

	/**
	 * Custom exception handling
	 */
	/*@ngInject*/
	/*app.factory('$exceptionHandler', function($log, debugEnabled) {
		return function() {
			if(debugEnabled) {
				var args = [ 'Exception occurred: '].concat(Array.prototype.slice.call(arguments));
				$log.debug.apply($log, args);
			}
		};
	});*/
})();
(function() {
    'use strict';
    /* jshint validthis: true */

    /**
     * @directive bbElement
     * @ngInject
     * @example
     *      <bb-element data-key="element.key"></bb-element>
     */
    function bbElementDirective() {
        return {
            restrict: 'E',
            bindToController: true,
            controller: 'BBElementController as $ctrl',
            scope: {},
            require: {
                form: '^^bbForm'
            }
        };
    }

    function BBElementController($scope, $element, $attrs, ElementService) {
        var ctrl = this;

        $attrs.$observe('key', updateElement);

        function updateElement() {
            var key = $attrs.key;
            var model = ctrl.form.getElementByKey(key);

            $scope.element = model;
            $element.html('');

            if (model) {
                updateComponent();
            }

            // TODO check for memory leaks related to transclusion
        }

        function updateComponent() {
            var excludeElements = 'bbControl' in $attrs;
            var model = $scope.element;
            var component = ElementService.findComponentForElement(model, excludeElements);

            if (component) {
                ElementService.runComponent(component, $scope, $element);
            }
        }
    }
    BBElementController.$inject = ["$scope", "$element", "$attrs", "ElementService"];

    var app = angular.module('forms-ui');
    app.controller('BBElementController', BBElementController);
    app.directive('bbElement', bbElementDirective);
})();

(function () {
    'use strict';
    /* jshint validthis: true */

    /**
     * @directive bbForm
     */
    function bbFormDirective() {
        return {
            restrict: 'E',
            controller: 'BBFormController as bbForm',
            templateUrl: 'directive/form.html',
            bindToController: {
                config: '<'
            }
        };
    }

    /**
     * @controller BBFormController
     * @ngInject
     */
    function BBFormController($scope, $log, SessionService, FormService, messages, $rootScope) {
        var form = this;

        $scope.$on('update', applyChanges);
        this.startSession = startSession;
        this.lookupMessage = lookupMessage;

        $scope.$on('configUpdated', function (pEvent, pParamB) {
            form.config = pParamB;
            createSession();
        });

        function createSession () {
            SessionService.createSession(form.config).then(function (session) {
                form.session = session;
                form.model = FormService.createForm(form.session);
                loadModel();
            });
        }

        function startSession() {
            form.session = null;
            form.model = null;

            //setup messages
            form.messages = FormService.getLocalizedMessages($scope.languageCode, messages);

            if (form.config) {
                var requiredPreferenceKeys = ['project', 'flow', 'branch', 'languageCode'];
                var errors = [];
                requiredPreferenceKeys.forEach(function (value) {
                    if (!form.config[value]) errors.push(value);
                });
                if (errors.length === 0) createSession();
                else {
                    createSession();
                }
            }
        }

        function lookupMessage(messageKey) {
            return FormService.lookupMessage(form, messageKey);
        }

        function beforeRefresh() {
            form.isRefreshing = true;
        }

        function afterRefresh() {
            var model = form.model;

            if (model) {
                form.root = model.elementList.filter(function (e) {
                    return e.isPage;
                })[0];
                $scope.$applyAsync(function () {
                    form.isRefreshing = false;
                });
            }
            $rootScope.$broadcast('updateUtag');
            $('input[name="ConnectedIndividual.hKID"]').blur(function(){var connectedIndividualHKID = $(this).val();var connectedIndividualHKIDExt = $('input[name="ConnectedIndividual.hKIDExt"]').val();hkidValidate(connectedIndividualHKID,connectedIndividualHKIDExt);});
            $('input[name="ConnectedIndividual.hKIDExt"]').blur(function(){var connectedIndividualHKIDExt = $(this).val();var connectedIndividualHKID = $('input[name="ConnectedIndividual.hKID"]').val();hkidValidate(connectedIndividualHKID,connectedIndividualHKIDExt);});
            $(".popover").remove();
        }

        function onFormError(error) {
            if (typeof error.session !== 'undefined' && error.session) {
                SessionService.destroySession(form.session);
                startSession();
                return;
            }
            $log.error(error);
        }

        function loadModel() {
            beforeRefresh();
            FormService.updateForm(form.model).catch(onFormError).finally(afterRefresh);
        }

        function applyChanges($event) {
            var element = $event.targetScope.element;

            if(typeof(window.opinionLab) == "function" && element.styles.indexOf("opinion_survey") > -1){
                window.opinionLab();
            }

            if (element.isButton || element.canBeUpdated ) {
                beforeRefresh();
                form.isLoading = element.isButton;

                FormService.applyChanges(form.model, element)
                    .catch(onFormError)
                    .finally(afterRefresh);
            }
        }

        this.handleUpdates =  function (pData) {
            FormService.handleUpdates(pData,this.model);
        };
    }
    BBFormController.$inject = ["$scope", "$log", "SessionService", "FormService", "messages", "$rootScope"];

    function getElementByKey(key) {
        return this.model && this.model.getElementByKey(key);
    }

    BBFormController.prototype = {
        constructor: BBFormController,
        getElementByKey: getElementByKey,
        $onInit: function () {
            this.startSession();
        }
    };

    var app = angular.module('forms-ui');

    app.controller('BBFormController', BBFormController);
    app.directive('bbForm', bbFormDirective);
})();
(function() {
	'use strict';

	var app = angular.module('forms-ui');

	/**
	 * Converts element styles from the model to HTML class names.
	 * Replaces _ with -
	 */
	app.filter('beautify', function() {
		return function(styles) {
            styles = styles || '';
            var str = (typeof styles === 'string') ? styles : styles.join(',');


			// replace '_' on '-'
			str = str.replace(/_/gi, '-');
			// split camel case with ' ';
			str = str.replace(/([a-z](?=[A-Z]))/g, '$1 ');
			// revert ' ' to '-';
			str = str.replace(/ /gi, '-');
			//revert ',' to ' '
			str = str.replace(/,/gi, ' ');
			// automatically add fa (FontAwesome class)
			str = str.replace(/fa-/gi, 'fa fa-');
			// to lower case
			str = str.toLowerCase();
			return str;
		};
	});

})();

(function() {
	'use strict';

	var app = angular.module('forms-ui');

	/**
	 * Construct Error Message Filter
	 * Formats error message objects for display
	 */
	app.filter('constructErrorMessage', [ constructErrorMessage ]);

	function constructErrorMessage() {

		function parseMessage(message, elem) {

			if(message && message.indexOf('[Q]') > -1) {
				// tekst is like this: "Vul uw [Q] in"
				return message.replace('[Q]', '"' + elem.questionText + '"');
			} else {
				return message;
			}
		}

		return function(elem) {
			var messages = '';

			// concat all messages together
			angular.forEach(elem.messages, function(value) {
				messages = messages + parseMessage(value.text, elem);
			});

			return messages;
		};
	}

})();
(function () {
    'use strict';

    var app = angular.module('forms-ui');

    /**
     * Format Content Item Filter
     * Formats content item objects for display
     */
    app.filter('formatContentItem', ["$filter", function ($filter) {

        function postOrder(nodes) {
            var returnVal = '';

            angular.forEach(nodes, function (value) {
                if (value.nodeType === 'text') {
                    returnVal += value.text || '';
                    if (value.nodes) {
                        returnVal += postOrder(value.nodes);
                    }
                } else if (value.nodeType === 'value') {
                    returnVal += value.values.join('') || '';
                    if (value.nodes) {
                        returnVal += postOrder(value.nodes);
                    }
                } else if (value.nodeType === 'style') {
                    switch (value.presentationStyle) {
                        case 'NewLine': {
                            returnVal += '<br />';
                            break;
                        }
                        case 'Bold': {
                            returnVal += '<strong class="' + $filter('beautify')(value.presentationStyle.split(' ')) + '">';
                            returnVal += value.text || '';
                            if (value.nodes) {
                                returnVal += postOrder(value.nodes);
                            }
                            returnVal += '</strong>';
                            break;
                        }
                        default: {
                            returnVal += '<span class="' + $filter('beautify')(value.presentationStyle.split(' ')) + '">';
                            returnVal += value.text || '';
                            if (value.nodes) {
                                returnVal += postOrder(value.nodes);
                            }
                            returnVal += '</span>';
                        }
                    }
                }
            });

            return returnVal;

        }

        return function (contentItemNodes) {
            return postOrder(contentItemNodes);
        };
    }]);
})();
(function() {
	'use strict';

	var app = angular.module('forms-ui');

	/**
	 * adds urls to trusted url for use in iFrame
	 */

	app.filter('trustAsResourceUrl', ['$sce', function ($sce) {
		return function (val) {
			return $sce.trustAsResourceUrl(val);
		};
	}]);
})();




(function () {
    /**
     * Form Element
     * @class
     */
    function Element(model) {
        this.update(model);
    }



    addGetter('text', function() { return this._e.text; });
    addGetter('questionText', function() { return this._e.questionText; });
    addGetter('key', function() { return this._e.key; });
    addGetter('dataType', function() { return this._e.dataType || ''; });
    addGetter('type', function() { return this._e.type || ''; });
    addGetter('name', function() { return this._e.name || ''; });
    addGetter('maxLength', function() { return Number(this._e.displayLength) || 0; });
    addGetter('options', function() { return this._e.domain; });
    addGetter('properties', function() { return this._e.properties; });
    addGetter('hasOptions', function() { return !!this._e.hasDomain; });
    addGetter('hasDomain', function() { return !!this._e.hasDomain; });
    addGetter('label', function() { return this._e.questionText; });
    addGetter('description', function() { return this._e.explainText || ''; });
    addGetter('messages', function() { return this._e.messages || []; });
    addGetter('multiple', function() { return !!this._e.multiValued; });
    addGetter('disabled', function() { return !!this._e.disabled; });
    addGetter('readOnly', function() { return !!this._e.readonly; });
    addGetter('canBeUpdated', function() { return !!this._e.refresh; });
    addGetter('required', function() { return !!this._e.required; });
    addGetter('validations', function() { return this._e.validations || []; });
    addGetter('originalValue', function() { return this._e.values; });
    addGetter('value', function() { return this._e.values; }, function(v) { this._e.values = v; });
    addGetter('childKeys', function() { return this._e.children || []; });
    addGetter('styles', function() { return this._e.styles || []; });
    addGetter('contentStyle', function() { return this._e.contentStyle || []; });
    addGetter('classList', function() { return this.styles.length === 0 ? '' : this.styles.join(' ').replace(/_/g, '-'); });
    addGetter('isDirty', isDirty);
    addGetter('hasError', hasError);

    // rules for element types
    addGetter('isPage', function() { return this._e.type === 'page'; });
    addGetter('isButton', function() { return this._e.type === 'button'; });
    addGetter('isContainer', function() { return this._e.type === 'container'; });
    addGetter('isField', function() { return this._e.type === 'field'; });

    function isDirty() {
        var originalValue = this._values;
        var newValue = this._e.values;

        if (originalValue === newValue) {
            return false;
        }

        return !areArraysEqual(toArray(this._e.values), toArray(this._values));
    }

    function hasStyle(style) {
        return this.styles.length && this.styles.indexOf(style) > -1;
    }

    function hasError() {
        return this.messages.length && this.messages[0].type === 'ERROR';
    }

    function getProperty(name) {
        return this._e[name];
    }

    function updateElementModel(model) {
        if (!model) {
            throw new Error('Invalid model to apply on element');
        }

        if (model.values === undefined) {
            model.values = [];
        }

        if (!Array.isArray(model.values)) {
            model.values = [model.values];
        }

        this._e = model;
        this._values = model.values.length ? angular.copy(model.values) : [];
    }

    function addGetter(name, getterFn, setterFn) {
        Object.defineProperty(Element.prototype, name, { get: getterFn, set: setterFn || angular.noop });
    }

    function areArraysEqual(a, b) {
        if (a === b) {
            return true;
        }

        // both are arrays but not the same length
        if (a.length !== b.length) {
            return false;
        }

        // shortcut for arrays with one element
        if (a.length === 1) {
            return a[0] === b[0];
        }

        a.sort();
        b.sort();

        var index = a.length;

        while (index--) {
            if (a[index] !== b[index]) {
                return false;
            }
        }

        return true;
    }

    function toArray(value) {
        return Array.isArray(value) ? value : [value];
    }

    Element.prototype.get = getProperty;
    Element.prototype.update = updateElementModel;
    Element.prototype.hasStyle = hasStyle;

    angular.module('forms-ui').value('Element', Element);
})();
(function () {

    function FormFactory(Element) {
        /**
         * @class Form
         * @param {Session} session
         */
        function Form(session) {
            this.session = session;
            this.updateElements([]);

            /**
             * Array of elements in this form
             * @property {Array<Element>} elementList
             */

            /**
             * Map of elements in this form, accessible through the element's key
             * @property {Map<Element>} elementMap
             */
        }

        /**
         * Possible kinds of model changes
         */
        var actions = {
            ADD: 'add',
            DELETE: 'delete',
            UPDATE: 'update'
        };

        Form.prototype = {
            constructor: Form,
            updateElements: updateElements,
            getElementByKey: getElementByKey,
            getUpdates: getUpdates,
            applyChanges: applyChanges,

            actions: actions
        };

        /**
         * @param {string} key      Element key
         */
        function getElementByKey(key) {
            return this.elementMap.get(key) || null;
        }

        /**
         * Replace all form elements
         * @param {Array<Object>} elements
         */
        function updateElements(elements) {
            this.elementList = wrapElementList(elements);
            this.elementMap = makeElementMap(this.elementList);

            updateElementTree(this.elementList, this.elementMap);
        }

        /** @private */
        function wrapElementList(elements) {
            return elements.map(wrapElement);
        }

        /** @private */
        function wrapElement(e) {
            if (e instanceof Element === true) {
                return e;
            }

            return new Element(e);
        }

        /** @private */
        function addElement(form, model) {
            var element = wrapElement(model);
            form.elementMap.set(element.key, element);
            form.elementList.push(element);
        }

        /** @private */
        function removeElement(form, key) {
            var element = form.elementMap.get(key);

            if (!element) {
                return false;
            }

            form.elementMap.delete(key);
            form.elementList = form.elementList.filter(function(e) { return e.key !== key; });
        }

        /** @private */
        function updateElement(form, key, model) {
            var element = form.elementMap.get(key);

            if (!element) {
                return false;
            }

            element.update(model);
        }

        /** @private */
        function makeElementMap(elementList) {
            var map = new Map();

            elementList.forEach(function(e) {
                map.set(e.key, e);
            }, this);

            return map;
        }

        /** @private */
        function updateElementTree(list, map) {
            list.forEach(function(element) {
                if (!element.childKeys.length) { return; }

                element.children = element.childKeys.map(getElement);
            });

            function getElement(key) {
                return map.get(key);
            }
        }

        /**
         * Get the model differences to persist on servers
         * @param {Form} form
         * @returns {Array<Object>}
         */
        function getUpdates() {
            return this.elementList.map(elementToObject).filter(Boolean);
        }

        /**
         * Returns an object suitable to be sent as a "diff" to forms backend
         * @return {Object}
         * @private
         */
        function elementToObject(element) {
            if (!element.isDirty) {
                return;
            }

            return {
                key: element.key,
                values: angular.isArray(element.value) ? element.value : [element.value]
            };
        }

        /**
         * @param {Array<Object>} changes
         * @param {string} change.type      One of 'add', 'delete' or 'update'
         * @param {string} change.key       The key of an element to apply this update
         * @param {Object?} changes.model   A model object (element)
         */
        function applyChanges(changes) {
            changes.forEach(applyModelChange, this);
            updateElementTree(this.elementList, this.elementMap);
        }

        /** @private */
        function applyModelChange(change) {
            var type = change.type;

            if (actions.ADD === type) {
                return addElement(this, change.model);
            }

            if (actions.DELETE === type) {
                return removeElement(this, change.key);
            }

            if (actions.UPDATE === type) {
                return updateElement(this, change.key, change.model);
            }
        }

        return Form;
    }
    FormFactory.$inject = ["Element"];

    angular.module('forms-ui').factory('Form', FormFactory);
})();
(function() {
    /**
     * The session of a given form
     * @class Session
     */
    function Session(options) {
        if (!options) {
            throw new Error('Invalid session options!');
        }

        this.options = angular.copy(options);
        this.sessionId = options.sessionId || '';
    }

    Session.prototype = {
        constructor: Session,
        getSessionKey: getSessionKey
    };

    /**
     * Returns a string combining all session options
     * @return {string}
     */
   function getSessionKey() {
        var o = this.options;
        var baseSession = ['bbForms', o.shortcut, o.project, o.flow, o.branch, o.languageCode, o.runtimePath].join('.');
        var formSession = '';
        if(typeof o.portal !== 'undefined' && o.portal === 'digital-forms') {
            formSession = 'FORMS-SESSION';
        }
        var sessionKey = (formSession !== '') ? formSession : baseSession;
        return sessionKey;
    }

    angular.module('forms-ui').value('Session', Session);
})();

(function() {
    'use strict';

    /**
     * Registry of all components
     * @service ComponentRegistry
     * @ngInject
     */
    function ComponentRegistry() {
        var components = [];

        /**
         * Register a component
         * @param {Object} config
         * @param {string}   config.name        Component name
         * @param {Function} config.condition   A function which determines if this component
         *                                      will be rendered. This function will receive
         *                                      an instance of `Element` and should return
         *                                      true if the conditions are met, false otherwise.
         */
        function registerControl(config) {
            config.score = -1;
            config.isElement = false;
            components.push(config);
        }

        /**
         * Register a component to be render as an element. Is as same as `registerControl`,
         * but the elements are always rendered as wrappers to controls
         */
        function registerElement(config) {
            config.score = 0;
            config.isElement = true;
            components.push(config);
        }

        /**
         * Find a component to render a given element
         * @private
         * @param {Element} element
         * @param {Boolean} onlyElements
         */
        function find(element, onlyElements) {
            var response;
            var lim = components.length;
            var bestScore =0;
            while(--lim>=0) {
                var c = components[lim];
                var result = c.condition(element);
                c.score = result.score;
                if(c.isElement === onlyElements && result.totalMatch) {
                    if (result.score > bestScore){
                        response = c;
                        bestScore = result.score;

                    }
                }
            }

            return response;
        }

        /**
         * Find a control component to render an element
         * @param {Element} element
         */
        function findControl(element) {
            return find(element, false);
        }

        /**
         * Find a element component to render an element
         * @param {Element} element
         */
        function findElement(element) {
            return find(element, true);
        }

        return {
            registerControl: registerControl,
            registerElement: registerElement,
            findElement: findElement,
            findControl: findControl,
            components: components
        };
    }

    angular.module('forms-ui').service('ComponentRegistry', ComponentRegistry);
})();

(function() {

    /**
     * @service ElementService
     * @ngInject
     */
    function ElementService($templateCache, $compile, $controller, $log, ComponentRegistry) {
        var CHILDREN = $templateCache.get('directive/element.children.html');
        var CONTROL = $templateCache.get('directive/element.control.html');

        var compiledComponents = new Map();

        /**
         * Insert a component into an element and run its content (directives)
         * @param {Object} component    Component configuration object
         * @param {Scope} $scope        Scope to bind the component's template
         * @param {jqLite} $element     The element where the component will be placed
         */
        function runComponent(component, $scope, $element) {
            var linkToScope = compileComponentTemplate(component);
            var controller = component.controller;

            if ($scope.$$componentScope) {
                $scope.$$componentScope.$destroy();
            }

            var scope = $scope.$$componentScope = $scope.$new();
            linkToScope(scope, transclude);

            if (controller) {
                var locals = { $scope: scope };
                $controller(controller, locals);
            }

            function transclude(clone) {
                $element.append(clone);
            }
        }

        /**
         * @param {Element} element             Element model
         * @param {Boolean} excludeElements     If `true` Search only for controls
         * @return {null|Object} component configuration object
         */
        function findComponentForElement(element, excludeElements) {
            var component;

            if (excludeElements) {
                component = ComponentRegistry.findControl(element);
            } else {
                component = ComponentRegistry.findElement(element);
            }

            if (!component) {
                var unsupportedError = new Error('Element not supported: ' + element.key);
                unsupportedError.reason = element;
                $log.error(unsupportedError);

                return null;
            }

            return component;
        }

        /**
         * @param {Object} component
         * @return {string} component template
         * @private
         */
        function getComponentTemplate(component) {
            var template = $templateCache.get('component/' + component.name + '/template.html');
            template = template.replace('<children></children>', CHILDREN);
            template = template.replace('<control></control>', CONTROL);

            return angular.element(template);
        }

        /**
         * @param {Object} component
         * @return {Function} compiled component's template
         * @private
         */
        function compileComponentTemplate(component) {
            var name = component.name;

            if (compiledComponents.has(name) === false) {
                var template = getComponentTemplate(component);
                var linkFn = $compile(template);

                compiledComponents.set(name, linkFn);
            }

            return compiledComponents.get(name);
        }

        return {
            findComponentForElement: findComponentForElement,
            runComponent: runComponent
        };
    }
    ElementService.$inject = ["$templateCache", "$compile", "$controller", "$log", "ComponentRegistry"];

    angular.module('forms-ui').service('ElementService', ElementService);
})();

(function () {
    'use strict';
    /* jshint validthis: true */

    var MODEL_FETCH_URL = '%runtimePath%/server/session/%sessionId%/api/subscribe/%sessionId%';
    var MODEL_UPDATE_URL = '%runtimePath%/server/session/%sessionId%/api/subscription/%sessionId%/handleEvent';

    var knownErrors = {
        SESSION_EXPIRED: 'UNKNOWN_SESSION'
    };

    /**
     * Create and populate form sessions
     * @class
     * @ngInject
     */
    function FormService($http, $q, StringUtils, Form) {

        /**
         * @param {Session} session     Session attached to this form
         * @return {Form}
         */
        function createForm(session) {
            return new Form(session);
        }

        /**
         * Update the state of a form with the model state from server
         * @param {Form} form
         * @return {Promise}
         */
        function updateForm(form) {
            var fetchUrl = createUrlFromTemplate(form, MODEL_FETCH_URL);

            return $http.post(fetchUrl).then(function (response) {
                form.updateElements(response.data.elements);
                form.csrfToken = response.data.csrfToken;
                return form;
            })
                .catch(handleRequestErrors);
        }

        function handleRequestErrors(response) {
            var errorInfo = response.data;

            if (!errorInfo || !errorInfo.errorType) {
                return $q.reject(response);
            }

            var errorType = errorInfo.errorType;
            var error;

            if (errorType === knownErrors.SESSION_EXPIRED) {
                error = new Error('Session expired');
                error.session = true;

                return $q.reject(error);
            }

            return $q.reject(error);
        }


        function handleUpdates(response, pForm) {
            var result = response.data;
            var events = result.events;
            if (!(events && events.length)) {
                return;
            }
            if (events.length) {
                events.forEach(function (pEvent) {
                    applyChangesOnForm(pEvent, pForm);
                });
            }

        }

        /**
         * @param {Form} form
         * @param {Element} element
         */
        function applyChanges(form, element) {
            //Taken from Darlan
            var deltasToSend = form.getUpdates();
            var deltas = {
                //key is different in Darlans
                elementKey: element.key,
                fields: deltasToSend
            };
            var updateUrl = createUrlFromTemplate(form, MODEL_UPDATE_URL);
            var httpHeaders = {
                //Token should be changed to session
                'X-CSRF-Token': form.csrfToken
            };
            var httpConfig = {
                method: 'post',
                url: updateUrl,
                data: deltas,
                headers: httpHeaders
            };

            return $http(httpConfig).then(function (pResponse) {
                handleUpdates(pResponse, form);
            },function () {
                if(localStorage.getItem('locale')=="en-us")
                {window.location.href="/portalserver/errorpages/en-us";}
                else if(localStorage.getItem('locale')=="zh-cn")
                {window.location.href="/portalserver/errorpages/zh-cn";}
                else if(localStorage.getItem('locale')=="zh-hk")
                {window.location.href="/portalserver/errorpages/zh-hk";}}).catch(handleRequestErrors);
        }

        /** @private */
        function applyChangesOnForm(pEvent, form) {
            //Taken from Darlan
            while ('changes' in pEvent) pEvent = pEvent.changes;
            if (pEvent) form.applyChanges(pEvent);

        }

        /** @private */
        function createUrlFromTemplate(form, template) {
            var session = form.session;
            var options = Object.create(session.options);
            options.sessionId = session.sessionId;

            return StringUtils.replaceVariables(template, options);
        }

        function getLocalizedMessages(locale, messages) {
            var availableLocales = Object.keys(messages);
            locale = locale || 'en';

            var bestMatchLocale = availableLocales.sort().reduce(function (prev, current) {
                return locale.indexOf(current) > -1 ? current : prev;
            }, null);

            return messages[bestMatchLocale];
        }

        function lookupMessage(form, messageKey) {
            var message = form.messages && form.messages[messageKey];
            return message || '';
        }

        return {
            createForm: createForm,
            updateForm: updateForm,
            applyChanges: applyChanges,
            getLocalizedMessages: getLocalizedMessages,
            lookupMessage: lookupMessage,
            handleUpdates: handleUpdates
        };
    }
    FormService.$inject = ["$http", "$q", "StringUtils", "Form"];

    angular.module('forms-ui').service('FormService', FormService);
})();

(function() {
	'use strict';

	var app = angular.module('forms-ui');

	/**
	 * This value provides a map of localized client side messages.
	 * These can be customized via decoration
	 */
	app.value('messages', {
		en : {
			requiredField: 'This field is required',
			selectOne: 'Choose an option',
			defaultCurrency: '$',
			optionalField: '*',
			formError: 'An error occurred rendering this form'
		},
		nl: {
			requiredField: 'Dit veld is verplicht',
			selectOne: 'Maak een keuze',
			defaultCurrency: '$',
			optionalField: '*',
			formError: 'Er is een fout opgetreden waardoor deze vorm'
		}
	});
})();
(function() {
    'use strict';
    /* jshint validthis: true */

    var HTML_SESSIONID_MATCHER = /appUri:.*?server\/vaadin\/sessionTools-(.+)'/;
    var DEFAULT_THEME = 'forms';
    var DEFAULT_UI = 'mvc';

    /**
     * Create and populate form sessions
     * @service SessionService
     * @ngInject
     */
    function SessionService($http, $sessionStorage, $q, StringUtils, Session) {

        /**
         * Create a form session
         * @param {Object} options      Session options
         * @return {Promise<Session>}
         */
        function createSession(options) {
            var session = new Session(options);

            var initialize = initializeSession.bind(null, session);
            var subscribe = subscribeToSession.bind(null, session);

            return $q.when(session)
                .then(initialize)
                .then(subscribe)
                .then(returnSession);

            function returnSession() {
                return session;
            }

        }

        function destroySession(session) {
            var storageKey = session.getSessionKey();
            $sessionStorage.setItem(storageKey, '');
            session.sessionId = '';
        }

        /**
         * Subscribe to model updates on a session
         * @param {Session} session
         * @return {Promise}
         * @private
         */
        function subscribeToSession(session) {
            var subscribeUrl = session.options.runtimePath + '/server/session/' + session.sessionId + '/api/subscribe';
            gadgets.pubsub.publish('language', subscribeUrl);
            return $http.post(subscribeUrl);
        }

        /**
         * Initialize a session object
         * Grab a session id from local storage or create a new session otherwise
         * @private
         */
        function initializeSession(session) {
            var options = session.options;

            // default values for theme/ui, used on forms runtime
            options.ui = options.ui || DEFAULT_UI;
            options.theme = options.theme || DEFAULT_THEME;

            var storageKey = session.getSessionKey();
            var sessionId = options.sessionId || $sessionStorage.getItem(storageKey);

            if (sessionId) {
                session.sessionId = sessionId;
                return $q.when(session);
            }

            return createSessionId(session).then(function() {
                $sessionStorage.setItem(storageKey, session.sessionId);
            });
        }

        /**
         * Get a session id from forms runtime
         * @private
         */
        function createSessionId(session) {
            var urlOptions = StringUtils.toQueryString(session.options);
            var sessionUrl = session.options.runtimePath + '/server/start?' + urlOptions;

            // TODO check invalid session ID and recover from it

            return $http.get(sessionUrl).then(function(response) {
                var sessionData = response.data;
                var sessionId;

                if (typeof sessionData === 'object') {
                    sessionId = sessionData.sessionId;
                } else {
                    sessionId = parseSessionFromHtml(sessionData);
                }

                session.sessionId = sessionId;

                return session;
            });
        }

        /**
         * Grabs a session ID from an HTML document returned on forms runtime call
         * @private
         */
        function parseSessionFromHtml(html) {
            var sessionId = html.match(HTML_SESSIONID_MATCHER);
            return sessionId && sessionId[1] || '';
        }

        return {
            createSession: createSession,
            destroySession: destroySession,

            DEFAULT_THEME: DEFAULT_THEME,
            DEFAULT_UI: DEFAULT_UI
        };
    }
    SessionService.$inject = ["$http", "$sessionStorage", "$q", "StringUtils", "Session"];

    angular.module('forms-ui').service('SessionService', SessionService);
})();

(function() {
    'use strict';
    /* jshint validthis: true */

    /**
     * Collection of string-related utilities
     */
    function StringUtils() {
        return {
            replaceVariables: replaceVariables,
            toQueryString: toQueryString
        };
    }

    function toQueryString(object) {
        return Object.keys(object)
            .map(function(key) {
                return key + '=' + encodeURIComponent(object[key]);
            })
            .join('&');
    }

    function replaceVariables(string, values) {
    	for(var key in values) {
            if(key !== '') {
                var replaceKey = '%'+key+'%';
                var value = values[key];
                var regex = new RegExp(replaceKey, 'g');
                string = string.replace(regex, value);
            }
        }
        return string;

		// missing session id sometimes
        /*return string.replace(/%([a-z]+[a-zA-Z0-9]+)%/g, function(_, variable) {
            return values[variable] || '';
        });*/
    }

    angular.module('forms-ui').service('StringUtils', StringUtils);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'accordian',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf("accordian") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('AccordianController', ["$scope", function ($scope) {
        var element = $scope.element;
        $scope.buttomElement = element.children[0];
        $scope.isInfoDisplay = false;
        $scope.updateCollapse = function(){
            if($scope.isInfoDisplay){
                $scope.isInfoDisplay = false;
            } else {
                $scope.isInfoDisplay = true;
            }
        };
        var traverseObj = function(responseObject, param) {
            var result;
            var process = function(key, value) {
                if (key === param) {
                    result = value;
                }
            };

            var traverse = function(responseObject, func) {
                for (var i in responseObject) {
                    func.apply(this, [i, responseObject[i]]);
                    if (responseObject[i] !== null && typeof(responseObject[i]) == 'object') {
                        //going on step down in the object tree!!
                        traverse(responseObject[i], func);
                    }
                }
            };
            traverse(responseObject, process);
            return result;
        };
        var getElementsStyleName = function(element) {
            var elementByStyleName = [];
            for(var i = 0; i < element.length; i++) {
                var currentElement = element[i];
                elementByStyleName[currentElement.type] = currentElement;
            }
            return elementByStyleName;
        };
        $scope.contentElement = [];
        $scope.navigationButton = [];
        if(element.children[1] && element.children[1].children) {
            var content = element.children[1].children;
            var contentInfo = getElementsStyleName(content);
            $scope.contentElement.push(contentInfo.container);
            $scope.navigationButton.push(contentInfo.button);
        }
        var errorData = traverseObj($scope.contentElement, 'messages');
        $scope.isErrorPresent = (typeof errorData === 'undefined' && errorData.length) ? false : true;
    }]);
})();

(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'autocomplete',
            controller: 'AutoCompleteController as controller',
            condition: function (el) {
                var checks = [
                    el.styles.indexOf("autocomplete") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();

(function() {
    'use strict';
    var app = angular.module('forms-ui');

    function AutoCompleteController($scope) {

    }

    app.controller('AutoCompleteController', [ '$scope', AutoCompleteController ]);
    app.directive('autocomplete', /* @ngInject */["$log", "debugEnabled", "$filter", function($log, debugEnabled, $filter) {
        return {
            restrict : 'A',
            require : '^bbForm',
            controller : 'AutoCompleteController as controller',
            scope : {
                element : '='
            },
            link : function(scope, element, attrs, formsController) {
                function findByQuery(query, syncResults) {
                    var result = $filter('filter')(scope.element.options, {
                        displayValue : query
                    });
                    syncResults(result);
                }
                if (scope && scope.element && scope.element.options && typeof scope.element.options !== 'undefined') {
                    var context = (element.context) ? element.context : element[0];
                    var target = $(context);
                    // //----
                    var initialValue = $filter('filter')(scope.element.options, function(pOption) {
                        return pOption.value == scope.element.value[0];
                    });
                    // //----
                    element.typeahead({
                        minLength : scope.element.displayLength,
                        highlight : true
                    }, {
                        source : findByQuery,
                        limit : 10,
                        display : function(item) {
                            return item.displayValue;
                        },
                        templates : {
                            notFound : [ '<div class="tt-suggestion">', 'No results found', '</div>' ].join('\n')
                        }
                    });

                    if (initialValue.length) {
                        element.typeahead('val', initialValue[0].displayValue);
                    }

                    var handleChange = function(ev, suggestion) {
                        scope.element.value[0] = suggestion.value;
                        scope.$emit("update");
                    };

                    element.bind('typeahead:select', handleChange).bind('typeahead:autocomplete', handleChange).bind('typeahead:close', function() {
                        var matching = $filter('filter')(scope.element.options, function(value) {
                            return value.displayValue.toLowerCase() === element.typeahead('val').toLowerCase();
                        });
                        // No domain element with matching display value
                        if (element.typeahead('val') === '' || !matching.length) {
                            var currDomainEl = $filter('filter')(scope.element.options, {
                                value : scope.element.value[0]
                            });
                            var currValue = currDomainEl.length ? currDomainEl[0].displayValue : '';
                            element.typeahead('val', currValue);
                        } else {
                            element.typeahead('val', matching[0].displayValue);
                            handleChange(null, matching[0]);
                        }
                    });
                }

            }
        };
    }]);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'application-content',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf("application_content") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('applicationContentController', ["$scope", function ($scope) {
        $scope.headerButton=[];
        $scope.content=[];
        var child = $scope.element.children;

        for(var i=0; i <child.length; i++)
        {
            var temp =child[i];
           if(temp._e.type == 'button'){
               $scope.headerButton.push(temp);
           }
            else{
               $scope.content.push(temp);
           }
        }
        $scope.init = function(dataType, labelString){
            var inputArray = labelString.split("||");
            if(dataType === 'boolean' && inputArray.length === 2){
                $scope.label = inputArray[0];
                $scope.linkUrl = inputArray[1];
            } else {
                $scope.label = labelString;
            }
        };

    }]);
})();

(function() {
    'use strict';

     

    var app = angular.module('forms-ui');

    /**
     * Element directive (bbControl)
     * This directive is designed to render single controls. It expects and element object as an attribute
     */
    angular.module('forms-ui').directive('breadcrum',  /*@ngInject*/ function () {
        return {
            restrict: 'A',
            scope: {
                breadcrumbs: '='
            },
            link: function(scope, element, attrs, formsController, $filter) {

                var children = [],
                    parentClassNames = '', i, l,
                    child = {},
                    isPast = true;

                if(scope.breadcrumbs) {

                    if (scope.breadcrumbs.styles.length) {
                        parentClassNames = $filter('beautify')(scope.breadcrumbs.styles);
                    }

                    for (i = 0, l = scope.breadcrumbs.children.length; i < l; i++){
                        child = formsController.lookupElement(scope.breadcrumbs.children[i]);

                        if (child.properties && child.properties.isCurrent === true) {
                            isPast = false;
                        }

                        child.isCurrent = child.properties.isCurrent;
                        child.isPast = (!child.isCurrent && isPast) ? true : false;
                        child.isFuture = (!child.isPast && !child.isCurrent) ? true : false;

                        children.push(child);
                    }

                    scope.children = children;
                    scope.parentClassNames = parentClassNames;
                }
            }
        };
    });
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry, $document, $rootScope) {
        ComponentRegistry.registerElement({
            name: 'button',
            condition: function(el) {

                var checks = [                   
                    el.isButton
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                if(score.length === checks.length){
                    el.call=function () {
                    	if(el.styles.indexOf('confirm_redierct') > -1){
                            $rootScope.$broadcast('loadAccordionData');
                        }
                        $rootScope.$broadcast('utag', el.name);
                        if(el.styles.indexOf('table_record_deleted') > -1 ){
                            $rootScope.$broadcast('refreshFormData');
                        }
                        if(typeof $rootScope.project !== 'undefined' && $rootScope.project === 'onbording') {
                            //No action
                        } else {
                            angular.element($document[0].querySelector('#pageFocus')).focus();
                        }
                    };
                }

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry", "$document", "$rootScope"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'button-download',
            condition: function(el) {
                var checks = [
                    el.isButton,
                    el.name === 'downloadButton'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').directive('buttonDownload',  /*@ngInject*/ function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter) {
                var context = (element.context)?element.context:element[0];
                $scope.download = function () {
                    $scope.$emit("file-download-request");
                    $scope.$emit('update');
                };
            }
        };
    });

})();

(function () {
    /**
     * @ngInject
     */
    function registerElement(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'button-icon',
            condition: function (el) {
                var checks = [
                    el.isButton,
                    el.styles.indexOf('button_icon') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });
                return {score: score.length, totalMatch: score.length === checks.length};
            }

        });
    }
    registerElement.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerElement);
})();

(function() {
    angular.module('forms-ui').directive('buttonIcon',  /*@ngInject*/ function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter,$timeout) {
                var context = (element.context)?element.context:element[0];
                $scope.clicked = function () {
                    $scope.element.selected = true;
                    $scope.$emit('update');
                };
            }
        };
    });
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry, $document, $rootScope) {
        ComponentRegistry.registerElement({
            name: 'button-footer',
            condition: function(el) {
               
                var checks = [
                    el.name === 'SubmitNewForm' || el.name === 'ContinueWithPreviousForm',
                    el.styles.indexOf('footer_btn') > -1 ,
                    el.isButton

                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                if(score.length === checks.length){
                    el.utag=function () {
                        $rootScope.$broadcast('utag', el.name);
                        if(typeof $rootScope.project !== 'undefined' && $rootScope.project === 'onbording') {
                            //No action
                        } else {
                            angular.element($document[0].querySelector('#pageFocus')).focus();
                        }
                    };
                }

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry", "$document", "$rootScope"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'button-link',
            condition: function(el) {
                var checks = [
                    el.isButton,
                    el.styles.indexOf("button_external_link") >-1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').directive('buttonLink',  /*@ngInject*/ function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter) {
                var caption = $scope.$parent.element._e.caption.split('||');
                var context = (element.context)?element.context:element[0];
                $scope.caption = caption[0];
                $scope.link = caption[1];

            }
        };
    });

})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry, $document, $filter, $interval, $rootScope) {
        ComponentRegistry.registerElement({
            name: 'button-save-data',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf('save_progress_btn') > -1,
                    el.isButton
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                if(score.length === checks.length){
                    el.saveFormData=function () {
                        $rootScope.$broadcast('utag', el.name);
                        el.savingText=localStorage.getItem('locale')=='en-us'?'saving':(localStorage.getItem('locale')== 'zh-hk'?'儲存中' : '储存中');
                        el.isCaseID = angular.element($document[0].querySelector('#caseIDHidden')).context.innerText;
                        el.savedLastTime = angular.element($document[0].querySelector('#savedTimeHidden')).context.innerText;
                        if(typeof $rootScope.project !== 'undefined' && $rootScope.project === 'onbording') {
                            //No action
                        } else if(el.isCaseID === ''){
                            angular.element($document[0].querySelector('#pageFocus')).focus();
                        }
                        if (el.isCaseID !== ''){
                            el.saving = true;
                            var  promise= $interval(function () {
                                el.savedLatestTime = angular.element($document[0].querySelector('#savedTimeHidden')).context.innerText;
                                if (el.savedLastTime != el.savedLatestTime) {
                                    el.saving = false;
                                    el.savedNewTime = angular.element($document[0].querySelector('#savedTextHidden')).context.innerText + ' ' + $filter('date')(new Date(), 'HH:mm');
                                    $interval.cancel(promise);
                                }
                            }, 1);
                        }
                    };
                }
                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry", "$document", "$filter", "$interval", "$rootScope"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'button-tooltip',
            condition: function(el) {
                var checks = [
                    el.isButton,
                    el.styles.indexOf('button_tooltip') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('ButtonTooltipController', ["$scope", "$rootScope", "$timeout", function ($scope, $rootScope, $timeout) {
        var caption = $scope.$parent.element._e.caption.split('||');
        $scope.btnText = caption[0];
        $scope.tooltipText = caption[1];
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
    }]);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'button-unauthorized',
            condition: function(el) {
                var checks = [
                    el.isButton,
                    el.name === 'Unauthorized'

                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'checkbox-group',
            controller: 'CheckboxGroupController as cbg',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf('render_accordion') == -1 || el.styles.indexOf('render-accordion') == -1,
                    el.hasOptions,
                    el.multiple
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();

(function() {

    /**
     * Controller for checkbox-group components
     * Adds a mapper between options and values to local scope
     * @ngInject
     */
    function CheckboxGroupController($scope) {
        var ctrl = this;
        var element = $scope.element;

        ctrl.valueMap = {};
        element.options.forEach(mapValues);

        ctrl.updateValues = function() {
            var options = element.options;
            var index = options.length;
            var values = [];

            while (index--) {
                if (ctrl.valueMap[index]) {
                    values.unshift(options[index].value);
                }
            }

            element.value = values;
        };

        function mapValues(option, index) {
            if (element.value.indexOf(option.value) > -1) {
                ctrl.valueMap[index] = true;
            }
        }
    }
    CheckboxGroupController.$inject = ["$scope"];

    angular.module('forms-ui').controller('CheckboxGroupController', CheckboxGroupController);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'collapsing-button',
            condition: function(el) {
                var checks = [
                    el.isButton,
                    el.classList.indexOf("submit-button") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').directive('collapsingButton',  /*@ngInject*/ function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter) {
                var context = (element.context)?element.context:element[0];
                $scope.collapse = function () {
                 $scope.$emit('collapse-section');
                    $scope.$emit('update');
                };
            }
        };
    });

})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'container',
            condition: function(el) {
                var checks = [
                    el.isContainer
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('ContainerContainer', ["$scope", function ($scope) {
        $scope.init = function() {
            if(typeof $scope.element !== 'undefined' && typeof $scope.element.styles !== 'undefined' && $scope.element.styles.indexOf('overlay') > -1) {
                var topElement = $('#hsbc-odct-header').offset();
                if(typeof topElement.top !== 'undefined') {
                    $( 'html, body' ).scrollTop(topElement.top);
                }
            }
        };
    }]);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry , $document) {
        ComponentRegistry.registerElement({
            name: 'container-accordion',
            condition: function(el) {
                var checks = [
                    el.contentStyle === 'AccordionContainer',
                    el.isContainer
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                if( score.length === checks.length ){
                    el.callAccordion = function () {
                        var checkId = document.getElementById(el._e.key);
                        if(checkId.checked){
                            return true;
                        } else {
                            return false;
                        }
                    };
                }

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry", "$document"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry, $rootScope) {
        ComponentRegistry.registerControl({
            name: 'checkbox-group-accordion',
            controller: 'CheckboxGroupController as cgb',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf('render_accordion') > -1 || el.styles.indexOf('render-accordion') > -1,
                    el.hasOptions,
                    el.multiple
                ];

                var score = checks.filter(function (value) {
                    return value;
                });
                
                if(el.styles.indexOf('render_accordion') > -1){
                    $rootScope.$on('loadAccordionData',function(){
                        el.value=[];
                    });
                    }
                    el.callinit= function(value){
                        value={};
                        return value;
                    };

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry", "$rootScope"];

    angular.module('forms-ui').run(registerComponent);
})();

(function() {

    /**
     * Controller for checkbox-group components
     * Adds a mapper between options and values to local scope
     * @ngInject
     */
    function CheckboxGroupController($scope) {
        var ctrl = this;
        var element = $scope.element;

        ctrl.valueMap = {};
        element.options.forEach(mapValues);

        ctrl.updateValues = function() {
            var options = element.options;
            var index = options.length;
            var values = [];

            while (index--) {
                if (ctrl.valueMap[index]) {
                    values.unshift(options[index].value);
                }
            }

            element.value = values;
        };

        function mapValues(option, index) {
            if (element.value.indexOf(option.value) > -1) {
                ctrl.valueMap[index] = true;
            }
        }
    }
    CheckboxGroupController.$inject = ["$scope"];

    angular.module('forms-ui').controller('CheckboxGroupController', CheckboxGroupController);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'container-dash-line',
            condition: function(el) {
                var checks = [
                    el.contentStyle === 'DashLineContainer',
                    el.isContainer
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'container-icon',
            condition: function(el) {
                var checks = [
                    el.contentStyle === 'IconContainer',
                    el.isContainer
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'container-recaptcha',
            condition: function(el) {
                var checks = [
                    el.contentStyle === 'BB_Recaptcha',
                    el.isContainer
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
   /**
   * This directive is designed to render Google Recaptcha
   * We use sitekey and secretkey for domain backbasecloud.com
   * Keys lay in the backbase.properties file
   */


(function() {
    angular.module('forms-ui').directive('recaptcha',  /*@ngInject*/ function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter) {
                var context = (element.context)?element.context:element[0];
                var sitekey = $scope.element.properties['data-sitekey'];

                $scope.siteKey = sitekey;
                var firstChild = null;

                $scope.$watch ("element.children",function (pNuChildren,oldChild) {
                    if (pNuChildren && pNuChildren.length) firstChild = pNuChildren[0];
                });
                
                function checkForCaptcha () {
                    try  {
                        captchaReady();
                    }catch (err) {
                        setTimeout(checkForCaptcha,250);
                    }
                }

                function captchaReady () {
                      grecaptcha.render(
                        context.querySelector(".google_captcha_holder"), {
                            "sitekey": sitekey,
                            "callback": function(response){
                                if (firstChild) {
                                    firstChild.value[0]= response;
                                    $scope.$emit('update');
                                }
                            }
                        });
                }
               setTimeout (checkForCaptcha,250);
            }
        };
    });

})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'amendment-list',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf("amendment_list") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').directive('amendmentList',  /*@ngInject*/ function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter) {
                $scope.collapse = false;
                var context = (element.context)?element.context:element[0];

                $scope.$on("collapse-amendments-list",function () {
                    //context.style.height = context.getBoundingClientRect().height + "px";
                    setTimeout(function () {
                        $scope.collapse = true;
                        $scope.$evalAsync();
                    }, 50);
                });

                $scope.$on("open-amendments-list",function () {
                    //context.style.height = context.getBoundingClientRect().height + "px";
                    setTimeout(function () {
                        $scope.collapse = false;
                        $scope.$evalAsync();
                    }, 50);
                });



            }
        };
    });

})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'container-review-icon',
            condition: function(el) {
                var checks = [
                    el.contentStyle === 'IconReviewContainer',
                    el.isContainer
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'container-review-warning',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf('review_change_warning') > -1,
                    el.isContainer
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'content-item',
            condition: function(el) {
                var checks = [
                    el.type === 'contentitem'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score:score.length,totalMatch:score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'content-item-h3',
            condition: function (el) {
                var checks = [
                    el.type === 'contentitem',
                    el.contentStyle === 'Heading3'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'button-edit',
            condition: function(el) {
                var checks = [
                    el.isButton,
                    el.classList.indexOf("edit-control") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').directive('buttonEdit',  /*@ngInject*/ function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter) {
                var context = (element.context)?element.context:element[0];
                $scope.edit = function () {
                    $scope.$emit('open-section');
                    $scope.$emit('update');
                };
            }
        };
    });

})();

(function () {
    /**
     * @ngInject
     */
    function registerElement(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'custom-radio-group',
            controller: 'CustomRadioGroupController as controller',
            condition: function (el) {
                var checks = [
                    el.hasOptions,
                    !el.multiple,
                    ( el.styles.indexOf('radio') > -1 && el.styles.indexOf('review_change') == -1 )|| ( el.styles.indexOf('options_vertical') > -1 && el.styles.indexOf('review_change') == -1 || el.styles.indexOf('options_horizontal') > -1 && el.styles.indexOf('review_change') == -1)
                ];
                

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }

        });
    }
    registerElement.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerElement);
})();

(function() {

    /**
     * Controller for checkbox-group components
     * Adds a mapper between options and values to local scope
     * @ngInject
     */
    function RadioGroupController($scope) {
        this.dataElement = $scope.$parent.element._e;
    }
    RadioGroupController.$inject = ["$scope"];

    angular.module('forms-ui').controller('CustomRadioGroupController', ['$scope', RadioGroupController]);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'download-container',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.contentStyle === "filedownload"
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
   /**
   * This directive is designed to render Google Recaptcha
   * We use sitekey and secretkey for domain backbasecloud.com
   * Keys lay in the backbase.properties file
   */


(function() {
    angular.module('forms-ui').directive('downloadContainer',  /*@ngInject*/ ["$http", function ($http) {
        return {
            restrict: 'A',
            require: {
                form: '^^bbForm'
            },
            link: function ($scope, element, attrs,formsController) {
                var context = (element.context)?element.context:element[0];
                $scope.configurationId = $scope.$parent.element.properties.configurationid;
                $scope.$on("file-download-request",function (evt) {
                    var form =formsController.form;
                    var sessionConfig = form.config;

                    function makeUrl(runtimeUrl, sessionId, pFileDownloadId) {
                        return runtimeUrl + '/server/session/' + sessionId + '/filedownload/' + pFileDownloadId +'';
                    }

                    var url = makeUrl(sessionConfig.runtimePath, sessionConfig.sessionId, $scope.configurationId);
                    $http({method: 'GET',url: url+'/checkauthorization'}).then(function (response) {
                        window.open(url);
                    }, function errorCallback(response) {
                    	
                    });


                });


            }
        };
    }]);

})();
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'content-item-list',
            condition: function (el) {
                var checks = [
                    el.type === 'contentitem',
                    el.contentStyle === 'List'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'field',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf('render_accordion') == -1 && el.styles.indexOf('review_change') == -1 ,
                    el.isField
                ];

                var score = checks.filter(function (value) {
                    return value;
                });
                el.toolTipText = function () {
                    if(el.description.indexOf('|')> -1){
                       el.newDesc=el.description.substring(0,el.description.indexOf('|')-1);
                    } else{
                       el.newDesc=el.description;
                    }
                };
                el.close= function () {
                    angular.element('#logoutPopUp-'+el.key).click();
                };

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'field-accordion',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf('render_accordion') > -1 || el.styles.indexOf('render-accordion') > -1,
                    el.isField
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'dropdown',
            condition: function(el) {
                var checks = [
                    el.hasOptions,
                    !el.multiple
                ];
                el.setPlaceHolder= function () {
                    if(typeof el._e !== 'undefined' && typeof el._e.explainText === 'string') {
                        el.placeHolderText = el._e.explainText.substring(el._e.explainText.indexOf('|') + 2);
                   }
                };
                var score = checks.filter(function (value) {
                    return value;
                });
                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
        }
        registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {

    angular.module('forms-ui').controller('DropdownCtrl', ["$scope", function ($scope) {
        var options = $scope.element.options;
        var dropdownKey = $scope.element.key;
        var optionsLength = options.length;
        var isValueExist = ($scope.element.value.length > 0 && typeof $scope.element.value[0] !== 'undefined' && $scope.element.value[0] !== '');
        $scope.elementId = $scope.element.key;
        $scope.dropdownId = $scope.element.key + '-Dropdown-Container';
        $scope.optionIdPrefix = $scope.element.key + '-Dropdown-Option-';
        $scope.currentIndex = -1;
        $scope.isOpen = false;
        $scope.selectedValue = '';
        $scope.triggerDropdoen = function (event) {
            $scope.isOpen = !$scope.isOpen;
            if(event) {
                event.stopPropagation();
            }
        };
        $scope.onBlur =  function () {
            $scope.isOpen=false;

        };

        $scope.addSelectedValue = function(option, index){
            if(isValueExist && option.value === $scope.element.value[0]) {
                $scope.selectedValue = option.displayValue;
                $scope.currentIndex = index;
            }
        };

        $scope.select = function(option, index){
            $scope.isOpen = !$scope.isOpen;
            $scope.selectedValue = option.displayValue;
            $scope.element.value = [option.value];
            $scope.$emit('update');
            $scope.currentIndex = index;
            scrollToElement();
        };

        $scope.keyDown = function (event) {
            if(event.keyCode ===40){
                moveDown();
                event.preventDefault();
            }
            if(event.keyCode ===38){
                moveUp();
                event.preventDefault();
            }
            if(event.keyCode === 9 || event.keyCode === 13) {
                $scope.isOpen = false;
            }
        };

        function moveDown() {
            $scope.currentIndex = (optionsLength - 1 > $scope.currentIndex) ? $scope.currentIndex + 1 : 0;
            var option = options[$scope.currentIndex];

            $scope.selectedValue = option.displayValue;
            $scope.element.value = [option.value];
            scrollToElement();
            $scope.$emit('update');
        }

        function moveUp() {
            $scope.currentIndex = ($scope.currentIndex > 0) ? $scope.currentIndex - 1 : optionsLength - 1;
            var option = options[$scope.currentIndex];

            $scope.selectedValue = option.displayValue;
            $scope.element.value = [option.value];
            scrollToElement();
            $scope.$emit('update');
        }

        function scrollToElement() {
            var container = angular.element('#' + $scope.dropdownId),
                scrollTo = angular.element('.' + $scope.optionIdPrefix + $scope.currentIndex);

            container.scrollTop(
                scrollTo.offset().top - container.offset().top + container.scrollTop()
            );
        }

        angular.element('body').click(function (event) {
            $scope.isOpen = false;
            $scope.$apply();
        });
    }]);

})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'field-container',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf("concatenated_field") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'failed-element',
            condition: function(el) {
                var checks = [
                    el.type === 'failedelement'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'field-custom-layout',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf("custom_layout") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'field-review',
            condition: function(el) {
                if('domain' in el._e){
                    var multipleValues= [];
                    if(el._e.domain.length > 1 && el._values.length >1 ) {
                        //alert(el.value[0]);
                        for(var i=0; i<el._e.values.length;i++){
                            for(var k=0;k<el._e.domain.length;k++){
                                if(el._values[i] == el._e.domain[k].value){
                                    multipleValues.push(el._e.domain[k].displayValue);
                                }
                            }
                        }
                    } else if(el._e.domain.length > 1 && el._e.displayLength == -1 || el._e.displayLength > 1) {
                        //alert(el.value[0]);
                        for(var j=0; j<el._e.domain.length;j++){
                            if( el._e.domain[j].value == el._values[0]){
                                multipleValues.push(el._e.domain[j].displayValue);
                            }
                        }
                    }
                    if(multipleValues.length >=1 ) {
                        el.multipleValues=multipleValues;
                    }
                }
                var checks = [
                    el.styles.indexOf('review_change') > -1 || el.styles.indexOf('review-change') > -1,
                    el.isField
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})(); 
(function() {

    /**
     * @ngInject
     */
    function registerElement(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'file-upload',
            condition: function(el) {
                var checks = [
                    el.contentStyle === 'fileupload',
                    el.isContainer
                ];

                var score = checks.filter(function (value) {
                    return value;
                });
                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerElement.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerElement);

})();

(function () {
    angular.module('forms-ui').directive('fileUploadContent', ["Upload", function (Upload) {
        return {
            require: {
                form: '^^bbForm'
            },
            restrict: 'A',
            link: function ($scope, element, attrs, formsController) {
                var context = (element.context) ? element.context : element[0];
                var updateChild;

                function makeUrl(runtimeUrl, sessionId, subscription, fileuploadID) {
                    return runtimeUrl + '/server/session/' + sessionId + '/subscription/' + subscription + '/fileupload/' + fileuploadID + '/';
                }

                function createTypeFilePattern(str) {
                    var pattern, arr, i, l;
                    arr = str.split('|') || [];
                    for (i = 0, l = arr.length; i < l; i++) {
                        arr[i] = '.' + arr[i];
                    }

                    pattern = arr.join(',');
                    return pattern;
                }

                var url, allowedExtensions, maxFileSize;


                var uploadProperties = $scope.element.properties;

                allowedExtensions = createTypeFilePattern(uploadProperties.allowedextensions || '');

                maxFileSize = uploadProperties.maxfilesize || "";
                maxFileSize = maxFileSize.toString();

                //--
                var form = formsController.form;
                var sessionConfig = form.config;
                var matchingList = {};


                url = makeUrl(sessionConfig.runtimePath, sessionConfig.sessionId, sessionConfig.sessionId, uploadProperties.configurationid);

                $scope.maxFileSize = maxFileSize;
                $scope.allowedExtensions = allowedExtensions;
                $scope.uploaded = [];


                // upload on file select or drop
                $scope.upload = function (file) {
                    //console.log("UploadSelection:: ", file);
                    if (!file)
                        return;

                    Upload.upload({
                        url: url,
                        headers: {
                            "X-CSRF-Token": form.model.csrfToken
                        },
                        file: file
                    }).progress(function (evt) {
                        $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.progressStyle.width = $scope.progress + '%';
                    }).success(function (data) {
                        //console.log("uploadSuccess:",data);
                        setTimeout(function () {
                            formsController.form.handleUpdates({data: data});
                        }, 1000);
                        $scope.$emit('update');
                    }).error(function (data) {
                        //console.log("upload error", data);
                        $scope.$emit("update");
                    }).finally(function () {
                        $timeout(function () {
                            $scope.progress = 0;
                            $scope.progressStyle.width = 0;
                        }, 300);
                    });
                };

                $scope.uploadError = function () {
                    if ($scope.element.children.length) {
                        return $scope.element.children.filter(function (e) {
                                var el = formsController.lookupElement(e);
                                return el.name == 'errorMessages';
                            }).length > 0;
                    }

                    return false;
                };

                $scope.filterChildren = function () {
                    return $scope.element.children.filter(function (e) {
                        var el = formsController.lookupElement(e);
                        return el.name != 'FileUploaded';
                    });
                };

                $scope.progress = 0;

                $scope.progressStyle = {
                    width: 0
                };

            }
        };
    }]);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'form-table-with-sorting',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf("hsbc_table_with_sorting") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('TableController', ["$scope", function ($scope) {


        $scope.sortType = "";
        $scope.sort = false;

    }]);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry, $document) {
        ComponentRegistry.registerElement({
            name: 'hsbc-btn-primary',
            condition: function(el) {

                var checks = [                   
                    el.isButton,
                    el.styles.indexOf('hsbc_btn_primary') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry", "$document"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('PrimaryButtonController', ["$scope", "$rootScope", "$timeout", function ($scope, $rootScope, $timeout) {
        var elementName = $scope.element._e.name;
        var updaterefreshThis = false;
        $scope.update = function() {
            var connectedIndividualHKID = $('input[name="ConnectedIndividual.hKID"]').val();
            var connectedIndividualHKIDExt = $('input[name="ConnectedIndividual.hKIDExt"]').val();
            hkidValidate(connectedIndividualHKID,connectedIndividualHKIDExt);
            if($("#notediv").length>0){
            var html='<div ng-repeat="child in element.children track by child.key" ng-controller="FormNotificationController" class="ng-scope"><div class="form-notification  error-notification" role="alert"><div class="notification-icon"></div><div class="notification-wrapper"><p id="P753-C1-C2-TI2" aria-label="There are some errors on the page. Please make relevant changes to proceed further " ng-bind-html="child._e.nodes | formatContentItem" class="error-notification">There are some errors on the page. Please make relevant changes to proceed further </p></div></div></div>';
            $('bb-element[data-key="P753-C1-C2"]').html(html);
            document.body.scrollTop=0;
            return false;
            }
            $('bb-element[data-key="P753-C1-C2"]').html("");
            $scope.$emit('update');
            updaterefreshThis = true;
           /* $timeout(function() {
                var topElement = $('#hsbc-odct-header').offset();
                if(typeof topElement.top !== 'undefined') {
                    $( 'html, body' ).scrollTop(topElement.top);
                }
            }, 1000);*/
        };
        $rootScope.$on('updateUtag',updateRefresh);
        function updateRefresh() {
            if(updaterefreshThis) {
                updaterefreshThis = false;
                $timeout(function() {
                    $scope.$emit('EEventCheckAndSetErrorAndChangeFocus');
                    $rootScope.$broadcast('BEventToRefreshTableData');
                    $rootScope.$broadcast('utag', elementName);
                }, 500);
            }
        }
    }]);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'html-block',
            condition: function(el) {
                var checks = [
                    el.type === 'asset'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'input-checkbox',
            condition: function(el) {
                var checks = [
                    el.dataType === 'boolean'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();

(function () {
    angular.module('forms-ui').directive('inputCheckbox', function () {
        return {

            restrict: 'A',
            link: function ($scope, element, attrs, formsController) {
                var context = (element.context) ? element.context : element[0];
                var foundElement = !$scope.element;
                while (!foundElement) {
                    if ($scope.$parent) foundElement = $scope.$parent.element;
                    else foundElement = 1;
                }

                if (foundElement && foundElement != 1) {
                    $scope.$parent.element = foundElement;
                }

            }
        };
    });
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'input-currency',
            condition: function(el) {
                var checks = [
                    el.dataType === 'currency'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'input-date',
            controller: 'BootstrapDatepickerController as controller',
            condition: function(el) {
                var checks = [
                    el.dataType === 'date'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();

(function () {

    /**
     * Controller for stepped-slider components
     * Adds a mapper between options and values to local scope
     * @ngInject
     */
    function BootstrapDatepickerController($scope) {
        var element = $scope.element;
        $scope.showCustom = (element.styles.indexOf("custom_datepicker") > -1);
    }
    BootstrapDatepickerController.$inject = ["$scope"];
    function CustomDate($scope) {
        var element = $scope.element;
        $scope.dd = '';
        $scope.mm = '';
        $scope.yyyy = '';
        $scope.date = element.value[0];
        $scope.dateArray = [];
        if($scope.date) {
            $scope.dateArray = $scope.date.split("-");
        }
        if($scope.dateArray.length > 0){
            $scope.yyyy = $scope.dateArray[0];
            $scope.mm = $scope.dateArray[1];
            $scope.dd = $scope.dateArray[2];
        }
        $scope.blurFromDate = function () {
        	
        };
        $scope.updateDate = function() {
            if(typeof $scope.yyyy !== 'undefined' && $scope.yyyy !== '' && typeof $scope.mm !== 'undefined' &&  $scope.mm !== '' && typeof $scope.dd !== 'undefined' &&  $scope.dd !== '') {
                element.value[0] = $scope.yyyy + "-" + $scope.mm + "-" + $scope.dd;
                $scope.$emit('update');
            } else {
                element.value[0] = '';
                $scope.$emit('update');
            }
        };
    }

    angular.module('forms-ui').controller('BootstrapDatepickerController', ['$scope', BootstrapDatepickerController]);
    angular.module('forms-ui').controller('CustomDate', ['$scope', CustomDate]);
    angular.module('forms-ui').directive('numbersOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });
    angular.module('forms-ui').directive('bootstrapDatepicker', function () {
        return {
            restrict: 'C',
            controller: 'BootstrapDatepickerController as controller',
            template: '<input type="text" class="form-control" ' +
            'name="{{element.name}}" ' +
            'id="{{element.key}}" ' +
            'ng-required="{{element.required}}" ' +
            'ng-disabled="{{element.disabled}}" ' +
            'ng-readonly="{{element.readOnly}}"' +
            'ng-value="{{element.value}}"' +
            "ng-class={'has-error':element.hasError}" +
            ' novalidate />' +
            '<span class="input-group-addon"> ' +
            ' <i class="icon icon-calendar "></i></span>',
            link: function ($scope, element, attrs,$filter) {
                var context = (element.context)?element.context:element[0];
                var target = $(context);
                var input = target[0].querySelector("input");

                if(typeof(target.datepicker) === 'function'){
                    target.datepicker({format: 'yyyy-mm-dd', autoclose: true, container:target[0]});
                }

                target.on('changeDate', function (e) {
                    $scope.element.value = [input.value];
                    $scope.$emit('update');
                    $scope.$evalAsync();
                });

            }
        };
    });
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'download-pdf',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf("download_pdf") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('downloadPdfController', ["$scope", function ($scope) {
    $(document).ready(function(){
                var doc = new jsPDF();

                function logo(x, y, width, height){
                    var logo = 'data:image/jpeg;base64,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AEgAAABIAAAAAAAAAAAAAADQAgAAQAIAAAAAAAAAAAAAGAMAAGQCAAAAAcADAACwBAAAAQAPJwEAbGx1bgAAAAAAAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAQBIAAAAAQABOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAAB4OEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNBAoAAAAAAAEAADhCSU0nEAAAAAAACgABAAAAAAAAAAI4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQAAAAAAAACAAE4QklNBAIAAAAAAAQAAAAAOEJJTQQwAAAAAAACAQE4QklNBC0AAAAAAAYAAQAAAAI4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADSQAAAAYAAAAAAAAAAAAAAL4AAAGuAAAACgBVAG4AdABpAHQAbABlAGQALQAxAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAGuAAAAvgAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAABAAAAABAAAAAAAAbnVsbAAAAAIAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAAAvgAAAABSZ2h0bG9uZwAAAa4AAAAGc2xpY2VzVmxMcwAAAAFPYmpjAAAAAQAAAAAABXNsaWNlAAAAEgAAAAdzbGljZUlEbG9uZwAAAAAAAAAHZ3JvdXBJRGxvbmcAAAAAAAAABm9yaWdpbmVudW0AAAAMRVNsaWNlT3JpZ2luAAAADWF1dG9HZW5lcmF0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YmUuY29tL2V4aWYvMS4wLyIgZGM6Zm9ybWF0PSJpbWFnZS9qcGVnIiB4YXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzMgV2luZG93cyIgeGFwOkNyZWF0ZURhdGU9IjIwMTItMDEtMTNUMTc6MTU6MTIrMDU6MDAiIHhhcDpNb2RpZnlEYXRlPSIyMDEyLTAxLTEzVDE3OjE1OjEyKzA1OjAwIiB4YXA6TWV0YWRhdGFEYXRlPSIyMDEyLTAxLTEzVDE3OjE1OjEyKzA1OjAwIiB4YXBNTTpEb2N1bWVudElEPSJ1dWlkOjg5M0U0QjE1RTAzREUxMTFCNUZFOUUwNEM0NzlEQzAzIiB4YXBNTTpJbnN0YW5jZUlEPSJ1dWlkOjhBM0U0QjE1RTAzREUxMTFCNUZFOUUwNEM0NzlEQzAzIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHBob3Rvc2hvcDpIaXN0b3J5PSIiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiB0aWZmOk5hdGl2ZURpZ2VzdD0iMjU2LDI1NywyNTgsMjU5LDI2MiwyNzQsMjc3LDI4NCw1MzAsNTMxLDI4MiwyODMsMjk2LDMwMSwzMTgsMzE5LDUyOSw1MzIsMzA2LDI3MCwyNzEsMjcyLDMwNSwzMTUsMzM0MzI7MENGRjk5QjI3QTU1RTRFNzg3RDE2NkY4QzZDNTJENkMiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI0MzAiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxOTAiIGV4aWY6Q29sb3JTcGFjZT0iMSIgZXhpZjpOYXRpdmVEaWdlc3Q9IjM2ODY0LDQwOTYwLDQwOTYxLDM3MTIxLDM3MTIyLDQwOTYyLDQwOTYzLDM3NTEwLDQwOTY0LDM2ODY3LDM2ODY4LDMzNDM0LDMzNDM3LDM0ODUwLDM0ODUyLDM0ODU1LDM0ODU2LDM3Mzc3LDM3Mzc4LDM3Mzc5LDM3MzgwLDM3MzgxLDM3MzgyLDM3MzgzLDM3Mzg0LDM3Mzg1LDM3Mzg2LDM3Mzk2LDQxNDgzLDQxNDg0LDQxNDg2LDQxNDg3LDQxNDg4LDQxNDkyLDQxNDkzLDQxNDk1LDQxNzI4LDQxNzI5LDQxNzMwLDQxOTg1LDQxOTg2LDQxOTg3LDQxOTg4LDQxOTg5LDQxOTkwLDQxOTkxLDQxOTkyLDQxOTkzLDQxOTk0LDQxOTk1LDQxOTk2LDQyMDE2LDAsMiw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwyMCwyMiwyMywyNCwyNSwyNiwyNywyOCwzMDsxREI0RjREQzBDM0U1QUU3QUY5NkVBMkU5QjBBQkQ5NyI+IDx4YXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ1dWlkOjg4M0U0QjE1RTAzREUxMTFCNUZFOUUwNEM0NzlEQzAzIiBzdFJlZjpkb2N1bWVudElEPSJ1dWlkOjg4M0U0QjE1RTAzREUxMTFCNUZFOUUwNEM0NzlEQzAzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNk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AAIRAxEAPwDf49+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/0N/j37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//R3+Pfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X/9Lf49+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/09/j37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//U3+Pfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X/9Xf49+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/1t/j37r3RK/lH3Z8y+rNwbXx/wAY/g9jfldgMpha2t3PuGt+UXX3Qcm1cxBWiCjwkWG3ntLcVRnxW0X7/wBzFJFHGfQwvz7917rXE+Xv/Cq3tL4F9pydM/LT+UX3R07v40Jy2Mo8v8jdl5TBbmwn3EtIue2du3BdX5LbO7cIaiFozUUFVMsUqmOXRIrIPde6Ksv/AAuI6pdgqfy7uxGZiFVV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APZLa/8AWrr3/DCP8sUWK9HbgRgQVZO2u0EdWFirI67pDI6kXBBBBFx7svtByArBl2SjA4Ikkr/x7qkn94x97qaN4Zvc8vCwIZWtLUqwOCCDFQgjiD1ZP0n8f+rvj7gsxgutNvvjjuTLruDdm4Mtk8juPeG8s8lDS4uLM7w3bnKitz25MlT4uhgpopaqeRkhiCj8kjrbtqsdpjlSyh0l21MTVnY0ABZjVmIAABJwOsUOc+fuaef720veZty8UW0RjgiRVjgt4yzSFIIECxxKzszsEUAsanyoNPsy6BvXvfuvde9+691737r3Xvfuvdf/0N/j37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//R3+Pfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X/9Lf49+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/09/j37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//U3+Pfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X/9Xf49+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/1t/j37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//Z';
                    doc.addImage(logo, 'JPEG', x, y, width, height);
                }

                function title(text, x, y){
                    doc.setFontSize(14);
                    doc.text(text, x, y);
                }

                function inputQuestion(question, answer, x, y){
                    var splitTitle = doc.splitTextToSize(question, 180);

                    doc.setLineWidth(0.2);
                    doc.setFontSize(11);
                    doc.text(splitTitle, x, splitTitle.length > 1 ? y - 4 : y); // Question Text
                    doc.rect(x, y + 4, 180, 10); // Answer rectangle
                    doc.text(answer, x + 2, y + 10); // Answer text inside rectangle
                }

                // radioButton("Is your 'Trading As' or 'Doing Business As' name(s) " + "different from the full legal name?", {'Yes': true, 'No':false}, 13, 73);
                function radioButton(questionText, options, startX, startY) {
                    doc.setFontSize(11);
                    doc.text(questionText, startX, startY);
                    doc.setLineWidth(0.2);
                    doc.setDrawColor(0);

                    startY += 10;

                    Object.keys(options).forEach(function(key){
                        doc.setFillColor(0, 0, 0);
                        if (key in options) doc.setFillColor(255, 255, 255);

                        doc.circle(startX + 1, startY, 2, 'FD');
                        doc.text(key, startX + 5, startY + 1);

                        startX += 45;
                    });
                }

                //
                // Parse elements
                //

                var elemHTML = $("h2:contains('PDF_content_to_render')").nextAll(),
                    formGroups = $(elemHTML).find('.form-group');

                logo(10, 5, 43, 19);
                title('Basic details', 13, 30);

                // main
                var startY = 40;

                formGroups.each(function(i, fg){
                    var label = $($(fg).find('.control-label')[0]).text(),
                        value = $($(fg).find('.form-control-static')[0]).text();

                    inputQuestion(label, value, 13, startY);
                    startY += 27;
                });

                $('#generatePDF').click(function(){
                    doc.save('a4.pdf');
                });

            });

    }]);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'input-integer',
            condition: function(el) {
                var checks = [
                    el.dataType === 'integer' || el.dataType === 'number'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * Controller for stepped-slider components
     * Adds a mapper between options and values to local scope
     * @ngInject
     */
     angular.module('forms-ui').directive('numbersOnly', function () {
         return {
             require: 'ngModel',
             link: function (scope, element, attr, ngModelCtrl) {
                 function fromUser(text) {
                     if (text) {
                         var transformedInput = text.replace(/[^0-9]/g, '');

                         if (transformedInput !== text) {
                             ngModelCtrl.$setViewValue(transformedInput);
                             ngModelCtrl.$render();
                         }
                         return transformedInput;
                     }
                     return undefined;
                 }
                 ngModelCtrl.$parsers.push(fromUser);
             }
         };
     });
})();

(function() {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'input-password',
            condition: function(el) {
                var checks = [
                    el.hasOptions,
                    !el.multiple,
                    el.styles.indexOf('password') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'input-percentage',
            condition: function(el) {
                var checks = [
                    el.dataType === 'percentage'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('inputController', ["$scope", function ($scope) {
        $scope.fieldType = 'text';
        $scope.isPassword = false;
        $scope.init = function(elementData){
            $scope.fieldType = (elementData.styles.indexOf('percentage') > -1) ? 'percentage' : $scope.fieldType;
            $scope.isPassword = (elementData.styles.indexOf('percentage') > -1);
        };
        $scope.changeFieldType = function(type) {
            $scope.fieldType = type;
            $scope.$apply();
        };
    }]);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'input-phone',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf('phone') > -1,
                    el.dataType === 'text',
                    !el.hasDomain
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();

(function() {
    angular.module('forms-ui').controller('inputController', ["$scope", function ($scope) {
        var element = $scope.element;
        $scope.ngModel = element.value[0];
        $scope.updateElement = function(model){
            if(typeof(model) !== 'undefined') {
                var newValue= model;
                $scope.ngModel = newValue;
            }
            $scope.element.value[0] = $scope.ngModel;
            $scope.$emit('update');
        };
    }]);
})();

(function() {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'input-text',
            condition: function(el) {
                var checks = [
                    el.dataType === 'text',
                    !el.hasDomain
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                if(score.length === checks.length){
                    el.callInit = function () {
                        if(el._e.explainText !== null){
                            var indexText = el._e.explainText.indexOf('|');
                            if(typeof(indexText) !== 'undefined' && indexText > -1){
                                el.placholderText=el.description.substring(el.description.indexOf('|')+2);
                                if(el.placholderText.indexOf('|')> -1){
                                    el.showText=el.placholderText.substring(0,el.placholderText.indexOf('|'));
                                    el.hideText=el.placholderText.substring(el.placholderText.indexOf('|')+1);
                                    el.placholderText='';
                                }
                            } else{
                                el.placholderText='';
                            }
                        }
                    };
                }

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();

(function() {
    angular.module('forms-ui').controller('inputController', ["$scope", function ($scope) {
        var element = $scope.element;
        $scope.ngModel = element.value[0];
        $scope.fieldType = 'text';
        $scope.isPassword = false;
        $scope.init = function(elementData){
            $scope.fieldType = (elementData.styles.indexOf('password') > -1) ? 'password' : $scope.fieldType;
            $scope.isPassword = (elementData.styles.indexOf('password') > -1);
        };
        $scope.changeFieldType = function(type) {
            $scope.fieldType = type;
            //$scope.$apply();
        };
        $scope.updateElement = function(model){
            if(typeof(model) !== 'undefined') {
                var newValue= model;
                $scope.ngModel = newValue;
            }
            if($scope.element.value[0] !==$scope.ngModel) {
                $scope.element.value[0] = $scope.ngModel;
                $scope.$emit('update');
            }
        };
    }]);
})();

(function() {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'input-text-retrieve-form',
            condition: function(el) {
                var checks = [
                    el.dataType === 'text',
                    el.styles.indexOf('retrieve_form_error_text') > -1,
                    !el.hasDomain
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                if(score.length === checks.length){
                    el.callInit = function () {
                        if(el._e.explainText !== null ){
                            if(typeof(indexText) !== 'undefined' && indexText > -1){
                                el.placholderText=el.description.substring(el.description.indexOf('|')+2);
                                if(el.placholderText.indexOf('|')> -1){
                                    el.showText=el.placholderText.substring(0,el.placholderText.indexOf('|'));
                                    el.hideText=el.placholderText.substring(el.placholderText.indexOf('|')+1);
                                    el.placholderText='';
                                }
                            } else{
                                el.placholderText='';
                            }
                        }
                    };
                }

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('inputController', ["$scope", function ($scope) {
        var element = $scope.element;
        $scope.ngModel = element.value[0];
        $scope.fieldType = 'text';
        $scope.isPassword = false;
        $scope.init = function(elementData){
            $scope.fieldType = (elementData.styles.indexOf('password') > -1) ? 'password' : $scope.fieldType;
            $scope.isPassword = (elementData.styles.indexOf('password') > -1);
        };
        $scope.changeFieldType = function(type) {
            $scope.fieldType = type;
            //$scope.$apply();
        };
        $scope.updateElement = function(model){
            if(typeof(model) !== 'undefined') {
                var newValue= model;
                $scope.ngModel = newValue;
            }
            $scope.element.value[0] = $scope.ngModel;
            $scope.$emit('update');
        };
    }]);
})();
(function() {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'link',
            controller: 'LinkController as Controller',
            condition: function(el) {
                var checks = [
                    el.type === 'link'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();

(function () {
    /**
     * @ngInject
     */
    function LinkController($scope) {
    }
    LinkController.$inject = ["$scope"];
    angular.module('forms-ui').controller('LinkController', ['$scope', LinkController]);
})();

(function () {
    /**
     * @ngInject
     */
    function registerControl(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'radio-field',
            condition: function (el) {
                var checks = [
                    el.hasOptions,
                    !el.multiple,
                    el.styles.indexOf('radio') > -1 || el.styles.indexOf('Radio') > -1 || el.styles.indexOf('options_vertical') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }

        });
    }
    registerControl.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerControl);
})();

(function() {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'input-datetime',
            controller: 'BootstrapDateTimePickerController as controller',
            condition: function(el) {
                var checks = [
                    el.dataType === 'datetime'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();

(function () {

    /**
     * Controller for stepped-slider components
     * Adds a mapper between options and values to local scope
     * @ngInject
     */
    function BootstrapDateTimePickerController($scope) {


    }
    BootstrapDateTimePickerController.$inject = ["$scope"];

    angular.module('forms-ui').controller('BootstrapDateTimePickerController', ['$scope', BootstrapDateTimePickerController]);
    angular.module('forms-ui').directive('bootstrapDatetimepicker', function () {
        return {
            restrict: 'C',
            controller: 'BootstrapDateTimePickerController as controller',
            template: '<input type="text" class="form-control" ' +
            'name="{{element.name}}" ' +
            'id="{{element.key}}" ' +
            'ng-required="{{element.required}}" ' +
            'ng-disabled="{{element.disabled}}" ' +
            'ng-readonly="{{element.readonly}}"' +
            'ng-value="{{element.value}}"' +
            "ng-class={'has-error':element.hasError}" +
            ' novalidate />' +
            '<span class="input-group-addon"> ' +
            '<span class="fa fa-calendar"></span></span>',
            link: function ($scope, element, attrs,$filter) {
                var context = (element.context)?element.context:element[0];
                var target = $(context);
                var input = target[0].querySelector("input");

                target.datetimepicker();
                target.on('changeDate', function (e) {
                    $scope.element.value = [input.value];
                    $scope.$emit('update');
                    $scope.$evalAsync();
                });
            }
        };
    });
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'lightbox',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf("lightbox") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();



(function() {
    angular.module('forms-ui').directive('lightbox',  /*@ngInject*/ ["$http", function ($http) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter) {
                var context = (element.context)?element.context:element[0];
            }
        };
    }]);

})();
(function () {
    /**
     * @ngInject
     */
    function registerElement(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'radio-group',
            controller: 'RadioGroupController as controller',
            condition: function (el) {
                var checks = [
                    el.hasOptions,
                    !el.multiple,
                    el.styles.indexOf('radio_group') > -1 || el.styles.indexOf('options_row') > -1
                ];
                

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }

        });
    }
    registerElement.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerElement);
})();

(function() {

    /**
     * Controller for checkbox-group components
     * Adds a mapper between options and values to local scope
     * @ngInject
     */
    function RadioGroupController($scope) {
        this.dataElement = $scope.$parent.element._e;
    }
    RadioGroupController.$inject = ["$scope"];

    angular.module('forms-ui').controller('RadioGroupController', ['$scope', RadioGroupController]);
})();

(function () {
    /**
     * @ngInject
     */
    function registerControl(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'radio-inline',
            condition: function (el) {
                var checks = [
                    el.hasOptions,
                    !el.multiple,
                    el.styles.indexOf('radio') > -1 || el.styles.indexOf('Radio') > -1 || el.styles.indexOf('options_inline') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }

        });
    }
    registerControl.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerControl);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry, $document) {
        ComponentRegistry.registerElement({
            name: 'save-my-progress',
            condition: function(el) {

                var checks = [                   
                    el.isButton,
                    el.styles.indexOf('save_my_progress') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry", "$document"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('SaveMyProgressButtonController', ["$scope", "$rootScope", "$timeout", function ($scope, $rootScope, $timeout) {
    	var elementName = $scope.element._e.name;
        $scope.update = function(el){
            $rootScope.$broadcast('SaveStatus');
            $rootScope.$broadcast('utag', elementName);
            $timeout(function(){
                $scope.$emit('update');
            }, 1000);
            $rootScope.$broadcast('saveProgress');
        };
    }]);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'scenario-selector',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf('scenario_selector') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').directive('scenarioSelector',  /*@ngInject*/ function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter) {
                $scope.collapse = false;
                var context = (element.context)?element.context:element[0];
                $scope.$on("collapse-scenario-selector",function () {
                    setTimeout(function () {
                        $scope.collapse = true;
                        $scope.$evalAsync();
                    }, 50);
                });

                $scope.$on("open-scenario-selector",function () {
                    setTimeout(function () {
                        $scope.collapse = false;
                        $scope.$evalAsync();
                    }, 50);
                });
            }
        };
    });

})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'page',
            condition: function(el) {
                var checks = [
                    el.isPage
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {
    'use strict';
    var app = angular.module('forms-ui');

    function PageMainController($scope) {

        $scope.$on('EEventToSetPDFData', function ($event) {
            $scope.$broadcast('BEventToSetPDFData');
        });

        $scope.$on('BEventToPageGeneratePDF', function ($event, data) {
            $scope.$broadcast('BEventToGeneratePDF', data);
        });

        $scope.$on('EEventSetHiddenValue', function($event, data) {
            $scope.$broadcast('BEventSetHiddenValue', data);
        });
    }

    app.controller('PageMainController', ['$scope', PageMainController]);
})();
(function () {
    'use strict';
    var app = angular.module('forms-ui');

    function PageErrorController($scope, $rootScope) {
        $scope.triggerSystemNotification = function() {
            $rootScope.$broadcast('triggerSystemNotification', $scope.element.messages);
        };
    }

    app.controller('PageErrorController', ['$scope', '$rootScope', PageErrorController]);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'statement-agree',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf("statement_agree") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').directive('statementAgree',  /*@ngInject*/ function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter) {
                $scope.collapse = false;
                var context = (element.context)?element.context:element[0];
            }
        };
    }).controller('statementAgreeController', ["$scope", function ($scope) {
        var element = $scope.element;
        $scope.statementAgreeValue = false;
        $scope.label = '';
        $scope.linkUrl = '';
        $scope.linkLabel = '';

        if((typeof element.value[0] === 'string' && element.value[0] === 'true') || (typeof element.value[0] === 'boolean')) {
            element.value[0] = true;
            $scope.statementAgreeValue = true;
        }
        $scope.updateField = function(){
            $scope.element.value[0] = $scope.statementAgreeValue;
            $scope.$emit('update');
        };
        $scope.init = function(dataType, labelString){
            var inputArray = labelString.split("||");
            if(dataType === 'boolean' && inputArray.length === 3){
                $scope.label = inputArray[0];
                $scope.linkUrl = 'http://' + inputArray[2];
                $scope.linkLabel = inputArray[1];
            } else {
                $scope.label = labelString;
            }
        };
        $scope.popupLink = function (link) {
            var width = 730;
            var height = 500;
            var popup_x  = (screen.width  - width) / 2;
            var popup_y  = (screen.height - height) / 2;
            window.open(link,'importantPages','width='+width+',height='+height+',resizable=yes,menubar=no,toolbar=no,directories=no,location=no,scrollbars=yes,status=no,left='+popup_x+',top='+popup_y);
        };
    }]);
})();

/**
 * Function to generate password,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'save-statis',
            condition: function(el) {
                var checks = [
                    el.hasOptions,
                    !el.multiple,
                    el.styles.indexOf('save_statis') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('SaveStatusController', ["$scope", "$timeout", "$rootScope", function ($scope, $timeout, $rootScope) {
        $scope.lastSavedLabel = '';
        $scope.time = '';
        $scope.element.value[0] = 0;
        $scope.$emit('update');
        $rootScope.$on('SaveStatus', function($event, message){
            $scope.element.value[0] = 1;
            $scope.$emit('update');
        });
        $scope.setTime = function() {
            $scope.time = generateTime();
        };
        $scope.setSaved = function() {
            if($scope.time === '') {
                $scope.time = generateTime();
            }
            $timeout(function () {
                updateVale();
            }, 1000);
        };
        function generateTime(){
        	var today = new Date();
            var time = today.getTime();
            var h = today.getHours();
            h = parseInt(h);
            if(h > 12) {
                h = h - 12;
            }
            var m = today.getMinutes();
            var noon = new Date(today.getFullYear(),today.getMonth(),today.getDate(),12,0,0);
            var ampm = (today.getTime()<noon.getTime())?'AM':'PM';
            h = h.toString();
            m = m.toString();
            if(h.length === 1) {
                h = '0'+ h;
            }
            if(m.length === 1) {
                m = '0'+ m;
            }
            var timeNow = h + ':' + m + ' ' + ampm;
            return timeNow;
        }
        $scope.setLabelForLastSaved = function(text) {
            $scope.lastSavedLabel = text.replace("||SavedTime||", $scope.time);
        };
        function updateVale() {
            $scope.element.value[0] = 4;
            $scope.$emit('update');
        }
    }]);
})();

(function() {
    /**
     * @ngInject
     */
    function registerControl(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'stepped-slider',
            controller: 'SteppedSliderController as controller',

            condition: function (el) {
                var checks = [
                    el.styles.indexOf('stepped_slider') > -1,
                    el.hasOptions,
                    !el.multiple
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }

        });
    }
    registerControl.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerControl);
})();

(function () {

    /**
     * Controller for stepped-slider components
     * Adds a mapper between options and values to local scope
     * @ngInject
     */
    function SteppedSliderController($scope) {

    }
    SteppedSliderController.$inject = ["$scope"];

    angular.module('forms-ui').controller('SteppedSliderController', ['$scope', SteppedSliderController]);
    angular.module('forms-ui').directive('steppedSliderContent', function () {
        return {
            restrict: 'C',
            controller: 'SteppedSliderController as controller',
            template: '<div class="stepped_slider__bar">' +
            '<div class="stepped_slider__bar__progress"></div>' +
            '<div class="slider_bar__knob" ng-mousedown="knobDown($event)" ng-mouseup="knobUp($event)">' +
            '<div class="slider_bar__knob__value"><span>{{element.value[0] | currency:"€":0}}</span></div>' +
            '<div class="slider_bar__knob__content">' +
            '<div class="slider_bar__knob__content_line"></div>' +
            '<div class="slider_bar__knob__content_line"></div>' +
            '<div class="slider_bar__knob__content_line"></div>' +
            '<div class="slider_bar__knob__content_line"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="stepped_slider__values">' +
            '<div ng-repeat="item in element._e.domain" value="{{item.value}}" ng-click="selectValueItem($event)" class="stepped_slider__values__value_item">' +
            '<div class="dashline"></div>' +
            '<span>{{item.displayValue}}</span>' +
            '</div>' +
            '</div>',
            link: function ($scope, element, attrs) {
                var dataElement = $scope.element._e;


                var _this = this;
                this.valueDomain = dataElement.domain;

                $scope.$watch("element.value", function (pNewValue, pOldValue) {
                    if (pNewValue != pOldValue) {
                        _this.selectByValue(pNewValue[0]);
                    }
                });

                $scope.$watch("element._e.domain", function (pNewValue, pOldValue) {
                    _this.setupValues();
                });
                //------------------------
                this.cacheItems = function () {
                    this.container = (element.context)?element.context:element[0];

                    this.knob = this.container.querySelector(".slider_bar__knob");
                    this.knobBar = this.container.querySelector(".stepped_slider__bar");
                    this.progressBar = this.knobBar.querySelector(".stepped_slider__bar__progress");
                    this.containerValues = this.container.querySelector(".stepped_slider__values");
                    this.containerValueItems = this.container.getElementsByClassName("stepped_slider__values__value_item");
                    var rect = this.knobBar.getBoundingClientRect();
                    this.limitX = rect.width;
                    this.startX = rect.left;



                }.bind(this);
                //------------------------Z
                this.init = function () {
                    this.cacheItems();
                    window.setTimeout(function () {
                        _this.setupValues();
                        var currentValue = parseFloat($scope.element.value[0]);
                        if (currentValue >= 0) {
                            _this.selectByValue(currentValue);
                        } else {
                            $scope.selectValueItem(_this.containerValueItems[0]);
                        }
                        $scope.$evalAsync();
                    }, 0);

                }.bind(this);

                this.selectByValue = function (pValue) {
                    var limit = this.containerValueItems.length;
                    while (--limit >= 0) {
                        var cItem = _this.containerValueItems[limit];
                        var value = parseFloat(cItem.getAttribute("value"));
                        if (value == pValue) {
                            $scope.selectValueItem(cItem);
                            break;
                        }
                    }
                }.bind(this);

                this.setupValues = function () {
                    var lim = this.valueDomain.length;
                    var length = this.valueDomain.length;
                    var cElem;
                    this.maxValue = 0;
                    while (--lim >= 0) {
                        cElem = this.valueDomain[lim];
                        if (parseFloat(cElem.value) > this.maxValue) this.maxValue = parseFloat(cElem.value);
                    }
                    lim = this.containerValueItems.length;
                    while (--lim >= 0) {
                        cElem = this.containerValueItems[lim];
                        var perc = ((lim / (length - 1)) * 100);
                        cElem.style.left = perc + "%";
                        cElem.posPerc = perc;
                    }

                }.bind(this);

                this.drag = function (e) {

                    var moveX = e.clientX - this.startX;
                    if (moveX > 0 && moveX < this.limitX) {
                        this.knob.moved = moveX;
                        this.knob.style.left = this.knob.moved + "px";
                        var minPerc = this.knob.moved / this.limitX;
                        var perc = (minPerc) * 100;
                        this.progressBar.style.width = perc + "%";
                        this.barProgress = perc;
                    }
                }.bind(this);

                /// SCOPE BINDS

                $scope.selectValueItem = function (pValueItem) {
                    if (!pValueItem)return;
                    if (pValueItem.originalEvent) pValueItem = pValueItem.originalEvent.target;
                    var closestVal = parseFloat(pValueItem.posPerc);

                    var closestMoney = pValueItem.getAttribute("value");
                    var minPerc = closestVal / 100;
                    this.knob.moved = minPerc * this.limitX;
                    this.knob.style.left = this.knob.moved + "px";
                    var perc = (minPerc) * 100;
                    this.progressBar.style.width = perc + "%";
                    $scope.element.value[0] = closestMoney;
                    $scope.$emit("update");
                    $scope.$evalAsync();
                }.bind(this);

                $scope.knobDown = function (pEvent) {
                    var rect = this.knobBar.getBoundingClientRect();
                    this.limitX = rect.width;
                    this.startX = rect.left;
                    this.knob.moved = 0;
                    //--
                    document.addEventListener("mousemove", this.drag);
                    document.addEventListener("mouseup", $scope.knobUp);

                }.bind(this);
                $scope.knobUp = function () {
                    //--
                    var closestItem = null;
                    var minDiff = 9999999999999;
                    var lim = this.containerValueItems.length;
                    var cElem;
                    //--
                    while (--lim >= 0) {
                        cElem = this.containerValueItems[lim];
                        var valueItemPerc = parseFloat(cElem.posPerc);
                        var diff = Math.abs(valueItemPerc - this.barProgress);
                        if (diff < minDiff) {
                            minDiff = diff;
                            closestItem = cElem;
                        }
                    }
                    $scope.selectValueItem(closestItem);
                    document.removeEventListener("mousemove", this.drag);

                }.bind(this);
                this.init();
            }
        };
    });
})();

(function () {
    /**
     * @ngInject
     */
    function registerElement(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'radio-record',
            condition: function (el) {
                var checks = [
                    el.isField,
                    el.hasOptions,
                    !el.multiple,
                    el.styles.indexOf('radio_record') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }

        });
    }
    registerElement.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerElement);
})();

(function() {
    angular.module('forms-ui').directive('radioRecord',  /*@ngInject*/ function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter,$timeout) {
                var context = (element.context)?element.context:element[0];
                $scope.itemSelected = function (pEvent,pData) {
                    $scope.$parent.element.value[0] = pData.value;
                     $scope.$emit('update');
                    setTimeout(function () {
                        $scope.selectedValue = $scope.$parent.element.value[0];
                        $scope.$evalAsync();
                    }, 100);

                };

                $scope.selectedValue = $scope.$parent.element.value[0];
            }
        };
    });

})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry, $http, $rootScope) {
        ComponentRegistry.registerElement({
            name: 'text-ask-amy',
            condition: function(el) {
                if( el.styles.indexOf('ask_amy_text') > -1) {
                    var askAmyText = el._e.plainText;
                    el._e.askAmyText=askAmyText.substring(0,askAmyText.indexOf('|'));
                    askAmyText= askAmyText.replace(askAmyText.substring(0,askAmyText.indexOf('|')+3),'');
                    el._e.askAmyLinkText = askAmyText.substring(0,askAmyText.indexOf('|'));
                    askAmyText= askAmyText.replace(askAmyText.substring(0,askAmyText.indexOf('|')+3),'');
                    el._e.askAmyLink = askAmyText;
                }

                var checks = [
                    el.type === 'textitem',
                    el.styles.indexOf('ask_amy_text') > -1 || el.styles.indexOf('ask-amy-text') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                if( score.length === checks.length ){
                    el.openAskAmy = function (){
                        $rootScope.$broadcast('utag', el.name);
                        var width = 730;
                        var height = 500;
                        var popup_x  = (screen.width  - width) / 2;
                        var popup_y  = (screen.height - height) / 2;
                        window.open(el._e.askAmyLink,'popup','width='+width+',height='+height+',resizable=yes,menubar=no,toolbar=no,directories=no,location=no,scrollbars=yes,status=no,left='+popup_x+',top='+popup_y);
                        return false;
                    };
                }

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry", "$http", "$rootScope"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'table',
            condition: function(el) {
                var checks = [
                    el.type === 'table'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'story-selector',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf('story_selector') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {
    /**
     *
     * Adds a mapper between options and values to local scope
     * @ngInject
     */
    angular.module('forms-ui').directive('storySelector', function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter) {
                var context = (element.context)?element.context:element[0];
                $scope.$on("collapse-section",function () {
                    setTimeout(function () {
                        $scope.collapse = true;
                        $scope.$evalAsync();
                    }, 150);

                    $scope.$broadcast("collapse-scenario-selector");
                    $scope.$broadcast("collapse-amendments-list");
                });


                $scope.$on("open-section",function () {
                    setTimeout(function () {
                        $scope.collapse = false;
                        $scope.$evalAsync();
                    }, 150);

                    $scope.$broadcast("open-scenario-selector");
                    $scope.$broadcast("open-amendments-list");

                });

            }
        };
    });
})();

(function() {
    /**
     * @ngInject
     */
    function registerControl(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'stickyblock',
            condition: function (el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf("stickyblock") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }

        });
    }
    registerControl.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerControl);
})();

(function () {
    angular.module('forms-ui').directive('stickyBlock', function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs, formsController) {
                var context = (element.context) ? element.context : element[0];
                var box = context.getBoundingClientRect();
                function getScrollY() {
                    var response = 0;
                    if (typeof( window.pageYOffset ) == 'number') response = window.pageYOffset;
                    else if (document.body && document.body.scrollTop) response = document.body.scrollTop;
                    return response;
                }

                function handleScroll() {
                    var scrollY = getScrollY();
                    var diff = scrollY - box.top;
                    if (diff > -20) {
                        if ($scope.fixed)return;
                        $scope.fixed = true;
                        $scope.$evalAsync();

                    } else {
                        if (!$scope.fixed)return;
                        $scope.fixed = false;
                        $scope.$evalAsync();

                    }
                }

                window.addEventListener("scroll", handleScroll);
            }
        };
    });
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'text-item',
            condition: function(el) {
                var checks = [
                    el.type === 'textitem'
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('TextItemController', ["$scope", function ($scope) {
        var element = $scope.element;

        $scope.$on('saveProgress', function($event, message){
            $scope.onLoadTextItem();
        });

        $scope.onLoadTextItem = function(){
            if($scope.element.styles.indexOf('wf_set_focus_on_init') >-1 || $scope.element.styles.indexOf('error_text') > -1){
                var topElement = $('#hsbc-odct-header').offset();
                if(typeof topElement.top !== 'undefined') {
                    $( 'html, body' ).scrollTop(topElement.top);
                }
            }
        };
    }]);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry, $http, $rootScope, $window) {
        ComponentRegistry.registerElement({
            name: 'text-download-item',
            condition: function(el) {
                if( el.styles.indexOf('download_form_btn') > -1) {
                    el._e.linkText=el._e.plainText.substring(el._e.plainText.indexOf('|')+3);
                }

                var checks = [
                    el.type === 'textitem',
                    el.styles.indexOf('download_form_btn') > -1 || el.styles.indexOf('download-form-btn') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                if(score.length === checks.length){
                    el.callAction = function () {
                        $rootScope.$broadcast('utag', el.name);
                        var sessionID = $window.sessionStorage.getItem('FORMS-SESSION');
                        var appendText = el._e.nodes[0].values[0];
                        if(appendText.indexOf('server/')>-1){
                            appendText = appendText.replace('server/','');
                        }
                        var currentURL=window.location.origin + b$.portal.config.serverRoot + '/services/forms/server/'+sessionID+appendText;

                        var width = 730;
                        var height = 500;
                        var popup_x  = (screen.width  - width) / 2;
                        var popup_y  = (screen.height - height) / 2;
                        window.open(currentURL,'importantPages','width='+width+',height='+height+',resizable=yes,menubar=no,toolbar=no,directories=no,location=no,scrollbars=yes,status=no,left='+popup_x+',top='+popup_y);
                    };
                }

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry", "$http", "$rootScope", "$window"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'text-save-progress',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf('save_progress_status') > -1,
                    el.type === 'textitem'
                ];
                var score = checks.filter(function (value) {
                    return value;
                });
                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'utag_event_data',
            condition: function(el) {
                var checks = [
                    el.type === 'textitem',
                    el.styles.indexOf('utag_event_data') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('UtagEventController', ["$scope", "$rootScope", function ($scope, $rootScope) {
        $scope.data = {};
        var nodesData = $scope.element._e.nodes;
        var name = (typeof $scope.element.name === 'string') ? $scope.element.name.replace('utag_event_', '') : $scope.element.name;

        $scope.onLoad = function(){
        	
            var plainText = $scope.element._e.plainText;
            $scope.data = {};
            var keyValueArray = plainText.split(" : ");
            var keyData = keyValueArray[0];
            var valueData = keyValueArray[1];
            $scope.data[keyData] = (!valueData) ? '' : valueData;

            $rootScope.utagEventData = (!$rootScope.utagEventData) ? [] : $rootScope.utagEventData;
            $rootScope.utagEventData[name] = $scope.data;
        };

        $rootScope.utagEventData = (!$rootScope.utagEventData) ? [] : $rootScope.utagEventData;

        $rootScope.$on('updateUtag', function($event, message){
            $scope.onLoad();
        });
        $scope.onLoad();
    }]);
})();
(function() {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'textarea',
            condition: function(el) {
                var checks = [
                    el.dataType === 'text',
                    !el.hasDomain,
                    el.styles.indexOf('memo') > -1

                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};


            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'utag_page_data',
            condition: function(el) {
                var checks = [
                    el.type === 'textitem',
                    el.styles.indexOf('utag_page_data') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('UtagPageController', ["$scope", "$rootScope", function ($scope, $rootScope) {

        var plainText = $scope.element._e.plainText;
        var res = plainText.split("\n");
        data = {};
        for(var key in res){
            var keyValueArray = res[key].split(" : ");
            var keyData = keyValueArray[0];
            var valueData = keyValueArray[1];
            data[keyData] = (!valueData) ? '' : valueData;
        }

        $rootScope.utagPageData = data;
        $scope.pageEventData = data;
        if(typeof $scope.pageEventData === 'object') {
            var pageData = {};
            for (var k in $scope.pageEventData){
                if(k !== 'event_category' && k !== 'event_action' ){
                    var kData = k;
                    var vData = $scope.pageEventData[k];
                    pageData[kData] = (!vData) ? '' : vData;
                }
            }
            if(typeof(window.taggingView) == "function"){
                window.taggingView(pageData);
            }
        }

        $scope.$on('utag', function($event, name){
            if(typeof $rootScope.utagEventData[name] === 'object') {
                var eventData = $rootScope.utagEventData;

                for(var key in eventData[name]) {
                    $rootScope.utagPageData[key] = eventData[name][key];
                }
                if(typeof(window.taggingEvent) == "function"){
                    window.taggingEvent($rootScope.utagPageData);
                }
            }
        });
    }]);
})();
(function () {

    /**
     * @ngInject
	 * Forms WS4 Version : 1.0.4
	 * Date : 07/17/2017 PM
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-all-forms-data',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf("all_forms_data") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('FormDataController', ["$scope", "$rootScope", "$q", "$timeout", function ($scope, $rootScope, $q, $timeout) {
        var element = $scope.element;
        var styles = element._e.styles;
        var childArray = $scope.element.children;
        var errorSections = {};
        var sectionsData = {};
        $scope.hideChilds = (styles.indexOf('hidden') > -1) ? true : false;
        $rootScope.project = 'onbording';

        function generatePDFData(inputData){
            var deferred = $q.defer();
            try{
                var data = generatHKey(inputData);
                deferred.resolve(data);
            } catch(e) {
                deferred.reject(e);
            }
            return deferred.promise;
        }

        $scope.$on('BEventToSetPDFData', function () {
            generatePDFData($scope.element.children).then(function(data){
                $scope.$emit('BEventToPageGeneratePDF', data);
            });
        });

        $scope.init = function() {
            $rootScope.formData = generatHKey(childArray);
            $rootScope.errorSections = errorSections;
            $rootScope.sectionsData = sectionsData;
            $rootScope.$broadcast('setReviewNotification', $rootScope.formData);
            $rootScope.$broadcast('addPdfData', $rootScope.formData);
        };

        function generatHKey(childArray) {
            var result = {};
            errorSections = {};
            sectionsData = {};
            for(var i = 0; i < childArray.length; i++) {
                var childElement = childArray[i];
                var childElementChildren = childElement.children;
                var indexOfAccordianList = childElement.styles.indexOf('accordian_list');
                if(indexOfAccordianList > -1) {
                    result[childElement._e.name] = {
                        title: childElement._e.displayName,
                        key: childElement._e.key,
                        name: childElement._e.name,
                        content: {},
                        editButton: {},
                        children : {},
                        error : false,
                        child : false
                    };
                    if(childElement.children) {
                        var children = generatHKey(childElement.children);
                        result[childElement._e.name].children = children;
                        result[childElement._e.name].child = true;
                        result[childElement._e.name].error = getErrorStatus(children);
                    }
                    updateCompletedStatus(childElement._e.name, result[childElement._e.name].error);
                } else {
                    var isErrorPresent = false;
                    var elementInfo = generateElementData(childElement, childElement._e.name);
                    result[childElement._e.name] = {
                        title: childElement._e.displayName,
                        key: childElement._e.key,
                        name: childElement._e.name,
                        content : elementInfo.content,
                        editButton: elementInfo.edit,
                        children : {},
                        error : (errorSections[childElement._e.name] === true) ? true : false,
                        child : false
                    };
                    updateCompletedStatus(childElement._e.name, result[childElement._e.name].error);
                }
            }
            return result;
        }

        function updateCompletedStatus(parentName, value) {
            var data = {
                name : parentName,
                value: (value === true) ? false : true
            };
            $scope.$emit('EEventSetHiddenValue', data);
        }

        function getErrorStatus(childElements) {
            var error = false;
            for (var key in childElements) {
               var element = childElements[key];
               if(element.error === true) {
                    error = true;
                }
            }
            return error;
        }

        function generateElementData(childElement, parentName) {
            var result = {
                edit: {},
                content: {}
            };

            if(childElement.children) {
                var children  = childElement.children;
                for(var i = 0; i < children.length; i++) {
                    if(children[i]._e.caption === 'Edit') {
                        result.edit = children[i];
                    } else {
                        getDataFromContainer(children[i], parentName);
                    }
                }
            }
            if(sectionsData[parentName]) {
                result.content = sectionsData[parentName];
            }
            return result;
        }

        var specialContainers = ['wf_container_currency', 'hsbc_table', 'capacity_container', 'wf_container_contact_number', 'header_inline', 'wf_container_share_holder'];
        function getDataFromContainer(data, parentName) {
            if(data.length > 0) {
                data.forEach(function(element) {
                    if(element.children && element.children.length > 0) {
                        var isSpecialContainer = checkForSpecialContainer(element, parentName);
                        if(!isSpecialContainer) {
                            getDataFromContainer(element.children, parentName);
                        }
                    } else {
                        getFieldData(element, parentName);
                    }
                });
            } else {
                if(data.children && data.children.length > 0) {
                    getDataFromContainer(data.children, parentName);
                } else {
                    getFieldData(data, parentName);
                }
            }
        }

        function getShareHoldersContainer(element, parentName){
            var dataObject = {
                questionElement : {},
                answerElement : {}
            };
            if(typeof element.children !== 'undefined' && element.children.length > 0) {
                for(var key in element.children) {
                    var currentElement = element.children[key];
                    if(typeof currentElement.styles !== 'undefined') {
                        if(currentElement.styles.indexOf('wf_element_radio_group') > -1) {
                            dataObject.questionElement = currentElement;
                        } else if(currentElement.styles.indexOf('wf_element_dropdown') > -1) {
                            dataObject.answerElement = currentElement;
                        }
                    }
                }
            }

            getFieldData(dataObject.questionElement, parentName);
            if(typeof dataObject.questionElement.value !== 'undefined' && dataObject.questionElement.value[0] === 'Y') {
                getFieldData(dataObject.answerElement, parentName);
            }
        }

        function checkForSpecialContainer(element, parentName) {
            var styles = (element.styles) ? element.styles : null;
            var isSpecialContainer = false;
            if(typeof styles === 'object' && styles.length > 0) {
                for(var key in styles) {
                    var className = styles[key];
                    if(specialContainers.indexOf(className) > -1) {
                        isSpecialContainer = true;
                        switch(className) {
                            case 'wf_container_currency':
                                getCurrencyFieldData(element, parentName);
                                break;
                            case 'hsbc_table':
                                getTableData(element, parentName);
                                break;
                            case 'capacity_container':
                                getCapacityContainer(element, parentName);
                                break;
                            case 'wf_container_contact_number':
                                getContactNumberContainer(element, parentName);
                                break;
                            case 'wf_container_share_holder':
                                getShareHoldersContainer(element, parentName);
                                break;
                            case 'header_inline':
                                getHeaderInline(element, parentName);
                                break;
                            default:
                                //
                        }
                    }
                }
            }
            return isSpecialContainer;
        }

        function getHeaderInline(element, parentName) {
            var resultItem = {
                label: element._e.displayName,
                key: element.key,
                name:  element.name,
                type: 'sectionHeading'
            };
            if(!sectionsData[parentName]) {
                sectionsData[parentName] = {};
            }
            sectionsData[parentName][resultItem.key] = resultItem;
            getDataFromContainer(element.children, parentName);
        }

        function getContactNumberContainer(element, parentName) {
            if(typeof element.children !== 'undefined' && element.children.length > 0) {
                var value = '';
                var message = '';
                var label = '';
                var type = 'text';
                for(var key in element.children) {
                    var thisElement = element.children[key];
                    var thisElementDeta = thisElement._e;
                    message = getMessage(thisElementDeta.messages, thisElementDeta.validations, parentName, thisElement);
                    if(label === '') {
                        label = getLabel(thisElementDeta, parentName);
                    }
                    if(message === '') {
                        value = value + getValue(thisElementDeta, parentName);
                    } else {
                        value = '';
                        break;
                    }
                }

                var resultItem = {
                    label: label,
                    value: value,
                    message: message,
                    key: element.key,
                    name:  element.name,
                    type: type
                };

                if(!sectionsData[parentName]) {
                    sectionsData[parentName] = {};
                }
                sectionsData[parentName][resultItem.key] = resultItem;
            }
        }

        function getCapacityContainer(element, parentName) {
            var elementChildren = element.children;
            var currentElement = element._e;
            var selectCapacities = [];

            for(var key in elementChildren) {
                var thisElement = elementChildren[key];
                var thisElementDeta = thisElement._e;
                if(typeof thisElement.styles !== 'undefined' && thisElement.styles.indexOf('error_text') > -1) {
                    if(!errorSections[parentName]) {
                        errorSections[parentName] = true;
                    }
                    var errorMessage = {
                        label: '',
                        value: '',
                        message: thisElement._e.plainText,
                        key: thisElement.key,
                        name:  thisElement.name,
                        type: 'error-message'
                    };
                    selectCapacities.push(errorMessage);
                } else if(thisElement.dataType === 'boolean') {
                    if(thisElement.value[0] !== 'false') {
                        var data = {
                            label: getLabel(thisElementDeta, parentName),
                            message: getMessage(thisElementDeta.messages, thisElementDeta.validations, parentName, thisElement),
                            key: thisElement.key,
                            name:  thisElement.name,
                            type: thisElementDeta.dataType
                        };
                        selectCapacities.push(data);
                    }
                } else {
                    var fieldData = {
                        label: getLabel(thisElementDeta, parentName),
                        value: getValue(thisElementDeta, parentName),
                        message: getMessage(thisElementDeta.messages, thisElementDeta.validations, parentName, thisElement),
                        key: thisElement.key,
                        name:  thisElement.name,
                        type: thisElementDeta.dataType
                    };
                    selectCapacities.push(fieldData);
                }
            }

            if(selectCapacities.length > 0) {
                var result = {
                    label: getLabel(currentElement, parentName),
                    key: element.key,
                    name:  element.name,
                    type: 'capacity',
                    selectCapacities : selectCapacities
                };
                if(!sectionsData[parentName]) {
                    sectionsData[parentName] = {};
                }
                //sectionsData[parentName].push(result);
                sectionsData[parentName][result.key] = result;
            }
        }

        function getTableData(element, parentName) {
            var tableData = element.children;
            var tableHeader = {};
            var tableBody = [];
            for(var row = 0; row < tableData.length; row++) {
                var rowObject = tableData[row];
                var rowChildrenObject = rowObject.children;
                var isHeader = (typeof rowObject.styles === 'object' && rowObject.styles.length > 0 && rowObject.styles.indexOf('table_header') > -1) ? true : false;
                var rowData = {};
                for(var col = 0; col < rowChildrenObject.length; col++) {
                    var colObject = rowChildrenObject[col];
                    if(isHeader) {
                        tableHeader[col] = getLabel(colObject._e, parentName);
                    } else {
                        if(!colObject.isButton) {
                            var currentElement = colObject._e;
                            var resultItem = {};
                            if(isHeader) {
                                resultItem = {
                                    label: getLabel(currentElement, parentName)
                                };
                            } else {
                                resultItem = {
                                    label: '',
                                    value: getValue(currentElement, parentName),
                                    message: getMessage(currentElement.messages, currentElement.validations, parentName, colObject),
                                    key: colObject.key,
                                    name:  colObject.name,
                                    type: currentElement.dataType
                                };
                                tableBody[row] = (!tableBody[row]) ? [] : tableBody[row];
                                tableBody[row][col] = resultItem;
                            }
                        }
                    }
                }
            }

            var tableResult = {
                label: getLabel(element._e, parentName),
                key: element.key,
                name:  element.name,
                type: 'table',
                tableHeader: tableHeader,
                tableBody: tableBody
            };

            if(!sectionsData[parentName]) {
                sectionsData[parentName] = {};
            }

            //sectionsData[parentName].push(tableResult);
            sectionsData[parentName][tableResult.key] = tableResult;
        }

        function getCurrencyFieldData(element, parentName) {
            var currentElement = element._e;
            var value = '';
            var message = '';
            var type = '';

            for(var childKey in element.children) {
                var fieldData = element.children[childKey]._e;
                var tempValue = getValue(fieldData, parentName);
                if(tempValue !== '') {
                    value = (value !== '') ? value + ' ' + tempValue : tempValue;
                }
                var tempMessage = getMessage(fieldData.messages, fieldData.validations, parentName, element.children[childKey]);
                if(message === '' && tempMessage !== '') {
                    message = tempMessage;
                }
                type = fieldData.dataType;
            }

            var resultItem = {
                label: getLabel(currentElement, parentName),
                value: value,
                message: message,
                key: element.key,
                name:  element.name,
                type: type
            };

            if(!sectionsData[parentName]) {
                sectionsData[parentName] = {};
            }

            //sectionsData[parentName].push(resultItem);
            sectionsData[parentName][resultItem.key] = resultItem;
        }

        function getFieldData(element, parentName) {
            var currentElement = element._e;
            var resultItem = {};
            if(typeof element.styles !== 'undefined' && element.styles.indexOf('error_text') > -1) {
                if(!errorSections[parentName]) {
                    errorSections[parentName] = true;
                }
                resultItem = {
                    label: '',
                    value: '',
                    message: element._e.plainText,
                    key: element.key,
                    name:  element.name,
                    type: 'error-message'
                };
            } else {
                resultItem = {
                    label: getLabel(currentElement, parentName),
                    value: getValue(currentElement, parentName),
                    message: getMessage(currentElement.messages, currentElement.validations, parentName, element),
                    key: element.key,
                    name:  element.name,
                    type: currentElement.dataType
                };
            }

            if(!sectionsData[parentName]) {
                sectionsData[parentName] = {};
            }
            //sectionsData[parentName].push(resultItem);
            sectionsData[parentName][resultItem.key] = resultItem;
        }

        function getMessage(messageObject, validationsObject, parentName, element){
            var message = '';
            var messageItem;
            if(element.hasError) {
                var messageKey;
                

                for(messageKey in element.messages) {
                    messageItem = element.messages[messageKey];
                    message = (messageItem.type === 'ERROR') ? messageItem.text : message;
                }
            }
            
            if(message === '' && element.required === true && element.value.length <= 0) {

                var validationKey;
                for(validationKey in element.validations) {
                    validationItem = element.validations[validationKey];
                    message = (validationItem.type === 'Required') ? validationItem.message : message;
                }
            }
            if(message !== '') {
                if(!errorSections[parentName]) {
                    errorSections[parentName] = true;
                }
            }

            return message;
        }

        function getLabel(labelObject, parentName){
            var label = '';
            if(labelObject.questionText && labelObject.questionText !== '') {
                label = labelObject.questionText;
            } else if(labelObject.plainText && labelObject.plainText !== '') {
                label = labelObject.plainText;
            } else if(labelObject.displayName && labelObject.displayName !== '') {
                label = labelObject.displayName;
            }
            return label;
        }

        function getValue(element, parentName){
            var valueObject = element.values;
            var dataType = element.dataType;
            var value = '';
            
            if(element.domain && element.domain.length > 0) {
                var domainLength = element.domain.length;
                for(var y = 0; y < domainLength; y++) {
                    var domainValue = element.domain[y];
                    if(valueObject.indexOf(domainValue.value) > -1) {
                        value = (value !== '') ? value + ', ' + domainValue.displayValue : domainValue.displayValue;
                    }
                }
            } else {
                if(valueObject.length > 0) {
                    if(element.dataType === 'date' && valueObject[0] !== '') {
                        var dateArray = valueObject[0].split('-');
                        if(dateArray.length === 3) {
                            value = dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
                        } else {
                            value = valueObject[0];
                        }
                    } else if(valueObject.length > 1) {
                        value = valueObject.join(', ');
                    } else {
                        value = valueObject[0];
                    }
                }
            }
            return value;
        }
    }]);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-application-primary-container',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf('form_application_primary_container') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('FormApplicationPrimaryContainer', ["$scope", "$rootScope", function ($scope, $rootScope) {
        $scope.blockName = 1;
        $scope.isSystemNotification = false;
        $scope.setChildData = function (data) {
            switch (data.styles[0]) {
                case 'form_primary_header':
                    $scope.blockName = 1;
                    break;
                case 'form_controle_buttons':
                    $scope.blockName = 2;
                    break;
                case 'left_align_buttons':
                    $scope.blockName = 2;
                    break;
                case 'application_content':
                    $scope.blockName = 2;
                    break;
                case 'form_controle_links':
                    $scope.blockName = 3;
                    break;
                case 'system_notification':
                    $scope.blockName = 4;
                    break;
                default:
                    $scope.blockName = 3;
            }
        };
        $rootScope.$on('triggerSystemNotification', function($event, message){
            $scope.isSystemNotification = true;
        });
        var getElementsStyleName = function(element) {
            var elementByStyleName = [];
            for(var i = 0; i < element.length; i++) {
                var currentElement = element[i];
                var currentElementName = currentElement.styles[0];
                if(!elementByStyleName[currentElementName]) {
                    elementByStyleName[currentElementName] = [];
                }
                elementByStyleName[currentElementName].push(currentElement);
            }
            return elementByStyleName;
        };
        var topElement = $('#hsbc-odct-header').offset();
        if(typeof topElement.top !== 'undefined') {
            $( 'html, body' ).scrollTop(topElement.top);
        }
    }]);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry, $http, $rootScope) {
        ComponentRegistry.registerElement({
            name: 'text-download-link',
            condition: function(el) {
                if( el.styles.indexOf('download_form_link') > -1) {
                    el._e.linkText=el._e.plainText.substring(el._e.plainText.indexOf('|')+3);
                }

                var checks = [
                    el.type === 'textitem',
                    el.styles.indexOf('download_form_link') > -1 || el.styles.indexOf('download-form-link') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                if(score.length === checks.length){
                    el.callLink = function () {
                        $rootScope.$broadcast('utag', el.name);
                        var link=el._e.plainText.substring(0,el._e.plainText.indexOf('|')-1);
                        var width = 730;
                        var height = 500;
                        var popup_x  = (screen.width  - width) / 2;
                        var popup_y  = (screen.height - height) / 2;
                        window.open(link,'importantPages','width='+width+',height='+height+',resizable=yes,menubar=no,toolbar=no,directories=no,location=no,scrollbars=yes,status=no,left='+popup_x+',top='+popup_y);
                    };
                }
                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry", "$http", "$rootScope"];

    angular.module('forms-ui').run(registerComponent);
})();
/**
 * Function to generate address fields,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-container-address',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf('wf_container_address') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('AddressController', ["$scope", function ($scope) {
        var element = $scope.element;
        $scope.elementChildren = element.children;
    }]);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-container-accordion-list',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf("accordian_list") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('AccordionController', ["$scope", "$rootScope", function ($scope, $rootScope) {
        function getData(name, data){
            var result;
            var key;
            for(key in data) {
                if(key !== name) {
                    var childObject = data[key].children;
                    if(typeof childObject === 'object') {
                        result = getData(name, childObject);
                    }
                } else {
                    result = data[key];
                    break;
                }
                if(typeof result !== 'undefined') {
                    break;
                }
            }
            return result;
        }
        $scope.showFirstLevel = false;
        $scope.showGreenTick = false;
        $scope.currentElement = {};
        $scope.setCurrentElement = function(data){
            var dataObject = getData(data.name, $rootScope.formData);
            $scope.currentElement = dataObject;
            if(typeof data.children !== 'undefined' && typeof data.children[1] !== 'undefined' && typeof data.children[1].styles !== 'undefined' && data.children[1].styles.indexOf('set_greentick') > -1) {
                $scope.showGreenTick = true;
                $scope.showFirstLevel = false;
            } else {
                $scope.showGreenTick = false;
                $scope.showFirstLevel = true;
            }
        };
    }]);
})();
/**
 * Function to generate contact number,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-container-contact-number',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf('wf_container_contact_number') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('ContactNumberController', ["$scope", function ($scope) {
        var element = $scope.element;
        $scope.childrenElements = $scope.element.children;
        $scope.messageElement = [];
        $scope.label = '';
        $scope.description = '';
        $scope.showDescriptionIcon = false;
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;

        $scope.updateMessage = function() {
            var key = 0;
            for(key in $scope.childrenElements) {
                var child = $scope.childrenElements[key];
                if(child.hasError) {
                    $scope.messageElement = child.messages;
                    break;
                }
            }
        };

        $scope.init = function() {
            var key = 0;
            for(key in $scope.childrenElements) {
                var child = $scope.childrenElements[key];
                if($scope.label === '' && child.label !== '') {
                    $scope.label = child.label;
                }
                if($scope.description === '' && child.description !== '') {
                    $scope.description = child.description;
                    $scope.showDescriptionIcon = true;
                }
            }
            $scope.updateMessage();
        };

        $scope.$on('update', $scope.updateMessage);
    }]);
})();
/**
 * Function to generate hash password,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-container-hash-password',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf('wf_container_hash_password') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('HashPassword', ["$scope", "lpCoreBus", function($scope, lpCoreBus) {
        var element = $scope.element;
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
        $scope.showText = 'SHOW';
        $scope.hideText = 'HIDE';
        $scope.description = '';
        var passwordElementName = '';
        $scope.fieldType = 'password';
        $scope.changeFieldType = function(type) {
            $scope.fieldType = type;
        };
        $scope.setName = function(name) {
            passwordElementName = name;
        };
        $scope.updateElement = function(passwordString) {
            if (typeof passwordString !== 'undefined' && passwordString !== '') {
                var shaObj = new jsSHA('SHA-512', 'TEXT');
                shaObj.update(passwordString);
                passwordString = shaObj.getHash('HEX');
                setHashValue(passwordString);
            } else {
                setHashValue('');
            }
        };
        function setHashValue(hashValue) {
            if (typeof hashValue !== 'undefined') {
                for ( var key in element.children) {
                    var childElement = element.children[key];
                    if (childElement.classList === 'password-with-hashing') {
                        element.children[key].value = [ hashValue ];
                        $scope.$emit('update');
                    }
                }
            }
        }

        function setHashChangeEvent(elementData) {
            $scope.$on(elementData.name, function($event, data) {
                $scope.updateElement(data);
            });
        }

        $scope.setHashChangeEvent = setHashChangeEvent;
    }]);
})();

/**
 * Function to generate contact number,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-container-hk-number',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf('wf_container_hk_number') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('HKIDController', ["$scope", function ($scope) {
        var element = $scope.element;
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
        $scope.childrenElements = $scope.element.children;
        $scope.messageElement = [];
        $scope.hasError = 0;
        $scope.label = '';
        $scope.description = '';
        $scope.showDescriptionIcon = false;

        $scope.updateMessage = function() {
            var key = 0;
            for(key in $scope.childrenElements) {
                var child = $scope.childrenElements[key];
                if(child.hasError) {
                    $scope.messageElement = child.messages;
                    break;
                }
            }
        };

        $scope.init = function() {
            var key = 0;
            for(key in $scope.childrenElements) {
                var child = $scope.childrenElements[key];
                if($scope.label === '' && child.label !== '') {
                    $scope.label = child.label;
                }
                if($scope.description === '' && child.description !== '') {
                    $scope.description = child.description;
                    $scope.showDescriptionIcon = true;
                }
            }
            $scope.updateMessage();
        };

        $scope.$on('update', $scope.updateMessage);
    }]);
})();

(function() {
    angular.module('forms-ui').directive('wfTooltip',function(){
        return{
            restrict: 'E',
            template: '<span class="tooltip-data"><a tabindex="0" class="popover-dismiss" role="tooltip" data-toggle="popover" data-trigger="focus"><span ng-bind="::popoverLinkText" class="hsbc-link"></span><i class="icon icon-circle-help-solid"></i></a></span>',
            scope: {
                popoverDescription: '=',
                popoverElementId:"=",
                popoverLinkText:"="
            },
            link : function(scope, element, attrs) {
                var popoverDescriptionText;
                if(scope.popoverDescription.indexOf('||') > -1 && scope.popoverDescription!==null){
                    popoverDescriptionText = scope.popoverDescription.split('||')[0];
                }else{
                   popoverDescriptionText = scope.popoverDescription;
               }
                $('.popover-dismiss').popover({
                    trigger: 'focus',
                    container: 'body',
                    content: "<button type='button' class='close close-btn' disabled='disabled' close-text='Close'><i class='icon icon-delete'></i></button><button class='tooltip-description' disabled='disabled'>"+popoverDescriptionText+"</button>",
                    html: true,
                    placement: 'top'
                });
            }
        };
    });
})();
/**
 * Function to generate auto complete,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-auto-complete',
            condition: function(el) {
                var checks = [
                    el.hasOptions,
                    el.styles.indexOf('wf_element_auto_complete') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function () {
    'use strict';
    var app = angular.module('forms-ui');

    function AutoCompleteControllerData($scope, $filter) {
       
        var dropAllOptions = [];
        var optionsLength = 0;
        var hoverOption = {};
        if(typeof $scope.element !== 'undefined' && typeof $scope.element.options !== 'undefined' && $scope.element.options.length > 0) {
            dropAllOptions = $scope.element.options;
        } else if(typeof $scope.element !== 'undefined' && typeof $scope.element.domain !== 'undefined' && $scope.element.domain.length > 0) {
            dropAllOptions = $scope.element.domain;
        } else {
           
        }
        function moveDown() {
            $scope.currentIndex = (optionsLength - 1 > $scope.currentIndex) ? $scope.currentIndex + 1 : 0;
            var option = options[$scope.currentIndex];

            $scope.selectedValue = option.displayValue;
            $scope.element.value = [option.value];
            scrollToElement();
            $scope.$emit('update');
        }

        function moveUp() {
            $scope.currentIndex = ($scope.currentIndex > 0) ? $scope.currentIndex - 1 : optionsLength - 1;
            var option = $scope.optionsArray[$scope.currentIndex];

            $scope.setHover(option);
            scrollToElement();
        }
        function setHover(option) {
            if($scope.dataValue !== '') {
                $scope.hoverValue = option.displayValue;
                hoverOption = option;
                $scope.onHover = true;
            }
        }
        function resetHover() {
            $scope.hoverValue = '';
            hoverOption = {};
            $scope.onHover = false;
        }
        function keyDown(event) {
            var option;
            switch (event.keyCode) {
                case 40:
                    if(typeof $scope.dataValue === 'string' && $scope.dataValue !== '') {
                        $scope.currentIndex = (optionsLength - 1 > $scope.currentIndex) ? $scope.currentIndex + 1 : 0;
                        hoverOption = $scope.optionsArray[$scope.currentIndex];
                        $scope.hoverValue = hoverOption.displayValue;
                        $scope.onHover = true;
                        //setHover(option);
                       
                        //moveDown();
                        //event.preventDefault();
                        
                    }
                    break; 
                case 38:
                    if(typeof $scope.dataValue === 'string' && $scope.dataValue !== '') {
                        $scope.currentIndex = (optionsLength - 1 > $scope.currentIndex) ? $scope.currentIndex + 1 : 0;
                        hoverOption = $scope.optionsArray[$scope.currentIndex];
                        $scope.hoverValue = hoverOption.displayValue;
                        $scope.onHover = true;
                       
                    }
                    break;
                case 13:
                    setOption(hoverOption, event);
                    $scope.optionsArray = [];
                    $scope.currentIndex = -1;
                    break;
                case 9:
                    resetHover();
                    $scope.optionsArray = [];
                    $scope.currentIndex = -1;
                    break;
            }
           
        }
        function keyEvent(event) {
        }
        function onChange(searchstring) {
        	$scope.isChanged = true;
            var optionsArray = [];
            if(typeof searchstring === 'string' && searchstring !== '') {
                for(var key in dropAllOptions) {
                    var optionData = dropAllOptions[key];

                    var regString = "^" + searchstring;
                    var regExp = new RegExp(regString, 'i');

                    var isValidOption = optionData.displayValue.search(regExp);
                    if(isValidOption > -1) {
                        var optionObject = optionData;
                        var replace = '<strong>' + searchstring + '</strong>';
                        regString = "^" + searchstring;
                        regExp = new RegExp(regString, 'g');
                        optionObject.displayText = optionData.displayValue.replace(regExp, replace);
                        optionsArray.push(optionObject);
                    }
                }
            }
            optionsLength = optionsArray.length;
            $scope.optionsArray = optionsArray;
        }
        function setOption(optionData, event) {
            hoverOption = {};
            if(event) {
                event.stopPropagation();
            }
            if(typeof optionData.displayValue === 'string' && optionData.displayValue !== '') {
                optionData.displayValue = optionData.displayValue.trim();
            }
            $scope.dataValue = optionData.displayValue;
            $scope.selectedValue = optionData.displayValue;
            $scope.element.value = [optionData.value];
            $scope.optionsArray = [];
            $scope.currentIndex = -1;
            $scope.hoverValue = '';
            $scope.onHover = false;
            $scope.$emit('update');
        }
        function init() {
            var currentKey = $scope.element.value[0];
            var key;
            for(key in dropAllOptions) {
                var option = dropAllOptions[key];
                if(option.value === currentKey) {
                    $scope.dataValue = option.displayValue;
                }
            }
        }
        function scrollToElement() {
            var container = angular.element('#' + $scope.dropdownId),
                scrollTo = angular.element('.' + $scope.optionIdPrefix + $scope.currentIndex);

            container.scrollTop(
                scrollTo.offset().top - container.offset().top + container.scrollTop()
            );
        }
        function changeFocus(){
            angular.element('#' + $scope.inputId).trigger('focus');
        }
        function checkOption(dataValue){
            if($scope.firstCheck && dataValue !== '' && !$scope.isChanged) {
                $scope.selectedValue = dataValue;
                $scope.firstCheck = false;
            }
            if($scope.selectedValue !== $scope.dataValue || $scope.dataValue === '') {
                $scope.dataValue = '';
                $scope.element.value = [];
                if($scope.hoverValue === '') {
                    $scope.$emit('update');
                }
            }
        }

        angular.element('body').click(function (event) {
            resetHover();
            $scope.optionsArray = [];
            $scope.currentIndex = -1;
            $scope.$apply();
        });
        $scope.firstCheck = true;
        $scope.isChanged = false;
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
        $scope.init = init;
        $scope.onChange = onChange;
        $scope.keyEvent = keyEvent;
        $scope.keyDown = keyDown;
        $scope.setOption = setOption;
        $scope.setHover = setHover;
        $scope.changeFocus = changeFocus;
        $scope.resetHover = resetHover;
        $scope.checkOption = checkOption;
        $scope.dataValue = '';
        $scope.onHover = false;
        $scope.optionsArray = [];
        $scope.currentIndex = -1;
        $scope.selectedValue = '';
        $scope.elementId = $scope.element.key;
        $scope.inputId = $scope.element.key + '-input';
        $scope.dropdownId = $scope.element.key + '-Dropdown-Container';
        $scope.optionIdPrefix = $scope.element.key + '-Dropdown-Option-';
    }

    app.controller('AutoCompleteControllerData', ['$scope', AutoCompleteControllerData]);
})();
/**
 * Function to generate percentage,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-amount',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_amount') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('AmountController', ["$scope", function ($scope) {
        var element = $scope.element;
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
        $scope.amountValue = convertAmount(element.value[0]);
        $scope.update = function() {
            element.value[0] = $scope.amountValue;
            $scope.amountValue = convertAmount($scope.amountValue);
            $scope.$emit('update');
        };
        function convertAmount(amount) {
            var amountWithCommas = '';
            var dotValue = '00';
            if(typeof amount !== 'undefined' && amount !== '') {
                var adddot = false;
                if(amount.indexOf('.') > -1){
                    var ammountArray = amount.split(".");
                    amount = ammountArray[0];
                    dotValue = ammountArray[1];
                    adddot = true;
                }
                amount = amount.replace(/,/g, '');
                var amountLength = amount.length - 1;
                var j = 0;
                for(var i = amountLength; i >= 0; i--) {
                    if((j%3) === 0 && j !== 0) {
                        amountWithCommas = ',' + amountWithCommas;
                    }
                    amountWithCommas =  amount[i] + amountWithCommas;
                    j++;
                }
                if(adddot) {
                    amountWithCommas = amountWithCommas + '.' + dotValue;
                }
            }
            return amountWithCommas;
        }
    }]);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry, $document) {
        ComponentRegistry.registerElement({
            name: 'wf-element-autotrigger-button',
            condition: function(el) {

                var checks = [                   
                    el.styles.indexOf('wf_element_autotrigger_button') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry", "$document"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('AutoTriggerController', ["$scope", function ($scope) {
        var portalType = localStorage.getItem('PortalType');
        $scope.trigger = (typeof portalType !== 'undefined' && portalType === 'staff-facing');
    }]);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry, $document) {
        ComponentRegistry.registerElement({
            name: 'wf-element-button-generate-download-pdf',
            condition: function(el) {

                var checks = [                   
                    el.isButton,
                    el.styles.indexOf('hsbc_btn_download') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry", "$document"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('DownloadPdfButtonController', ["$scope", "$rootScope", "$timeout", function ($scope, $rootScope, $timeout) {
        var locale = localStorage.getItem('locale');
        var timeStamp = '';
        var downloadPdf = false;
        var downloadPdfBtnClicked = false;
        var refreshCount = 0;
        var lastRefreshCount = 0;
        var formData = {};

        $scope.update = function() {
            $rootScope.$broadcast('SaveStatus');
            $timeout(function(){
                downloadPdfBtnClicked = true;
                $scope.$emit('update');
                $rootScope.$broadcast('saveProgress');
            }, 1000);
        };

        $scope.$on('updateUtag',function() {
            if(downloadPdfBtnClicked) {
                downloadPdfBtnClicked = false;
                $timeout(function() {
                    downloadPdf = true;
                    $scope.$emit('EEventToSetPDFData');
                }, 1000);
            }
        });

        $scope.$on('BEventToGeneratePDF', function($event, data) {
            if(typeof data !== 'undefined' && data !== '') {
                if(typeof pdfMake !== 'undefined') {
                    if(downloadPdf) {
                        downloadPdf = false;
                        generatePdfUsingPdfMake(data);
                    }
                } else {
                    throw new Error('Pdf Object missing to generate PDF');
                }
            }
        });

        function generatePdfUsingPdfMake(data) {
            pdfMake.fonts = {
                UniversFontForHSBC: {
                    normal: 'UniversNextforHSBCW01Rg.ttf'
                }
            };
            var locale = localStorage.getItem('locale');
            var defaultFont = 'UniversFontForHSBC';
            var docDefinition = {
                compress: false,
                pageSize: 'A4',
                font: defaultFont,
                defaultStyle: {
                    font: defaultFont
                },

                // by default we use portrait, you can change it to landscape if you wish
                pageOrientation: 'portrait',

                // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
                pageMargins: [ 50, 120, 50, 70 ],
                
                info: {
                    title: 'HSBC Onboarding Form',
                    author: 'HSBC',
                    subject: 'HSBC Onboarding Form',
                    keywords: 'HSBC Onboarding Form',
                },
                header: [
                    {
                    	image : 'data:image/png;base64,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',
                        alignment: 'center',
                        width : 200,
                        margin: [ 0, 5, 0, 5 ]
                    },{
                        text : 'Business Integrated Account Opening',
                        alignment: 'center',
                        margin: [ 0, 5, 0, 5 ],
                        fontSize: 20,
                    },{
                        text : 'Note: This document is for reference only and is not the actual application form',
                        alignment: 'center',
                        fontSize: 12
                    }
                ],
                footer: function(currentPage, pageCount) {
                    var footerData = {
                        text: 'Testing footer'
                    };
                    if(typeof currentPage !== 'undefined' && typeof pageCount !== 'undefined') {
                        footerData = {
                            text : currentPage.toString() + ' of ' + pageCount,
                            alignment: 'center',
                            fontSize: 10,
                            margin: [ 0, 10, 0, 10 ]
                        };
                    }
                    return footerData;
                },
                content: [
                    
                ],
                styles: {
                    header: {
                        fontSize: 16,
                        margin: [ 0, 10, 0, 5 ],
                    },
                    label: {
                        fontSize: 11,
                        margin: [ 0, 5, 0, 0 ],
                        padding: [ 5, 5, 5, 5 ]
                    }
                }
            };

            for (var key in data) {
                if(data[key].children) {
                    addSectionDetailsInPdf(data[key].children);
                    pdfMake.createPdf(docDefinition).download('hsbc-onbording-form.pdf');
                }
            }

            function inputHeading(heading) {
                if(typeof heading !== 'undefined' && heading !== '') {
                    docDefinition.content.push({text : heading, style: [ 'header']});
                }
            }

            function inputQuestion(label, data){
                if(typeof label !== 'undefined') {
                    label = (label)? label : ' ';
                    docDefinition.content.push({text : label, style: [ 'label']});
                }
                if(typeof data !== 'undefined') {
                    data = (data)? data : ' ';
                    var tableData = {
                        margin: [ 0, 3, 0, 5 ],
                        table: {
                            headerRows: 1,
                            widths: ['*'],
                            body: [
                              [ { text: data, margin: [ 5, 5, 5, 5 ]} ]
                            ]
                        }
                    };
                    docDefinition.content.push(tableData);
                }
            }

            function generateTableQuestion(content) {
                docDefinition.content.push({text : content.label});
                var tableData = {
                  table: {
                    headerRows: 1,
                    widths: [ '*', '*', 100, '*' ],
                    body: []
                  }
                };
                var tableBody = (content.tableBody) ? content.tableBody : [];
                var tempTableBody = [];
                for(var r in tableBody) {
                    if(typeof tableBody[r] !== 'undefined' && tableBody[r] !== null && tableBody[r].length > 0) {
                        tempTableBody.push(tableBody[r]);
                    }
                }
                tableBody = angular.copy(tempTableBody);
                var tableHeader = (content.tableHeader) ? content.tableHeader : [];
                tableHeader = angular.copy(tableHeader);
                var tableHeaderLength = Object.keys(tableHeader).length;
                if(tableHeaderLength > 0 && tableBody.length > 0) {
                    if(typeof tableBody[0] !== 'undefined' && tableBody[0].length > 0) {
                        if(tableBody[0].length !== tableHeaderLength) {
                            tableHeader = setReTableData(tableHeader, tableBody);
                        }
                    } else {
                        var rowData = [];
                        for(var headerTempKey in tableHeader) {
                            rowData[headerTempKey] = ' ';
                        }
                        tableBody.push(rowData);
                    }
                }
                var tableHeaderData = [];
                for(var colx in tableHeader) {
                    var colDatax =  (tableHeader[colx] === '') ? ' ' : tableHeader[colx];
                    tableHeaderData.push({text : colDatax});
                }
                tableData.table.body.push(tableHeaderData);
                for(var rowKey in tableBody) {
                    var colData = tableBody[rowKey];
                    var colInfo = [];
                    for(var colKey in colData) {
                        var valueData = (colData[colKey].value) ? colData[colKey].value : ' ';
                        colInfo.push({text : valueData});
                    }
                    tableData.table.body.push(colInfo);
                }
                docDefinition.content.push(tableData);
            }

            function setReTableData(tableHeader, tableBody) {
                var tableHeaderLength = Object.keys(tableHeader).length;
                if(tableBody[0].length > tableHeaderLength) {
                    for(var i = tableHeaderLength; i < tableBody[0].length; i++) {
                        tableHeader[i] = ' ';
                    }
                } else {
                    for(var j = tableBody[0].length; j < tableHeaderLength; j++) {
                        delete tableHeader[j];
                    }
                }
                return tableHeader;
            }

            function generateCapacityQuestion(data) {
                var isCapacityExist = false;
                if(typeof data.label !== 'undefined') {
                    var capacityLabel = (data.label)? data.label : ' ';
                    docDefinition.content.push({text : capacityLabel, style: [ 'label']});
                    isCapacityExist = true;
                }
                var capacityOptions = [];
                var capacityOtherFields = [];
                if(typeof data.selectCapacities !== 'undefined') {
                    for(var key in data.selectCapacities) {
                        var capacityElement = data.selectCapacities[key];
                        if(capacityElement.type === 'boolean') {
                            var labelString = (capacityElement.label)? capacityElement.label : '';
                            if(labelString !== '') {
                                capacityOptions.push(labelString);
                            }
                        } else {
                            if(typeof capacityElement.label !== 'undefined' && capacityElement.label !== '') {
                                var label = (capacityElement.label)? capacityElement.label : ' ';
                                capacityOtherFields.push({text : label, style: [ 'label']});
                            }
                            if(typeof capacityElement.value !== 'undefined' && capacityElement.value !== '') {
                                var value = (capacityElement.value)? capacityElement.value : ' ';
                                var tableData = {
                                    margin: [ 0, 3, 0, 5 ],
                                    table: {
                                        headerRows: 1,
                                        widths: ['*'],
                                        body: [
                                          [ { text: value, margin: [ 5, 5, 5, 5 ]} ]
                                        ]
                                    }
                                };
                                capacityOtherFields.push(tableData);
                            }
                        }
                    }
                }
                if(isCapacityExist) {
                    if(capacityOptions.length <= 0) {
                        capacityOptions.push(' ');
                    }
                    var capacityOptionsString = capacityOptions.join(', ');
                    var capacityTableData = {
                        margin: [ 0, 3, 0, 5 ],
                        table: {
                            headerRows: 1,
                            widths: ['*'],
                            body: [
                              [ { text: capacityOptionsString, margin: [ 5, 5, 5, 5 ]} ]
                            ]
                        }
                    };
                    docDefinition.content.push(capacityTableData);
                    if(capacityOtherFields.length > 0) {
                        docDefinition.content.push(capacityOtherFields);
                    }
                }
            }

            function addSectionDetailsInPdf(data) {
                for (var key in data) {
                    var section = data[key];
                    inputHeading(section.title);
                    if(section.children && typeof section.children === 'object' && Object.keys(section.children).length > 0) {
                        addSectionDetailsInPdf(section.children);
                    } else if(section.content && typeof section.content === 'object' && Object.keys(section.content).length > 0) {
                        var contentData = section.content;
                        for (var contentKey in contentData) {
                            var content = contentData[contentKey];
                            if(typeof content.type !== 'undefined') {
                                if(content.type === 'table') {
                                    generateTableQuestion(content);
                                } else if(content.type === 'capacity') {
                                    generateCapacityQuestion(content);
                                } else {
                                    inputQuestion(content.label, content.value);
                                }
                            }
                        }
                    }
                }
            }
        }
    }]);
})();
/**
 * Function to generate group of checkboxes,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-checkbox-group',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_checkbox_group') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {

    /**
     * Controller for checkbox-group components
     * Adds a mapper between options and values to local scope
     * @ngInject
     */
    function CheckboxGroupController($scope) {
        var ctrl = this;
        var element = $scope.element;
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
        
        ctrl.valueMap = {};
        element.options.forEach(mapValues);

        ctrl.updateValues = function() {
            var options = element.options;
            var index = options.length;
            var values = [];

            while (index--) {
                if (ctrl.valueMap[index]) {
                    values.unshift(options[index].value);
                }
            }

            $scope.element.value = values;
            $scope.$emit('update');
        };

        function mapValues(option, index) {
            if (element.value.indexOf(option.value) > -1) {
                ctrl.valueMap[index] = true;
            }
        }
    }
    CheckboxGroupController.$inject = ["$scope"];

    angular.module('forms-ui').controller('CheckboxGroupController', CheckboxGroupController);
})();

/**
 * Function to generate currency fields,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-container-currency',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf('wf_container_currency') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('CurrencyController', ["$scope", function ($scope) {
        var element = $scope.element;
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
        $scope.childrenElements = $scope.element.children;
        $scope.messageElement = [];
        $scope.label = '';
        $scope.description = '';
        $scope.showDescriptionIcon = false;
        $scope.updateMessage = function() {
            var key = 0;
            for(key in $scope.childrenElements) {
                var child = $scope.childrenElements[key];
                if(child.hasError) {
                    $scope.messageElement = child.messages;
                    break;
                }
            }
        };

        $scope.init = function() {
            var key = 0;
            for(key in $scope.childrenElements) {
                var child = $scope.childrenElements[key];
                if($scope.label === '' && child.label !== '') {
                    $scope.label = child.label;
                    $scope.childrenElements[key]._e.questionText = '';
                }
                if($scope.description === '' && child.description !== '') {
                    if(child.description.indexOf('||') > -1) {
                        $scope.description = child.description.substring(0, child.description.indexOf('|'));
                        if ($scope.description !== '') {
                            $scope.showDescriptionIcon = true;
                        }
                    } else {
                        $scope.showDescriptionIcon = true;
                    }
                    $scope.childrenElements[key]._e.description = '';
                }
            }
            $scope.updateMessage();
        };

        $scope.$on('update', $scope.updateMessage);
    }]);
})();
/**
 * Function to generate input,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-datepicker',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_datepicker') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('WfDatepickerController', ["$scope", function ($scope) {
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
        $scope.dd = '';
        $scope.mm = '';
        $scope.yyyy = '';
        $scope.date = $scope.element.value[0];
        $scope.dateArray = [];
        $scope.invalidDate = false;
        $scope.dateMessages = [];
       
        if($scope.date) {
            $scope.dateArray = $scope.date.split("-");
        }
        if($scope.dateArray.length > 0){
            $scope.yyyy = $scope.dateArray[0];
            $scope.mm = $scope.dateArray[1];
            $scope.dd = $scope.dateArray[2];
           
        }
        $scope.updateDate = function() {
          
            var invalidDate = false;
            var yyyy = (typeof $scope.yyyy !== 'undefined') ? parseInt($scope.yyyy) : 0;
            var dd = (typeof $scope.dd !== 'undefined') ? parseInt($scope.dd) : 0;
            var mm = (typeof $scope.mm !== 'undefined') ? parseInt($scope.mm) : 0;
            if(yyyy < 1000) {
                $scope.yyyy = '';
                invalidDate = true;
            }

            if(mm < 1 || mm > 12) {
                $scope.mm = '';
                invalidDate = true;
            }

            if(dd < 1 || dd > 31) {
                $scope.dd = '';
                invalidDate = true;
            }

            var data='';
            if(typeof $scope.yyyy !== 'undefined' && $scope.yyyy !== '' && typeof $scope.mm !== 'undefined' &&  $scope.mm !== '' && typeof $scope.dd !== 'undefined' &&  $scope.dd !== '') {
                data = yyyy + "-" + mm + "-" + dd;
                $scope.element.value = [data];
                $scope.$emit('update');
            }
            else
            {
            	$scope.element.value = [data];
                $scope.$emit('update');
            }
        };
    }]);
})();
/**
 * Function to generate input,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-download-checklist',
            condition: function(el) {
                var checks = [
                    el.isButton,
                    el.styles.indexOf('wf_element_download_checklist') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('DownloadChecklistController', ["$scope", function($scope) {
        var element = $scope.element;
        var documentChecklist = localStorage.getItem('documentChecklist');
        documentChecklist = JSON.parse(documentChecklist);
        $scope.documentName = documentChecklist[element.name];
        $scope.documentUrl = $scope.documentName;
    }]);
})();

/**
 * Function to generate droopdown,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-dropdown',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_dropdown') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {

    angular.module('forms-ui').controller('DropdownController', [ "$scope", "$rootScope", function($scope, $rootScope) {
        var readonlyField = false;
        var options = [];
        var optionsLength = 0;
        var dropdownKey = $scope.element.key;
        var isValueExist = false;
        $scope.elementId = $scope.element.key;
        $scope.dropdownId = $scope.element.key + '-Dropdown-Container';
        $scope.optionIdPrefix = $scope.element.key + '-Dropdown-Option-';
        $scope.currentIndex = -1;
        $scope.isOpen = false;
        $scope.selectedValue = '';
        $scope.tooltipText = '';

        $rootScope.$on('updateUtag', function() {
            $scope.setDropDownValue();
        });
        $scope.setDropDownValue = function() {
            readonlyField = ($scope.element._e.readonly || $scope.element._e.disabled) ? true : false;
            options = $scope.element.options;
            dropdownKey = $scope.element.key;
            optionsLength = parseInt(options.length);
            isValueExist = ($scope.element.value.length > 0 && typeof $scope.element.value[0] !== 'undefined' && $scope.element.value[0] !== '');
            $scope.elementId = $scope.element.key;
            $scope.dropdownId = $scope.element.key + '-Dropdown-Container';
            $scope.optionIdPrefix = $scope.element.key + '-Dropdown-Option-';
            $scope.currentIndex = -1;
            $scope.isOpen = false;
            $scope.selectedValue = '';
            $scope.tooltipText = '';
            if (typeof $scope.element._e !== 'undefined' && typeof $scope.element._e.explainText !== 'undefined' && $scope.element._e.explainText !== null) {
                if ($scope.element._e.explainText.indexOf('||') > -1) {
                    var tooltipAndPlaceholderArray = $scope.element._e.explainText.split('||');
                    if (typeof tooltipAndPlaceholderArray[0] !== 'undefined' && tooltipAndPlaceholderArray[0] !== '' && tooltipAndPlaceholderArray[0] !== null) {
                        $scope.tooltipText = tooltipAndPlaceholderArray[0];
                    }
                    if (typeof tooltipAndPlaceholderArray[1] !== 'undefined' && tooltipAndPlaceholderArray[1] !== '' && tooltipAndPlaceholderArray[1] !== null) {
                        $scope.selectedValue = tooltipAndPlaceholderArray[1];
                    }
                } else {
                    $scope.tooltipText = $scope.element._e.explainText;
                }
            }
            if (isValueExist) {
                for ( var optionKey in options) {

                    var optionData = options[optionKey];
                    if (typeof optionData !== 'undefined' && typeof optionData.value !== 'undefined' && $scope.element.value.indexOf(optionData.value) > -1) {
                        $scope.selectedValue = optionData.displayValue;
                        $scope.currentIndex = parseInt(optionKey);
                    }
                }
            }
        };

        $rootScope.$on('closeDropDown', function($event, id) {
            if (id !== $scope.element.key) {
                $scope.isOpen = false;
            }
        });
        $scope.triggerDropdoen = function(event) {
            if (readonlyField === false) {
                $scope.isOpen = !$scope.isOpen;
                $rootScope.$broadcast('closeDropDown', $scope.element.key);
                if (event) {
                    event.stopPropagation();
                }
            }
        };
        $scope.select = function(option, index) {
            $scope.selectedValue = option.displayValue;
            $scope.element.value = [ option.value ];
            $scope.$emit('update');
            $scope.currentIndex = index;
            $scope.isOpen = false;
            scrollToElement();
        };
        $scope.keyEvent = function(event) {
            if (readonlyField === false) {
                if (event.keyCode === 13) {
                    $scope.isOpen = ($scope.isOpen) ? false : true;
                    if (!$scope.isOpen) {
                        $scope.$emit('update');
                    }
                    event.preventDefault();
                    event.stopPropagation();
                } else if (event.keyCode === 40) {
                    if ($scope.currentIndex === -1) {
                        $scope.currentIndex = 0;
                    } else {
                        $scope.currentIndex = (optionsLength - 1 > $scope.currentIndex) ? $scope.currentIndex + 1 : 0;
                    }
                    $scope.currentIndex = parseInt($scope.currentIndex);
                    var container = angular.element('#' + $scope.dropdownId);
                    var scrollTo = angular.element('.' + $scope.optionIdPrefix + $scope.currentIndex);

                    container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
                    if (typeof options[$scope.currentIndex] !== 'undefined') {
                        var option = options[$scope.currentIndex];
                        $scope.selectedValue = option.displayValue;
                        $scope.element.value = [ option.value ];
                    }
                    event.preventDefault();
                    event.stopPropagation();
                } else if (event.keyCode === 38) {
                    $scope.currentIndex = ($scope.currentIndex > 0) ? $scope.currentIndex - 1 : optionsLength - 1;
                    $scope.currentIndex = parseInt($scope.currentIndex);
                    var containerUp = angular.element('#' + $scope.dropdownId);
                    var scrollToUp = angular.element('.' + $scope.optionIdPrefix + $scope.currentIndex);

                    containerUp.scrollTop(scrollToUp.offset().top - containerUp.offset().top + containerUp.scrollTop());
                    if (typeof options[$scope.currentIndex] !== 'undefined') {
                        var optionUp = options[$scope.currentIndex];
                        $scope.selectedValue = optionUp.displayValue;
                        $scope.element.value = [ optionUp.value ];
                    }
                    event.preventDefault();
                    event.stopPropagation();
                } else if (event.keyCode === 9) {
                    $scope.isOpen = false;
                    $scope.$emit('update');
                } else {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };
        $scope.keyDown = function(event) {
            switch (event.keyCode) {
            case 40:
                moveDown();
                event.preventDefault();
                event.stopPropagation();
                break;
            case 38:
                moveUp();
                event.preventDefault();
                event.stopPropagation();
                break;
            case 9:
                $scope.isOpen = false;
                break;
            case 13:
                $scope.isOpen = true;
                event.preventDefault();
                event.stopPropagation();
                break;
            default:
                event.preventDefault();
                event.stopPropagation();
            }
            /*
             * if(event.keyCode ===40){ moveDown(); event.preventDefault();
             * event.stopPropagation(); } if(event.keyCode ===38){ moveUp();
             * event.preventDefault(); event.stopPropagation(); }
             * if(event.keyCode === 9 || event.keyCode === 13) { $scope.isOpen =
             * false; }
             */
        };
        function moveDown() {
            if ($scope.currentIndex === -1) {
                $scope.currentIndex = 0;
            } else {
                $scope.currentIndex = (optionsLength - 1 > $scope.currentIndex) ? $scope.currentIndex + 1 : 0;
            }
            $scope.currentIndex = parseInt($scope.currentIndex);
            if (typeof options[$scope.currentIndex] !== 'undefined') {
                var option = options[$scope.currentIndex];

                $scope.selectedValue = option.displayValue;
                $scope.element.value = [ option.value ];
                scrollToElement();
                $scope.$emit('update');
            }
        }
        function moveUp() {
            $scope.currentIndex = ($scope.currentIndex > 0) ? $scope.currentIndex - 1 : optionsLength - 1;
            $scope.currentIndex = parseInt($scope.currentIndex);

            if (typeof options[$scope.currentIndex] !== 'undefined') {
                var option = options[$scope.currentIndex];

                $scope.selectedValue = option.displayValue;
                $scope.element.value = [ option.value ];
                scrollToElement();
                $scope.$emit('update');
            }
        }
        function scrollToElement() {
            var container = angular.element('#' + $scope.dropdownId), scrollTo = angular.element('.' + $scope.optionIdPrefix + $scope.currentIndex);

            container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
        }
        angular.element('body').click(function(event) {
            if ($scope.isOpen) {
                $scope.isOpen = false;
                $scope.$emit('update');
                $scope.$apply();
            }
        });
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
    } ]);
})();
/**
 * Function to generate input,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-label',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_label') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('LabelController', ["$scope", function ($scope) {
        $scope.update = function(){
            if(typeof $scope.element.value[0] !== 'undefined' && $scope.element.value[0] !== '' && $scope.element.value[0].length > 0) {
                $scope.element.value[0]= $scope.element.value[0].trim();
            }
            $scope.$emit('update');
        };
    }]);
})();

/**
 * Function to generate input,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-form-notification',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf('form_notification') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('FormNotificationController', ["$scope", function ($scope) {
        $scope.getClasses = function(child) {
            var result = '';
            if(typeof child._e.styles !== 'undefined' && child._e.styles.length > 0) {
                for(var key in child._e.styles) {
                    var className = child._e.styles[key];
                    className = className.replace(/_/g, '-');
                    result = result + ' ' + className;
                }
            }
            return result;
        };
    }]);
})();
/**
 * Function to generate multi select,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-multi-select',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_multi_select') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {

    angular.module('forms-ui').controller('MultiSelectController', ["$scope", "$filter", function ($scope, $filter) {
        var dropAllOptions = $scope.element.options;
        var dropDownValues = $scope.element.value;
        var dropDownOptions = [];
        var hoverOption = {};
        var optionsLength =0;
        $scope.elementId = $scope.element.key;
        $scope.inputId = $scope.element.key + '-input';
        $scope.dropdownId = $scope.element.key + '-Dropdown-Container';
        $scope.optionIdPrefix = $scope.element.key + '-Dropdown-Option-';
        $scope.selectOptions = [];
        $scope.fetchText = '';
        $scope.currentIndex = -1;
        $scope.hoverValue = '';
        $scope.fetchTextOptions = [];
        $scope.onHover = false;
        
        
        $scope.setHover = function(option) {
        	if($scope.fetchText !== '' && typeof option.displayValue !== 'undefined') {
                $scope.hoverValue = option.displayValue;
                hoverOption = option;
                $scope.onHover = true;
            }
        };
        $scope.resetHover = function(option) {
            $scope.hoverValue = '';
            hoverOption = {};
            $scope.onHover = false;
        };

        $scope.selectThisOption = function(option, event) {
            if(event) {
                event.stopPropagation();
            }
            dropDownValues.push(option.value);
            setDropDownOptions();
            $scope.element.value = dropDownValues;
            $scope.onHover = false;
            $scope.$emit('update');
        };
        
        $scope.init = function() {
            var key;
            for(key in dropAllOptions) {
                var option = dropAllOptions[key];
                if(dropDownValues.indexOf(option.value) < 0) {
                    dropDownOptions.push(option);
                } else {
                    $scope.selectOptions.push(option);
                }
            }
        };
        
        $scope.removeOption = function(option) {
            var index = dropDownValues.indexOf(option.value);
            dropDownValues.splice(index, 1);
            setDropDownOptions();
            $scope.element.value = dropDownValues;
            $scope.$emit('update');
        };
        
        $scope.fetchOption = function() {
            if($scope.fetchText !== '') {
                $scope.fetchTextOptions = $filter('filter')(dropDownOptions, {displayValue: $scope.fetchText}, function(actual, expected){
                    var regString = "^" + expected;
                    var regExp = new RegExp(regString, 'i');
                    var isValidOption = actual.search(regExp);
                    return (isValidOption > -1);
                });
            } else {
                $scope.fetchTextOptions = [];
            }
            optionsLength = $scope.fetchTextOptions.length;
            //$scope.hoverValue = (optionsLength > 0) ? $scope.fetchTextOptions[0].displayValue : '';
            hoverOption = {};
        };

        function setDropDownOptions() {
            var key;
            var newDropDownOptions = [];
            var selectedOptions = [];
            for(key in dropAllOptions) {
                var option = dropAllOptions[key];
                if(dropDownValues.indexOf(option.value) < 0) {
                    newDropDownOptions.push(option);
                } else {
                    selectedOptions.push(option);
                }
            }

            dropDownOptions = newDropDownOptions;
            $scope.selectOptions = selectedOptions;
            $scope.fetchText = '';
            $scope.currentIndex = -1;
            hoverOption = {};
            $scope.hoverValue = '';
        }
        
        $scope.keyEvent = function (event) {
            switch (event.keyCode) {
                case 40:
                    moveDown();
                    break; 
                case 38:
                    moveUp();
                    break;
                case 13:
                    $scope.selectThisOption(hoverOption);
                    break; 
                default: 
                    $scope.fetchOption();
            }
        };
        $scope.keyDown = function (event) {
            if(event.keyCode === 9) {
                $scope.resetOptions();
            }
        };

        function moveDown() {
            $scope.currentIndex = (optionsLength - 1 > $scope.currentIndex) ? $scope.currentIndex + 1 : 0;
            var option = $scope.fetchTextOptions[$scope.currentIndex];

            $scope.setHover(option);
            scrollToElement();
        }

        function moveUp() {
            $scope.currentIndex = ($scope.currentIndex > 0) ? $scope.currentIndex - 1 : optionsLength - 1;
            var option = $scope.fetchTextOptions[$scope.currentIndex];

            $scope.setHover(option);
            scrollToElement();
        }

        function scrollToElement() {
            if($scope.fetchTextOptions.length > 0) {
                var container = angular.element('#' + $scope.dropdownId),
                    scrollTo = angular.element('.' + $scope.optionIdPrefix + $scope.currentIndex);

                container.scrollTop(
                    scrollTo.offset().top - container.offset().top + container.scrollTop()
                );
            }
        }
        
        $scope.resetOptions = function(){
            $scope.fetchText = '';
            $scope.currentIndex = -1;
            $scope.hoverValue = '';
            hoverOption = {};
            $scope.fetchTextOptions = [];
            $scope.$apply();
        };
        
        angular.element('body').click(function (event) {
            $scope.resetOptions();
        });
        
        $scope.changeFocus = function(){
        	$scope.onHover = false;
            angular.element('#' + $scope.inputId).trigger('focus');
        };
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
    }]);

})();

(function() {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name : 'wf-element-page-tag',
            condition : function(el) {
                var checks = [ el.styles.indexOf("wf_element_page_tag") > -1 ];

                var score = checks.filter(function(value) {
                    return value;
                });

                return {
                    score : score.length,
                    totalMatch : score.length === checks.length
                };
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
/**
 * Function to generate input,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-dropdown-disabled-like-text',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_dropdown_disabled_like_text') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('DropdownDisabledLikeTextController', ["$scope", "$rootScope", function ($scope, $rootScope) {
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
        $scope.selectedValue = '';
        $scope.tooltipText = '';
        $rootScope.$on('updateUtag', function(){
            $scope.setDropDownValue();
        });
        $scope.setDropDownValue =  function(){
            var options = $scope.element.options;
            var isValueExist = ($scope.element.value.length > 0 && typeof $scope.element.value[0] !== 'undefined' && $scope.element.value[0] !== '');
            if(typeof $scope.element._e !== 'undefined' && typeof $scope.element._e.explainText !== 'undefined' && $scope.element._e.explainText !== null){
                if($scope.element._e.explainText.indexOf('||') > -1){
                    var tooltipAndPlaceholderArray = $scope.element._e.explainText.split('||');
                    if(typeof tooltipAndPlaceholderArray[0] !== 'undefined' && tooltipAndPlaceholderArray[0] !== '' && tooltipAndPlaceholderArray[0] !== null) {
                        $scope.tooltipText = tooltipAndPlaceholderArray[0];
                    }
                    if(typeof tooltipAndPlaceholderArray[1] !== 'undefined' && tooltipAndPlaceholderArray[1] !== '' && tooltipAndPlaceholderArray[1] !== null) {
                        $scope.selectedValue = tooltipAndPlaceholderArray[1];
                    }
                } else {
                    $scope.tooltipText = $scope.element._e.explainText;
                }
            }
            if(isValueExist) {
                for(var optionKey in options) {
                    var optionData = options[optionKey];
                    if(typeof optionData !== 'undefined' && typeof optionData.value !== 'undefined' && $scope.element.value.indexOf(optionData.value) > -1) {
                        $scope.selectedValue = optionData.displayValue;
                    }
                }
            }
        };
    }]);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-button-link',
            condition: function(el) {
                var checks = [
                    el.isButton,
                    el.styles.indexOf('wf_element_button_link') >-1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').directive('buttonLinkDirective',  /*@ngInject*/ function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs,$filter) {
                var caption = $scope.$parent.element._e.caption.split('||');
                var context = (element.context)?element.context:element[0];
                $scope.caption = caption[0];
                $scope.link = caption[1];
                $scope.popupLink = function () {
                    if($scope.element.styles.indexOf('new_window') >-1){
                        window.open($scope.link,"_blank");
                    } else {
                        var width = 730;
                        var height = 500;
                        var popup_x  = (screen.width  - width) / 2;
                        var popup_y  = (screen.height - height) / 2;
                        window.open($scope.link,'importantPages','width='+width+',height='+height+',resizable=yes,menubar=no,toolbar=no,directories=no,location=no,scrollbars=yes,status=no,left='+popup_x+',top='+popup_y);
                    }
                };
            }
        };
    });
})();

/**
 * Function to generate password,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-password',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_password') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('PasswordController', ["$scope", function ($scope) {
        var updateOnKeyPress = (typeof $scope.element.styles !== 'undefined' && $scope.element.styles.indexOf('wf_trigger_keypress') > -1);
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
        $scope.fieldType = 'password';
        $scope.showText = 'SHOW';
        $scope.hideText = 'HIDE';
        $scope.description = '';
        $scope.changeFieldType = function(type) {
            $scope.fieldType = type;
        };
        $scope.mouseover= function(element){
        	$scope.isdisabled = $scope.element._e.readonly;    
        };
        $scope.showHideText = function(elementData){
            if(typeof elementData.description === 'string' && elementData.description !== '') {
                $scope.description = elementData.description;
                var description = elementData.description;
                if(description.indexOf('||')> -1) {
                    var descriptionArray = description.split('||');
                    if(descriptionArray.length > 1) {
                        $scope.description = descriptionArray[0];
                        var hideShowData = descriptionArray[1];
                        if(hideShowData.indexOf('|')) {
                            var hideShowArray = hideShowData.split('|');
                            if(hideShowArray.length > 1) {
                                $scope.showText = hideShowArray[0];
                                $scope.hideText = hideShowArray[1];
                            }
                        }
                    }
                }
            }
        };
        $scope.keyPress = function(event) {
            if(updateOnKeyPress) {
                $scope.$emit($scope.element.name, $scope.element.value[0]);
            }
        };
        $scope.update = function(){
            $scope.$emit($scope.element.name, $scope.element.value[0]);
            $scope.$emit('update');
        };
        $scope.showHideText($scope.element);
        $scope.update();
    }]);
})();

/**
 * Function to generate checkbox,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-checkbox',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_checkbox') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function () {
    /**
     * @ngInject
     */
    function registerElement(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-radio-group',
            controller: 'ElementRadioGroupController as controller',
            condition: function (el) {
                var checks = [
                    el.hasOptions,
                    !el.multiple,
                    el.styles.indexOf('wf_element_radio_group') > -1
                ];
                

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }

        });
    }
    registerElement.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerElement);
})();

(function() {

    /**
     * Controller for checkbox-group components
     * Adds a mapper between options and values to local scope
     * @ngInject
     */
    function ElementRadioGroupController($scope) {
        this.dataElement = $scope.$parent.element._e;
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
    }
    ElementRadioGroupController.$inject = ["$scope"];
    angular.module('forms-ui').controller('ElementRadioGroupController', ['$scope', ElementRadioGroupController]);
})();

(function() {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'wf-element-setlanguage',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_setlanguage') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function () {
    angular.module('forms-ui').controller('SetlanguageController', ["$scope", function ($scope) {
        var languages = {'en-us':'en_us', 'zh-hk':'zh_hk', 'zh-cn':'zh_cn'};
        $scope.updateOnInit = function(){
            var locale = localStorage.getItem('locale');
            $scope.element.value[0] = languages[locale];
            $scope.$emit('update');
        };
    }]);
})();

/**
 * Function to generate statement agree,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-statement-agree',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_statement_agree') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').directive('statementAgree', function() {
        return {
            restrict : 'A',
            link : function($scope, element, attrs, $filter) {
                $scope.collapse = false;
                var context = (element.context) ? element.context : element[0];
            }
        };
    }).controller('statementAgreeController', [ "$scope", function($scope) {
        var element = $scope.element;

        $scope.statementAgreeValue = false;
        $scope.label = '';
        $scope.linkUrl = '';
        $scope.linkLabel = '';
        $scope.statementList = [];

        if ((typeof element.value[0] === 'string' && element.value[0] === 'true') || (typeof element.value[0] === 'boolean')) {
            element.value[0] = true;
            $scope.statementAgreeValue = true;
        }
        $scope.updateField = function() {
            $scope.element.value[0] = $scope.statementAgreeValue;
            $scope.$emit('update');
        };
        $scope.changesValue = function(event) {
            if (event) {
                event.stopPropagation();
            }
            if (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
                $scope.statementAgreeValue = !$scope.statementAgreeValue;
                $scope.updateField();
            }
        };
        $scope.init = function(dataType, labelString) {
            var inputArray = labelString.split("||");
            if (dataType === 'boolean' && inputArray.length === 3) {
                $scope.label = inputArray[0];
                $scope.linkUrl = 'http://' + inputArray[2];
                if ($scope.linkLabel === '') {
                    $scope.linkLabel = inputArray[1];
                }
            } else {
                $scope.label = labelString;
            }
        };
        $scope.initMultiLabel = function(dataType, labelString) {
            var contentArray = labelString.split("&&");
            for (var i = 0; i < contentArray.length; i++) {
                var stateItem = {};
                var inputArray = contentArray[i].split("||");
                if (dataType === 'boolean' && inputArray.length === 3) {
                    stateItem.label = inputArray[0];
                    stateItem.linkUrl = 'http://' + inputArray[2];
                    stateItem.linkLabel = inputArray[1];
                } else {
                    stateItem.label = inputArray[0];
                }
                $scope.statementList.push(stateItem);
            }
        };
        $scope.popupLink = function(link) {
            var width = 730;
            var height = 500;
            var popup_x = (screen.width - width) / 2;
            var popup_y = (screen.height - height) / 2;
            window.open(link, 'importantPages', 'width=' + width + ',height=' + height + ',resizable=yes,menubar=no,toolbar=no,directories=no,location=no,scrollbars=yes,status=no,left=' + popup_x + ',top=' + popup_y);
        };
    } ]);
})();
/**
 * Function to generate input,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-text',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_text') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('TextController', ["$scope", function ($scope) {
        $scope.update = function(){
            if(typeof $scope.element.value[0] !== 'undefined' && $scope.element.value[0] !== ''  && $scope.element.value[0].length > 0 && $scope.element.dataType === 'text') {
                $scope.element.value[0]= $scope.element.value[0].trim();
            }
            $scope.$emit('update');
        };
        $scope.popoverElementId = 'PopoverElementId-' + $scope.element.key;
    }]);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-unordered-list',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf("unordered_list") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('unOrderListController', ["$scope", function ($scope) {

    }]);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-form-primary-container',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf("form_primary_container") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('FormPrimaryContainerController', [ "$scope", "$rootScope", "$timeout", function($scope, $rootScope, $timeout) {
        $rootScope.project = 'onbording';
        $scope.reviewNotification = {};
        $scope.showReviewNotification = false;
        $scope.isSystemNotification = false;
        function getElementsStyleName(element) {
            var elementByStyleName = [];
            for (var i = 0; i < element.length; i++) {
                var currentElement = element[i];
                if (currentElement.styles[0] === 'form_notification') {
                    var currentElementName = currentElement.name.toString();
                    var className = currentElement.styles[0];
                    elementByStyleName[className] = (!elementByStyleName[className]) ? [] : elementByStyleName[className];
                    elementByStyleName[className][currentElementName] = currentElement;
                } else {
                    elementByStyleName[currentElement.styles[0]] = currentElement;
                }

            }
            return elementByStyleName;
        }
        var element = $scope.element;
        var elementByStyleName = getElementsStyleName(element.children);
        var formElement = elementByStyleName.form_secondary_container;
        var formElementStyleName = getElementsStyleName(formElement.children);
        this.formReviewNotification = {};
        if (elementByStyleName.form_review_notification) {
            this.formReviewNotification = elementByStyleName.form_review_notification;
        }
        this.notificationElementContainer = {};
        this.ODCTRedirection = {};
        if (elementByStyleName.form_notification) {
            var notificationOBj = elementByStyleName.form_notification;
            this.notificationElementContainer = (notificationOBj.FormLevelErrorNotification) ? notificationOBj.FormLevelErrorNotification : {};
            this.ODCTRedirection = (notificationOBj.ODCTRedirection) ? notificationOBj.ODCTRedirection : {};
        }
        this.formSecondaryContainer = formElement._e;
        this.headerElement = elementByStyleName.form_primary_header._e;
        this.headerElementContainer = elementByStyleName.form_primary_header;
        this.formSecondaryLeftContainer = formElementStyleName.form_secondary_left_container;
        this.formSecondaryRightContainer = formElementStyleName.form_secondary_right_container;
        this.formControleLinks = elementByStyleName.form_controle_links;
        this.incorrectAttempts = elementByStyleName.error_text;
        this.formReviewContainer = {};
        if (formElementStyleName.form_review_left_container) {
            this.formReviewContainer = formElementStyleName.form_review_left_container;
        }
        this.systemNotificationElement = {};
        if (elementByStyleName.system_notification) {
            this.systemNotificationElement = elementByStyleName.system_notification;
        }
        $scope.showReviewNotification = false;
        this.moveToElement = function(elementId) {
            var element = angular.element('#' + elementId);
            var scrollValue = element.offset().top;
            scrollValue = parseInt(scrollValue) - 160;
            var bodyElement = angular.element('html, body');
            bodyElement.animate({
                scrollTop : scrollValue
            });
        };
        $rootScope.$on('setReviewNotification', function($event, data) {
            for ( var key in data) {
                if (data[key].children) {
                    $scope.reviewNotification = data[key].children;
                }
            }
            var elementString = JSON.stringify($scope.reviewNotification);
            var messagePosition = elementString.indexOf('"error":true');
            if (messagePosition > 0) {
                $scope.showReviewNotification = true;
            } else {
                $scope.showReviewNotification = false;
            }
        });
        $rootScope.$on('triggerSystemNotification', function($event, message) {
            $scope.isSystemNotification = true;
        });
        $scope.$on('EEventCheckAndSetErrorAndChangeFocus', function($event, message) {
            updateNotification();
        });
        var updateNotification = function() {
            $timeout(function() {
                var notificationParentName = 'FormLevelErrorNotificationText';
                var element = $scope.element;
                var elementString = JSON.stringify(element);
                var messagePosition = elementString.indexOf('ERROR');
                var data = {
                    name : notificationParentName,
                    value : (messagePosition > 0) ? true : false
                };
                if (data.value === true) {
                    $scope.$emit('EEventSetHiddenValue', data);
                }

                try {
                    var topElement = $('#hsbc-odct-header').offset();
                    if (messagePosition > 0) {

                        $('html, body').scrollTop(topElement.top);
                    }

                } catch (err) {
                    // code here
                }

                var target = angular.element('.lightbox-popup');
                if (typeof target.scrollTop !== 'undefined') {
                    try {

                        var lightBoxHeight = target.scrollTop;
                        angular.element(target).scrollTop(lightBoxHeight);
                    } catch (err) {
                        // code here
                    }
                }
            }, 500);
        };

        $scope.onLoadPrimaryContainer = function() {
            var topElement = $('#hsbc-odct-header').offset();
            if (typeof topElement.top !== 'undefined') {
                $('html, body').scrollTop(topElement.top);
            }
        };
    } ]);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-form-table',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf("hsbc_table") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('FormTableController', ["$scope", "$rootScope", function ($scope, $rootScope) {
        $scope.noRowsFound = true;
        $scope.listarray={};
        var value={};
        function generateTable(){
            $scope.tableData = $scope.element;
            if($scope.element.children.length === 1 ) {
            $scope.noRowsFound = false;
            } else{
                  $scope.noRowsFound = true;
            }
        }
        $scope.iterateCAll = function(data){
            var returnData={};
            returnData.lable=data.substring(0,data.indexOf('|')-1);
            returnData.toolTipText=data.substring(data.indexOf('|')+2);
            return returnData;
        };
        generateTable();
        $rootScope.$on('updateUtag',generateTable);
    }]);
})();
(function() {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerControl({
            name: 'wf-hidden-attribute',
            condition: function(el) {
                var checks = [
                    el.dataType === 'boolean',
                    el.styles.indexOf('hidden_attribute') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();

(function () {
    angular.module('forms-ui').directive('hiddenAttribute', ["$rootScope", function ($rootScope) {
        return {

            restrict: 'A',
            link: function ($scope, element, attrs, formsController) {
                var context = (element.context) ? element.context : element[0];
                var foundElement = !$scope.element;
                while (!foundElement) {
                    if ($scope.$parent) foundElement = $scope.$parent.element;
                    else foundElement = 1;
                }

                if (foundElement && foundElement != 1) {
                    $scope.$parent.element = foundElement;
                }

                $scope.$on('BEventSetHiddenValue', setHiddenValue);
                function setHiddenValue($event, data){
                    if(data.name && $scope.element.styles.indexOf(data.name) > -1 && $scope.element.styles.indexOf('hidden_attribute') > -1) {
                        if($scope.element.styles.indexOf('tickmark_false') > -1) {
                            if(data.value === false) {
                                $scope.element.value = [data.value];
                                $scope.$emit('update');
                            }
                        } else {
                            $scope.element.value = [data.value];
                            $scope.$emit('update');
                        }
                    }
                }
            }
        };
    }]);
})();
angular.module('forms-ui').directive('colData', function() {
    return {
        restrict : 'E',
        scope : {
            data : '=',
            parentKey : '='
        },
        link : function(scope) {
            scope.result = {};
            if (typeof scope.data._e !== 'undefined' && typeof scope.data._e.plainText !== 'undefined') {
                scope.result.textData = scope.data._e.plainText;
                scope.data = scope.data._e.plainText;
            } else {
                scope.result.textData = scope.data;
            }

            if (typeof scope.data === 'string' && scope.data.indexOf('||') > -1) {
                var data = scope.data.split('||');
                if (typeof data[0] !== 'undefined') {
                    scope.result.textData = data[0];
                }
                if (typeof data[1] !== 'undefined') {
                    scope.result.tooltip = data[1];
                }
            }
            scope.parentKey = scope.parentKey + '-table-col-' + Math.floor((Math.random() * 10000) + 1);
        },
        template : '<div ng-if="result.textData"><span aria-label="{{result.textData}}">{{result.textData | dateFilter}}</span><span ng-if="result.tooltip"><wf-tooltip popover-description="result.tooltip" popover-element-id="parentKey"></wf-tooltip></span></div>'
    };
}).filter('dateFilter', ["$filter", function($filter) {
    return function(item) {
        if (item instanceof Date) {
            return $filter('date')(item, 'dd-MM-yyyy');
        }
        return item;
    };
}]);
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-onboarding-profile-table',
            condition: function(el) {
                var checks = [
                    el.styles.indexOf("hsbc_table_with_sorting") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('TableController', [ "$scope", "$filter", "$rootScope", function($scope, $filter, $rootScope) {

        function generateTable() {
            var tableData = $scope.element.children;
            var tableHeader = {};
            var tableRows = [];
            var tableKeys = [];
            for (var row = 0; row < tableData.length; row++) {
                var rowObject = tableData[row];
                var rowChildrenObject = rowObject.children;
                var isHeader = (typeof rowObject.styles === 'object' && rowObject.styles.length > 0 && rowObject.styles.indexOf('table_header') > -1) ? true : false;
                var rowData = {};
                for (var col = 0; col < rowChildrenObject.length; col++) {
                    var colObject = rowChildrenObject[col];
                    if (isHeader) {
                        tableKeys[col] = colObject.name;
                        tableHeader[tableKeys[col]] = colObject._e.plainText;
                    } else {
                        if (typeof colObject.children !== 'undefined' && colObject.children.length > 0) {
                            rowData[tableKeys[col]] = colObject;
                        } else {
                            rowData[tableKeys[col]] = '';
                            var isDate = (typeof colObject.styles === 'object' && colObject.styles.length > 0 && colObject.styles.indexOf('wf_formatdate') > -1) ? true : false;
                            if (isDate) {
                                var dateString = colObject._e.plainText;
                                var dd = dateString.substring(0, dateString.indexOf('-'));
                                dateString = dateString.replace(dd + '-', '');
                                var mm = dateString.substring(0, dateString.indexOf('-'));
                                dateString = dateString.replace(mm + '-', '');
                                var yyyy = dateString;
                                dateString = yyyy + '-' + mm + '-' + dd;
                                rowData[tableKeys[col]] = new Date(dateString);
                            } else {
                                rowData[tableKeys[col]] = colObject._e.plainText;
                            }
                        }
                    }
                }
                tableRows.push(rowData);
            }
            $scope.tableHeader = tableHeader;
            $scope.tableRows = tableRows;
        }
        $scope.sortBy = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };
        $scope.sortByInitial = function(propertyName) {
            $scope.reverse = true;
            $scope.propertyName = propertyName;
        };
        $scope.getData = function(data) {
            data = data.split('||');
            var result = {
                textData : '',
                tooltip : ''
            };
            if (typeof data[0] !== 'undefined') {
                result.textData = data[0];
            }
            if (typeof data[1] !== 'undefined') {
                result.tooltip = data[1];
            }
            return result;
        };
        generateTable();
        $rootScope.$on('BEventToRefreshTableData', function($event) {
            generateTable();
        });
    } ]);
})();
(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-landing-page-container',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf('wf_landing_page_container') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('LandingPageContainerController', ["$scope", "$rootScope", function ($scope, $rootScope) {
        console.info('FORMS WS4 Version : 1.1.6 \n Date : 18/08/2017 PM');
        var element = $scope.element;
        $scope.elementChildren = $scope.element.children;
        $scope.isSystemNotification = false;
        $rootScope.$on('triggerSystemNotification', function($event, message){
            $scope.isSystemNotification = true;
        });
        $scope.onLoadPrimaryContainer = function() {
            var topElement = $('#hsbc-odct-header').offset();
            if(typeof topElement.top !== 'undefined') {
                $( 'html, body' ).scrollTop(topElement.top);
            }
        };
    }]);
})();
/**
 * Function to generate input,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-review',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_review') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('ReviewElementController', ["$scope", function ($scope) {
        var element = $scope.element;
        $scope.getMessage = function(data) {
            var message = '';
            for(var key in data) {
                if(data[key].text) {
                    message = data[key].text;
                    break;
                }
            }
            return message;
        };
        $scope.getValue = function() {
            //var value = data.concat(', ');
            //return value;
            return element.multipleValues();
        };
    }]);
})();

(function () {

    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-ordered-list',
            condition: function(el) {
                var checks = [
                    el.isContainer,
                    el.styles.indexOf("ordered_list") > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];

    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('orderListController', ["$scope", function ($scope) {

    }]);
})();

/**
 * Function to generate percentage,
 * @memberof forms-ui',
 * @function',
 */
(function () {
    /**
     * @ngInject
     */
    function registerComponent(ComponentRegistry) {
        ComponentRegistry.registerElement({
            name: 'wf-element-percentage',
            condition: function(el) {
                var checks = [
                    el.isField,
                    el.styles.indexOf('wf_element_percentage') > -1
                ];

                var score = checks.filter(function (value) {
                    return value;
                });

                return {score: score.length, totalMatch: score.length === checks.length};
            }
        });
    }
    registerComponent.$inject = ["ComponentRegistry"];
    angular.module('forms-ui').run(registerComponent);
})();
(function() {
    angular.module('forms-ui').controller('PercentageController', ["$scope", function($scope) {
        $scope.percentageValue = $scope.element.value[0];
        if ($scope.percentageValue !== '') {
            $scope.percentageValue = parseInt($scope.percentageValue);
        }

        function update() {
            $scope.element.value[0] = $scope.percentageValue;
            $scope.$emit('update');
        }

        $scope.update = update;
    }]);
})();

angular.module('forms-ui').run(['$templateCache', function($templateCache) {$templateCache.put('directive/element.children.html','<bb-element data-key="{{child.key}}" ng-repeat="child in element.children track by child.key"></bb-element>');
$templateCache.put('directive/element.control.html','<bb-element data-key="{{element.key}}" bb-control=""></bb-element>');
$templateCache.put('directive/form.html','<div class="bb-form" ng-class="bbForm.isRefreshing ? \'bb-form-refresing\' : \'\'">\n    <bb-element data-key="{{bbForm.root.key}}"></bb-element>\n</div>\n');
$templateCache.put('component/application-content/template.html','<div class="application-content" ng-controller="applicationContentController">\n    <div class="header-with-link">\n        <h3 aria-label="{{element._e.displayName}}">{{element._e.displayName}}</h3>\n        <bb-element data-key="{{child.key}}" ng-if="headerButton.length > 0" ng-repeat="child in headerButton track by child.key"></bb-element>\n    </div>\n    <div class="clearfix"></div>\n    <div class="application-content-item">\n        <bb-element data-key="{{child.key}}" ng-if="content.length > 0" ng-repeat="child in content track by child.key"></bb-element>\n    </div>\n</div>\n');
$templateCache.put('component/amendment-list/template.html','<div class="{{element.classList}}" amendment-list ng-class="{\'collapse-panel\': collapse}">\n    <h3 ng-if="element.get(\'displayName\')" ng-bind="element.get(\'displayName\')"></h3>\n    <children></children>\n</div>');
$templateCache.put('component/breadcrumb/breadcrumbs.html','<div ng-repeat="breadcrumbs">\n    <ol class="bb-breadcrumbs bb-breadcrumbs-{{children.length}} breadcrumb {{parentClassNames}}">\n        <li class="bb-breadcrumb"\n            ng-class="{ \'past\': child.isPast, \'active\': child.isCurrent, \'future\': child.isFuture, \'last\': $last}"\n            ng-repeat="child in children track by $index"\n            data-flowname="{{child.properties.flowName}}"\n            ng-attr-data-sessionid="sessionId">\n            <span class="hidden-xs hidden-sm">{{child.properties.displayName}}</span>\n            <div ng-if="child.isFuture" class="triangle"></div>\n            <div ng-if="child.isCurrent" class="square"></div>\n        </li>\n    </ol>\n</div>');
$templateCache.put('component/autocomplete/template.html','<input type="text" class="form-control typeahead" name="{{element.name}}" id="{{element.key}}"\n       autocomplete\n       element="element"\n       ng-disabled="{{ element.disabled || element.readonly || (element.messages[0].type != \'ERROR\' && hasStyle(element, \'FormReadOnlyOnError\')) }}"\n       ng-class="{\'empty\':(!element.values || element.values==\'\')}"\n       ng-readonly="{{element.readonly}}"\n       placeholder="{{element.questionText}}">');
$templateCache.put('component/button/template.html','<button type="button"\n        role="button"\n        aria-label="{{element.get(\'caption\')}}"\n        class="{{element.classList}}"\n        name="{{element.name}}"\n        ng-disabled="(element.disabled || element.readOnly)"\n        id="{{element.key}}"\n        ng-click="$emit(\'update\'); element.call()">\n        <span>{{element._e.caption}}</span>\n</button>');
$templateCache.put('component/button-download/template.html','<a href="#" button-download\n        id="{{element.key}}"\n        name="{{element.name}}"\n        ng-click="download()"\n        type="button"\n        class="{{element.classList}}"\n        ng-bind="::element.get(\'caption\')"></a>\n\n');
$templateCache.put('component/accordian/template.html','<div class="panel-group" ng-controller="AccordianController as ctrFp">\n  <div class="panel panel-default">\n    <div class="panel-heading">\n        <h4 class="panel-title"\n            here\n            class="{{buttomElement.classList}}"\n            name="{{buttomElement.name}}"\n            ng-bind="::buttomElement.get(\'caption\')">\n        </h4>\n        <div class="panel-header-right">\n            <i ng-if="!isInfoDisplay && isErrorPresent" class="icon icon-circle-confirmation-solid"></i>\n            <bb-element ng-if="isInfoDisplay" data-key="{{child.key}}" ng-repeat="child in navigationButton track by child.key"></bb-element>\n            <span href="#{{buttomElement.key}}" ng-click="updateCollapse();" data-toggle="collapse" id="{{buttomElement.key}}-collapse" ng-class="{\'open\':isInfoDisplay}"></span>\n        </div>\n    </div>\n    <div id="{{buttomElement.key}}" class="panel-collapse collapse">\n        <bb-element data-key="{{child.key}}" ng-repeat="child in contentElement track by child.key"></bb-element>\n    </div>\n  </div>\n</div>');
$templateCache.put('component/button-edit/template.html','<button type="button"  class="{{element.classList}} btn" name="{{element.name}}" id="{{element.key}}"\n        ng-click="edit()" ng-bind="::element.get(\'caption\')"></button>\n');
$templateCache.put('component/button-icon/template.html','<div name="{{element.name}}" name="{{element.name}}" id="{{element.key}}" ng-click="$emit(\'update\');" role="button"\n     aria-label="{{element.get(\'caption\')}}">\n    <button role="button" type="button" class="{{element.classList}}" ng-click="toggle = !toggle">\n        <div class="col-xs-9 no-padding">{{element.get(\'caption\')}}</div>\n    </button>\n</div>\n');
$templateCache.put('component/button-link/template.html','<a\n    target="_blank"\n    role="button"\n    name="{{element.name}}"\n    id="{{element.key}}"\n    button-link href="{{link}}"\n    class="{{element.classList}}">\n    <button type="button"  class="btn-block btn" ng-click="$emit(\'update\')" ng-bind="::caption" aria-label="{{::caption}}" attr-name="buttonName"></button>\n</a>\n\n\n');
$templateCache.put('component/button-tooltip/template.html','<div ng-controller="ButtonTooltipController">\n    <wf-tooltip popover-description="tooltipText"\n        popover-link-text="btnText"\n        popover-element-id="popoverElementId"></wf-tooltip>\n</div>');
$templateCache.put('component/button-unauthorized/template.html','<!--<a href="#" id="{{element.key}}" name="{{element.name}}" ng-click="$emit(\'update\')">\n    <button type="button" class="{{element.classList}} btn"  ng-bind="::element.get(\'caption\')"></button>\n</a>-->\n\n');
$templateCache.put('component/checkbox-group/template.html','<div class="{{element.classList}} checkbox-group"\n    name="{{element.name}}" id="{{element.key}}">\n    <div class="checkbox"\n        ng-class="{\'col-md-6 col-lg-6 col-sm-6\' : (element.styles[0]===\'column_two\')}"\n        ng-repeat="option in element.options">\n        <input type="checkbox" id="{{element.key}}-{{$index}}"\n            aria-labelledby="{{element.key}}-{{$index}}"\n            name="{{element.name}}" ng-model="cbg.valueMap[$index]"\n            ng-change="cbg.updateValues();$emit(\'update\')"\n            ng-disabled="element.disabled || element.readOnly"\n            ng-readonly="element.readOnly" class="digital-checkbox" />\n        <label class="checkbox-value" ng-bind="option.displayValue"\n            aria-label="{{option.displayValue}}"\n            for="{{element.key}}-{{$index}}"></label>\n        <div ng-if="element.description" class="tooltip">\n            <i class="icon icon-circle-info"></i> <span\n                class="tooltip-text">{{element.description}}</span>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/checkbox-group-accordion/template.html','<div class="{{element.classList}} checkbox-group" name="{{element.name}}" id="{{element.key}}" ng-controller="CheckboxGroupController">\n    <div class="checkbox" ng-class="{\'col-md-6 col-lg-6 col-sm-6\' : (element.styles[0]===\'column_two\')}" ng-repeat="option in element.options">\n        <input type="checkbox"\n               id="{{element.key}}-{{$index}}"\n               aria-labelledby="{{element.key}}-{{$index}}"\n               aria-describedby="error_id"\n               name="{{element.name}}"\n               ng-model="cgb.valueMap[$index]"\n               ng-change="cgb.updateValues();$emit(\'update\');"\n               ng-disabled="element.disabled || element.readOnly"\n               ng-readonly="element.readOnly" class="digital-checkbox" />\n        <label class="checkbox-value" ng-bind="option.displayValue" for="{{element.key}}-{{$index}}" aria-label="{{option.displayValue}}"></label>\n    </div>\n    <div ng-if="element.value.length === 0" ng-init="cgb.valueMap=element.callinit(cgb.valueMap);$emit(\'update\');"></div>\n</div>');
$templateCache.put('component/collapsing-button/template.html','<button collapsing-button type="button"   class="{{element.classList}} btn" name="{{element.name}}" id="{{element.key}}"\n    ng-click="collapse()" ng-bind="::element.get(\'caption\')"></button>\n');
$templateCache.put('component/container/template.html','<div class="{{element.classList}} container_block"\n    ng-class="{\'show_underline\': ((!collapse) && element.get(\'displayName\'))}"\n    ng-controller="ContainerContainer" ng-init="init()">\n    <div ng-if="element.get(\'displayName\')"\n        class="container__title container-heading-text">\n        <div class="container__title__column"></div>\n        <h3 ng-bind="element.get(\'displayName\')"\n            data-ng-if="element.styles[1] != \'lightbox_warning\'"\n            aria-label="{{element.get(\'displayName\')}}"></h3>\n        <div data-ng-if="element.styles[1] == \'lightbox_warning\'">\n            <i class="icon icon-circle-error review-icon"\n                style="left: 30px; position: absolute; color: #BA8111; font-size: 52px;">\n            </i>\n            <p\n                style="margin-left: 55px; padding-top: 15px; font-size: 22px;"\n                aria-label="{{element.get(\'displayName\')}}">\n                {{element.get(\'displayName\')}}</p>\n        </div>\n    </div>\n    <div data-ng-if="element.styles[0] == \'download_form_icon\'">\n        <i class="icon icon-location locationIconStyle"> </i>\n    </div>\n    <div data-ng-if="element.styles[0] == \'add_remove_director\'">\n        <i class="icon icon-add"> </i>\n    </div>\n    <children></children>\n</div>');
$templateCache.put('component/button-footer/template.html','<span class="" data-ng-class="{\'border-right-small\' : \'{{element.name}}\' === \'SubmitNewForm\'}">\n<button type="button" role="button" aria-label="{{element.get(\'caption\')}}"class="{{element.classList}}" name="{{element.name}}" id="{{element.key}}"\n    ng-click="$emit(\'update\'); element.utag()" ng-bind="::element.get(\'caption\')"></button>\n<icon class="icon icon-chevron-right font-icon"></icon>\n    </span>\n\n');
$templateCache.put('component/container-accordion/template.html','<div class="{{element.classList}} container_block"\n     ng-class="{\'show_underline\': ((!collapse) && element.get(\'displayName\'))}"\n     ng-if="element.children.length > 0">\n     <label  class="accordion-heading col-md-12 col-sm-12" for="{{element._e.key}}">\n        <span  class="col-lg-8 col-xs-8"  ng-bind="element.get(\'displayName\')"></span>\n        <i class="pull-right icon  col-lg-4 col-xs-4"\n           ng-class="{\'icon-chevron-up-small\' : element.callAccordion() == true ,\n                      \'icon-chevron-down-small\' : !(element.callAccordion() == true),\n                      \'displayNone\' : \'{{element.styles[1]}}\'== \'hide_arrow_icon\' || \'{{element.styles[0]}}\'== \'hide_arrow_icon\' ,\n                      \'displayContent\':\'{{element.styles[1]}}\'== \'\'}"\n          data-ng-if="element.styles[0] == \'accordion_block\'  || element.styles[1] == \'accordion_block\'"></i>\n    </label>\n    <input data-ng-click="element.callAccordion()" class="accordion-radio" checked type="radio" name="city" id="{{element._e.key}}" data-ng-if="element.styles[0] == \'accordion_block\' || element.styles[1] == \'accordion_block\'"/>\n    <div id="{{element._e.key}}_block" class="accordion-info">\n        <children></children>\n    </div>\n</div>\n');
$templateCache.put('component/button-save-data/template.html','<span id="savingInfo"  data-ng-if="element.saving == true"><i class="saving-logo"/>{{element.savingText}}</span>\n<span id="saveMyProgress"  data-ng-if="element.saving == false">{{element.savedNewTime}}</span>\n<button type="button"\n        role="button"\n        aria-label="{{element.get(\'caption\')}}"\n        class="{{element.classList}}"\n        name="{{element.name}}"\n        id="{{element.key}}"\n        ng-click="$emit(\'update\'); element.saveFormData()"\n        ng-bind="::element.get(\'caption\')">\n</button>\n\n');
$templateCache.put('component/container-recaptcha/template.html','<div recaptcha class="{{element.classList}}" name="{{element.name}}" id="{{element.key}}">\n    <h3 ng-if="element.get(\'displayName\')" ng-bind="element.get(\'displayName\')"></h3>\n    <div class="google_captcha_holder"  data-sitekey="{{siteKey}}"></div>\n\n    <script type="text/javascript">\n        var onloadCallback = function() {\n            // Renders the HTML element with id \'example1\' as a reCAPTCHA widget.\n            // The id of the reCAPTCHA widget is assigned to \'widgetId1\'.\n        };\n    </script>\n</div>\n');
$templateCache.put('component/container-dash-line/template.html','<div class="{{element.classList}}">\n    <span class="dash">\u2014</span>\n</div>');
$templateCache.put('component/container-review-icon/template.html','<i class="icon icon-circle-confirmation-solid pull-right review-icon border-right-small" data-ng-if="element.styles[0] == \'review_page_icon\'">\n        </i>\n<i class="icon icon-circle-confirmation-solid review-icon" style="position: absolute;" data-ng-if="element.styles[0] != \'review_page_icon\' && element.styles[0] != \'password_tick\' && element.styles[0] != \'password_error\' && element.styles[0] != \'displayNone\'">\n</i>\n<i class="icon icon-circle-error review-icon" style="position: absolute; color: #000; font-size: 22pt;" data-ng-if="element.styles[0] == \'password_error\'">\n</i>\n\n\n');
$templateCache.put('component/content-item/template.html','<div class="{{(element.classList +\' \'+ element.contentStyle)}}">\n    <children></children>\n</div>');
$templateCache.put('component/container-icon/template.html','<div class="iconcontainer">\n    <div class="circle"\n         ng-class="{\'circle\' : (element.styles[0]===\'icon_compose\'),\'circle\':(element.styles[0]===\'icon_print\'), \'circle\':(element.styles[0]===\'icon_location\'), \'circle-small\':(element.styles[0]===\'icon_agree\'), \'pull-right\':(element.styles[0]===\'icon_agree\')}">\n        <i class="icon {{element.classList}}">\n        </i>\n    </div>\n</div>\n\n\n\n');
$templateCache.put('component/container-review-warning/template.html','<div class="{{element.classList}} container_block"\n     ng-class="{\'show_underline\': ((!collapse) && element.get(\'displayName\'))}"\n     ng-if="element.children.length > 0">\n    <div ng-if="element.get(\'displayName\')" class="container__title container-heading-text"  >\n        <div class="container__title__column"></div>\n        <h3 role="alert" ng-bind="element.get(\'displayName\')" data-ng-if="element.styles[1] != \'lightbox_warning\'">\n        </h3>\n        <div data-ng-if="element.styles[1] == \'lightbox_warning\'">\n            <i class="icon icon-circle-error review-icon" style="left:30px; position: absolute; color: #BA8111; font-size: 52px;">\n            </i>\n            <p role="alert" style="margin-left: 55px;padding-top: 15px; font-size: 22px;">\n                {{element.get(\'displayName\')}}\n            </p>\n        </div>\n    </div>\n\n    <div class="col-xs-12 review-warning-box">\n        <div>\n        <i class="icon icon-circle-error review-warning">\n        </i>\n        </div>\n        <div class="review-warning-container">\n            <children></children>\n        </div>\n    </div>\n</div>\n');
$templateCache.put('component/custom-radio-group/template.html','<div class="radio custom-radio-group custom-radio-button"\n    name="{{element.name}}" id="{{element.key}}"\n    aria-labelledby="{{element.key}}" aria-describedby="error_id"\n    ng-model="element.value[0]" ng-required="{{element.required}}"\n    ng-class="{\'has-error\':element.hasError}"\n    ng-disabled="element.disabled || element.readonly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n    ng-readonly="element.readonly">\n    <label for="{{element.key}}" aria-label="{{element.questionText}}"\n        class="{{element.styles[1]}} {{element.styles[0]}} control-label"\n        ng-if="element.questionText.length > 0"> <!--<div ng-if="element.description" class="tooltip">            <i class="icon icon-circle-info"></i>            <span class="tooltip-text">{{element.description}}</span>        </div>-->\n        {{element.questionText}} <span ng-if="element.description"\n        class="myPopup"> <span class="ng-binding"></span> <span\n            class="popUpIcon" uib-popover-template="\'logoutPopover\'"\n            popover-trigger="outsideClick" popover-placement="top"\n            id="logoutPopUp-{{element.key}}"> <i\n                class="icon icon-circle-help-solid"\n                style="font-size: 20px;"> </i>\n        </span> <script type="text/ng-template" id="logoutPopover">                    <div id="{{element.key}}-popup"  ng-class="{ \'displayContent\': !toggle }">                            <button type="button" class="close" close-text="Close" ng-click="element.close();">                                <span aria-hidden="true">&times;</span>                            </button>                        <div style="padding-top: 15px;">                            <span class="tooltip-text" role="tooltip" aria-hidden="true">{{element.description}}</span>                            </div>                    </div>                </script>\n    </span>\n    </label>\n    <div>\n        <div ng-repeat="option in element.options" class="radio-item"\n            role="checkbox"\n            ng-class="{\'radio-vertical-align\' : (element.styles[0]===\'options_horizontal\')}">\n            <input type="radio"\n                aria-labelledby="{{element.key}}-{{$index}}"\n                id="{{element.key}}-{{$index}}"\n                name="{{element.key}}+radio_pick"\n                ng-model="element.value[0]" ng-value="option.value"\n                ng-change="$emit(\'update\')"> <span\n                ng-click="element.value[0] = option.value;$emit(\'update\');"\n                ng-class="{\'active\' : (element.value[0] === option.value)}"></span>\n            <label for="{{element.key}}-{{$index}}"\n                ng-bind="option.displayValue"\n                aria-label="{{option.displayValue}}"></label>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/download-container/template.html','<div download-container class="{{element.classList}} container_block" >\n    <children></children>\n</div>\n');
$templateCache.put('component/download-pdf/template.html','<div class="download-pdf">\n        <button class="hsbc-btn-download">Download PDF</button>\n</div>');
$templateCache.put('component/dropdown/template.html','<div  class="form-group" ng-controller="DropdownCtrl" ng-init="element.setPlaceHolder()">\n        <div class="control-field" ng-class="{ \'has-error\': (element.messages.length > 0) }">\n                <div class="control-select custom-dropdown">\n                        <select class="form-control"\n                                name="{{element.name}}"\n                                id="{{element.key}}"\n                                aria-labelledby="{{element.key}}"\n                                ng-model="element.value[0]"\n                                ng-options="option.value as option.displayValue for option in element.options"\n                                ng-change="$emit(\'update\')"\n                                ng-disabled="element.disabled || element.readonly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n                                ng-readonly="element.readonly">\n                                <option value="" disabled selected style="display: none;">{{element._e.explainText}}</option>\n                        </select>\n                        <div\n                                id="{{elementId}}"\n                                class="custom-dropdown-container" >\n                                <button ng-click="triggerDropdoen($event);" ng-keydown="keyDown($event)" class="form-control"><i class="icon" ng-class="{\'icon-chevron-up-small\':isOpen,\'icon-chevron-down-small\':!isOpen}"></i>{{selectedValue}}<span ng-if="selectedValue === undefined || selectedValue === \'\' ">{{element.placeHolderText}}</span></button>\n                                <ul\n                                        ng-show="isOpen"\n                                        ng-hide="!isOpen"\n                                        ng-click="isOpen=!isOpen;"\n                                        id="{{dropdownId}}">\n                                        <li\n                                                class=\'{{optionIdPrefix}}{{$index}}\'\n                                                ng-repeat="option in element.options"\n                                                ng-init="addSelectedValue(option, $index)"\n                                                ng-class="{\'selected\' : $index === currentIndex}"\n                                                ng-click="select(option, $index)">\n                                                <span>{{option.displayValue}}</span>\n                                        </li>\n                                </ul>\n\n                        </div>\n                </div>\n        </div>\n</div>');
$templateCache.put('component/failed-element/template.html','<span ng-if="element.message">{{element.message}}</span>\n<pre ng-if="element.stackTrace" >{{element.stackTrace}}</pre>\n');
$templateCache.put('component/field/template.html','<div field ng-disabled="element.disabled || element.readOnly"\n    ng-readonly="element.readOnly"\n    data-ng-init="toggle=true; element.toolTipText()"\n    ng-class="{\'has-error\':element.hasError,\'read-only\':element.readOnly}"\n    id="{{element.key}}" class="form-group"\n    class="{{::element.classList}} revisedContainer">\n    <div>\n        <!-- Field label -->\n        <label for="{{element.key}}"\n            class="{{element.classList}} no-padding control-label"\n            aria-label="{{element.label}}"\n            ng-if="element.label.length > 0"> <!--<span class="wrapper-border" ng-class="{\'displayContent\' : \'{{element.styles[1]}}\'== \'select_change\',\'displayNone\' : !(\'{{element.styles[1]}}\'== \'select_change\')}"></span>            {{element.label}}              <div ng-if="element.description" class="tooltip">                <i class="icon icon-circle-info"></i>                <span class="tooltip-text" role="tooltip" aria-hidden="true">{{element.description}}</span>            </div>-->\n            <span class="wrapper-border"\n            ng-class="{\'displayContent\' : \'{{element.styles[1]}}\'== \'select_change\',\'displayNone\' : !(\'{{element.styles[1]}}\'== \'select_change\')}"></span>\n            <span data-ng-bind="element.label"></span> <span\n            ng-if="element.newDesc" class="myPopup"> <span\n                class="ng-binding"></span> <span class="popUpIcon"\n                uib-popover-template="\'logoutPopover\'"\n                popover-trigger="outsideClick" popover-placement="top"\n                id="logoutPopUp-{{element.key}}"> <i\n                    class="icon icon-circle-help-solid"\n                    style="font-size: 20px;"> </i>\n            </span> <script type="text/ng-template" id="logoutPopover">                    <div id="{{element.key}}-popup"  ng-class="{ \'displayContent\': !toggle }">                            <button type="button" class="close" close-text="Close" ng-click="element.close();">                                <span aria-hidden="true">&times;</span>                            </button>                        <div style="padding-top: 15px;">                            <span class="tooltip-text" role="tooltip" aria-hidden="true">{{element.newDesc}}</span>                            </div>                    </div>                </script>\n        </span>\n        </label>\n        <!-- Field control -->\n        <div class="control-field"\n            ng-class="{ \'has-error\': (element.messages.length > 0) }">\n            <control></control>\n        </div>\n        <div class="control-error"\n            ng-class="{ \'has-error\': (element.messages.length > 0) }"\n            role="alert">\n            <div ng-if="element.messages.length > 0"\n                class="control-description control-errors">\n                <div ng-repeat="error in element.messages">\n                    <span class="icon icon-circle-delete"></span> <span\n                        class="description-body text-muted"\n                        id="error_id" aria-label="{{::error.text}}">{{::error.text}}</span>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/field-accordion/template.html','<div field ng-disabled="element.disabled || element.readOnly"  ng-readonly="element.readOnly"  ng-class="{\'has-error\':element.hasError,\'read-only\':element.readOnly}" id="{{element.key}}"\n     class="form-group" class="{{::element.classList}} revisedContainer">\n    <div>\n        <ul class="{{element.styles[2]}} accordion css-accordion">\n            <li class="accordion-item">\n                <!-- Field label -->\n                <input class="accordion-item-input" type="checkbox"  id="{{element.key}}-li" ng-model="hideClosed[$index]"  name="accordion">\n                <label for="{{element.key}}-li" class="col-md-12 col-xs-12 col-lg-12 col-sm-12 control-label">\n                    <hr class="fancy-line">\n                    <span class="accordion-item-hd">\n                    <span class="col-lg-4 col-md-4 col-xs-4 col-sm-4"><!--<span class="wrapper-border"></span>-->{{element.label}}</span>\n                        <div ng-if="element.description" class="tooltip">\n                            <i class="icon icon-circle-info"></i>\n                            <span class="tooltip-text">{{element.description}}</span>\n                        </div>\n                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 circle-counter" style="padding: 0px" ng-hide="hideClosed[$index] || element.value.length == 0 ">{{element.value.length}}</div>\n                        <i style="margin-right: 20px; font-size: 33px; padding: 0px; text-align: right;"\n                           class="pull-right icon icon-chevron-down-small col-lg-5 col-sm-5 col-md-5 col-xs-5"\n                            ng-hide="hideClosed[$index]"></i>\n                         <i style="margin-right: 20px; font-size: 33px; padding: 0px; text-align: right;"\n                            class="pull-right icon icon-chevron-up-small col-lg-5 col-sm-5 col-md-5 col-xs-5"\n                             ng-hide="!hideClosed[$index]"></i>\n                    </span>\n                </label>\n                <div class="col-sm-12 col-lg-12 col-xs-12 col-md-12 accordion-item-bd">\n                    <!-- Field control -->\n                    <div class="" ng-class="{ \'has-error\': (element.messages.length > 0) }">\n                        <control></control>\n                        <div ng-if="element.description" class="control-description">\n                            <span class="icon icon-circle-info"></span>\n                            <span class="description-body text-muted">{{element.description}}</span>\n                        </div>\n                        <div ng-if="element.messages.length > 0" class="control-description control-errors" role="alert">\n                            <div ng-repeat="error in element.messages">\n                                <span class="icon icon-circle-delete"></span>\n                                <span class="description-body text-muted" aria-label="{{::error.text}}">{{::error.text}}</span>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </li>\n        </ul>\n    </div>\n</div>\n\n');
$templateCache.put('component/field-container/template.html','<div ng-disabled="element.disabled || element.readOnly"  ng-readonly="element.readOnly"  ng-class="{\'has-error\':element.hasError}"\n     id="{{element.key}}" class="form-group" class="{{::element.classList}}">\n    <!-- Field label -->\n    <label for="{{element.key}}" class="col-sm-3 control-label">\n        {{element.label}}\n        <span class="opt" ng-show="!element.required">{{$ctrl.form.lookupMessage(\'optionalField\')}}</span>\n    </label>\n    <div class="col-md-9">\n        <children></children>\n    </div>\n</div>\n');
$templateCache.put('component/field-custom-layout/template.html','<div id="{{element.key}}" class="form-group" class="{{::element.classList}}">\n    <!-- Field label -->\n    <label for="{{element.key}}" class="control-label">\n        {{element.label}}\n        <span class="opt" ng-show="!element.required">{{$ctrl.form.lookupMessage(\'optionalField\')}}</span>\n        <span class="fa fa-info-circle tooltip-elem" ng-if="element.description" element="element" >\n            <span class="tooltip-elem__content-wrap">\n                <span class="toolip-body text-muted">{{element.description}}</span>\n\n            </span>\n        </span>\n    </label>\n\n    <!-- Field control -->\n    <div ng-class="{ \'has-error\': (element.messages.length > 0) }">\n            <control></control>\n    </div>\n</div>\n\n');
$templateCache.put('component/field-review/template.html','<div field class="{{element.classList}}" ng-disabled="element.disabled || element.readOnly"  ng-readonly="element.readOnly"  ng-class="{\'has-error\':element.hasError,\'read-only\':element.readOnly}" id="{{element.key}}"\n     class="form-group" class="{{::element.classList}} revisedContainer">\n    <div >\n        <!-- Field label -->\n\n        <label for="{{element.key}}" class="{{element.classList}} col-md-12 col-sm-12 no-padding control-label" ng-if="element.multipleValues !== undefined || element.value[0] != undefined">\n\n            <span class="wrapper-border" ng-class="{\'displayContent\' : \'{{element.styles[1]}}\'== \'label_wrap\',\'displayNone\' : !(\'{{element.styles[1]}}\'== \'label_wrap\')}"></span>\n            {{element.label}}\n            <!--<span class="opt" ng-show="!element.required">{{$ctrl.form.lookupMessage(\'optionalField\')}}</span>-->\n        </label>\n        <!-- Field control -->\n        <div class="col-sm-12 col-md-12 no-padding {{element.classList}}" ng-class="{ \'has-error\': (element.messages.length > 0)}" style="margin-bottom: 5px;">\n            <span ng-if="element.multipleValues == undefined  && element._e.domain[0].value != \'S07\'" style="font-weight: 300;">{{element.value[0]}}</span>\n            <span ng-if="element._e.domain[0].value == \'S07\'" style="font-weight: 300;">\n                <li class="multipleValues">{{element._e.domain[0].displayValue}}</li>\n                </span>\n            <div ng-if="element.multipleValues.length >= 1 " data-ng-repeat="value in   element.multipleValues">\n                <span ng-if="element.multipleValues.length == 1 && element._e.multiValued === false" style="list-style : initial ;font-weight: 300; margin-bottom: 5px;">{{value}}</span>\n                <li ng-if="element.multipleValues.length == 1 && element._e.multiValued === true" class="multipleValues">{{value}}</li>\n                <li ng-if="element.multipleValues.length > 1" class="multipleValues">{{value}}</li>\n            </div>\n        </div>\n    </div>\n</div>\n\n');
$templateCache.put('component/file-upload/template.html','<div class="form-group" file-upload-content>\n    <label class="control-label" ng-if="element.displayName">\n        {{element.displayName}}\n    </label>\n\n    <div ng-class="{\'has-error\':(element.messages.length > 0)}" class="field-control">\n        <div ng-if="element.properties.singlefilemode" class="submit-button btn" ngf-select="upload($file)" name="file" ng-model="file" ngf-max-size="{{maxFileSize}}" ngf-pattern="{{allowedExtensions}}">\n              {{element.properties.singleuploadlabel}}\n        </div>\n\n        <div ng-if="!element.properties.singlefilemode" class="btn submit-button" ngf-select="upload($files)"\n             ngf-max-size="{{maxfilesize}}" ng-model="files" ngf-multiple="true" ngf-pattern="allowedExtensions"\n             accept="allowedExtensions">\n             {{element.properties.multiuploadlabel}}\n        </div>\n    </div>\n</div>\n\n\n');
$templateCache.put('component/form-table-with-sorting/template.html','<div class="bbform-contentitem">\n    <table class="table table-striped" ng-controller="TableController">\n        <tbody>\n            <tr\n                ng-repeat="row in element.children | orderBy:sortType:sort "\n                ng-class="{\'table-header\':$first}">\n                <td ng-repeat="cell in row.children "\n                    class="{{cell.classList}}">\n                    <div ng-if=\'$parent.$index === 0\'>\n                        <label class="control-label" ng-if="cell.label"\n                            aria-label="{{cell.label}}"> <a\n                            ng-click="sortType = \'cell.label\'"> <span\n                                ng-bind="cell.label"\n                                aria-label="{{cell.label}}"></span>\n                        </a>\n                            <div ng-if="cell.description !== \'\'"\n                                class="tooltip">\n                                <i class="icon icon-circle-info"></i> <span\n                                    class="tooltip-text"\n                                    ng-bind="cell.description"\n                                    aria-label="{{cell.description}}"\n                                    role="tooltip"></span>\n                            </div>\n                        </label>\n                        <div ng-if="!cell.label">\n                            <bb-element data-key="{{child.key}}"\n                                ng-repeat="child in [cell] track by child.key"></bb-element>\n                        </div>\n                    </div>\n                    <div ng-if="$parent.$index !== 0">\n                        <bb-element data-key="{{child.key}}"\n                            ng-repeat="child in [cell] track by child.key"></bb-element>\n                    </div>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n</div>');
$templateCache.put('component/html-block/template.html','<p id="element.key" ng-bind-html="element.get(\'text\')"></p>');
$templateCache.put('component/hsbc-btn-primary/template.html','<button type="button"\n        role="button"\n        aria-label="{{element.get(\'caption\')}}"\n        class="{{element.classList}}"\n        name="{{element.name}}"\n        id="{{element.key}}"\n        ng-click="update()"\n        ng-bind="::element.get(\'caption\')"\n        ng-controller="PrimaryButtonController">\n</button>');
$templateCache.put('component/input-currency/template.html','<div class="input-group">\n    <span class="input-group-addon">{{$ctrl.form.lookupMessage(\'defaultCurrency\')}}</span>\n    <input type="text"\n        class="form-control"\n        name="{{element.name}}"\n        id="{{element.key}}"\n        ng-blur="$emit(\'update\')"\n        ng-model="element.value[0]"\n        ng-required="element.required"\n        ng-disabled="element.disabled"\n        ng-readonly="element.readOnly"\n        maxlength="{{element.maxLength}}"\nnovalidate>\n</div>');
$templateCache.put('component/input-checkbox/template.html','<div input-checkbox class="checkbox checkbox-single" ng-class="{\'col-md-6 col-lg-6 col-sm-6\' : (element.styles[0]===\'column_two\')}">\n    <input type="checkbox"\n           id="{{element.key}}"\n           aria-labelledby="{{element.key}}"\n           aria-describedby="error_id"\n           name="{{element.name}}"\n           ng-model="element.value[0]"\n           ng-true-value="\'true\'"\n           ng-false-value="\'false\'"\n           ng-change="$emit(\'update\')"\n           ng-disabled="element.disabled || element.readOnly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n           ng-readonly="element.readOnly" />\n    <label class="checkbox-value" for="{{element.key}}"></label>\n</div>');
$templateCache.put('component/input-date/template.html','<div ng-show="!showCustom" ng-disabled="element.disabled" ng-readonly="element.readOnly" class=\'input-group date bootstrap-datepicker custom-date-picker\'></div>\n<div ng-show="showCustom" ng-blur="blurFromDate()" ng-controller="CustomDate" class="{{element.classList}} date-wrapper" ng-class={\'has-error\':element.hasError} >\n    <input type="text"  numbers-only placeholder="DD" aria-label="Date" class="form-control date-input" ng-model="dd" ng-blur="updateDate();" min="1" max="31" maxlength="2"/>\n    <span class="dash">\u2014</span>\n    <input type="text"  numbers-only placeholder="MM" aria-label="Month" class="form-control date-input" ng-model="mm"  ng-blur="updateDate();" min="1" max="12" maxlength="2"/>\n    <span class="dash">\u2014</span>\n    <input type="text"  numbers-only placeholder="YYYY" aria-label="Year" class="form-control date-input" ng-model="yyyy" ng-blur="updateDate();" min="1900" max="2050" maxlength="4"/>\n</div>');
$templateCache.put('component/input-datetime/template.html','<div class=\'input-group date bootstrap-datetimepicker\'></div>');
$templateCache.put('component/input-integer/template.html','<input  type="text"\n        numbers-only\n        class="form-control"\n        name="{{element.name}}"\n        id="{{element.key}}"\n        aria-labelledby="{{element.key}}"\n        aria-describedby="error_id"\n        ng-blur="$emit(\'update\')"\n        ng-model="element.value[0]"\n        ng-required="element.required"\n        ng-disabled="element.disabled"\n        ng-readonly="element.readOnly"\n        maxlength="{{element.maxLength = (!element.maxLength || element.maxLength === -1)? 100: element.maxLength}}"\n        novalidate\n/>\n');
$templateCache.put('component/input-percentage/template.html','<div ng-controller="inputController" ng-init="init(element)" ng-class="{\'percentage\':isPercentage}">\n    <input\n            class="form-control"\n            id="{{element.key}}"\n            aria-labelledby="{{element.key}}"\n            aria-describedby="error_id"\n            name="{{element.name}}"\n            placeholder="{{element.FormAttributeSuggestion}}"\n            autocomplete="off"\n            ng-attr-type="{{fieldType}}"\n            ng-disabled="element.disabled"\n            ng-readonly="element.readOnly"\n            ng-class="{ \'empty\': (!element.values || element.values==\'\') }"\n            ng-blur="$emit(\'update\')"\n            ng-model="element.value[0]"\n            ng-required="element.required"\n            maxlength="{{element.maxLength}}"\n            novalidate />\n</div>');
$templateCache.put('component/input-password/template.html','<div>Hi</div>');
$templateCache.put('component/input-phone/template.html','<div ng-controller="inputController">\n    <input    class="form-control"\n            id="{{element.key}}"\n            aria-labelledby="{{element.key}}"\n            name="{{element.name}}"\n            placeholder="{{element.description}}"\n            type="text"\n            ng-disabled="element.disabled"\n            ng-readonly="element.readOnly"\n            ng-class="{ \'empty\': (!element.values || element.values==\'\') }"\n            ng-model="element.value[0]"\n            ng-blur="$emit(\'update\')"\n            ng-required="element.required"\n            maxlength="{{element.maxLength = (!element.maxLength || element.maxLength === -1)? 200: element.maxLength}}"\n            novalidate />\n</div>');
$templateCache.put('component/input-text/template.html','<div ng-controller="inputController" ng-init="init(element);element.callInit();" ng-class="{\'custom-password-field\':isPassword}">\n    <input\n        class="form-control"\n        id="{{element.key}}"\n        aria-labelledby="{{element.key}}"\n        name="{{element.name}}"\n        placeholder="{{element.placholderText}}"\n        autocomplete="new-password"\n        ng-attr-type="{{fieldType}}"\n        ng-disabled="element.disabled"\n        ng-readonly="element.readOnly"\n        ng-class="{ \'empty\': (!element.values || element.values==\'\') }"\n        ng-blur="updateElement(ngModel);"\n        ng-model="ngModel"\n        ng-required="element.required"\n        maxlength="{{element.maxLength = (!element.maxLength || element.maxLength === -1)? 200: element.maxLength}}"\n        novalidate />\n        <span class="input-group-addon" ng-if="isPassword && fieldType === \'password\'" ng-click="changeFieldType(\'text\')">\n            <div class="seperator">\n                <span class="type__14">{{element.showText}}</span>\n            </div>\n        </span>\n        <span class="input-group-addon" ng-if="isPassword && fieldType === \'text\'" ng-click="changeFieldType(\'password\')">\n            <div class="seperator">\n                <span class="type__14">{{element.hideText}}</span>\n            </div>\n        </span>\n</div>');
$templateCache.put('component/input-text-retrieve-form/template.html','<div ng-controller="inputController"\n    ng-init="init(element);element.callInit();"\n    ng-class="{\'custom-password-field\':isPassword}">\n    <input class="form-control" id="{{element.key}}"\n        aria-labelledby="{{element.key}}" name="{{element.name}}"\n        placeholder="{{element.FormAttributeSuggestion}}"\n        autocomplete="new-password" ng-attr-type="{{fieldType}}"\n        ng-disabled="element.disabled" ng-readonly="element.readOnly"\n        ng-class="{ \'empty\': (!element.values || element.values==\'\') }"\n        ng-blur="$emit(\'update\')" ng-model="element.value[0]"\n        ng-required="element.required"\n        maxlength="{{element.maxLength = (!element.maxLength || element.maxLength === -1)? 200: element.maxLength}}"\n        novalidate /> <span class="input-group-addon"\n        ng-if="isPassword && fieldType === \'password\'"\n        ng-click="changeFieldType(\'text\')">\n        <div class="seperator">\n            <span class="type__14">{{element.showText}}</span>\n        </div>\n    </span> <span class="input-group-addon"\n        ng-if="isPassword && fieldType === \'text\'"\n        ng-click="changeFieldType(\'password\')">\n        <div class="seperator">\n            <span class="type__14">{{element.hideText}}</span>\n        </div>\n    </span>\n</div>');
$templateCache.put('component/lightbox/template.html','<div class="{{element.classList}}" >\n    <children></children>\n</div>\n');
$templateCache.put('component/link/template.html','<a class="btn btn-primary"\n   name="{{element.name}}"\n   id="{{element.key}}"\n   type="button" ng-disabled="element.disabled"\n   ng-click="$emit(\'update\')"\n   ng-href="../api/document/{{element.get(\'parameters\')[\'document-type\']}}/{{element.get(\'parameters\')[\'document-name\']}}/undefined">\n        <i ng-if="(element.styles | filter: \'fa_\').length" class="{{element.styles | filter: \'fa_\' | beautify}}"></i>\n        {{element.text}}\n</a>');
$templateCache.put('component/page/template.html','<div ng-if="element.get(\'displayName\')" class="form-header headerContainer myHeader">\n    <h1 ng-if="element.get(\'displayName\')" ng-bind="element.get(\'displayName\')"></h1>\n</div>\n<div class="{element.contentStyle}}" ng-controller="PageMainController">\n    <div ng-if="element.messages.length > 0" class="col-sm-12 hidden">\n        <div class="alert alert-warning">\n            <!-- {{element | constructErrorMessage:formFunctions}} -->\n        </div>\n    </div>\n    <div class="form-content" ng-if="element.children.length">\n        <children></children>\n    </div>\n</div>\n<div class="hidden" ng-controller="PageErrorController">\n    <div ng-if="element.messages.length > 0" ng-init="triggerSystemNotification()"></div>\n</div>\n');
$templateCache.put('component/radio-field/template.html','<div class="{{element.classList}} radio-inline"\n        name="{{element.name}}"\n        id="{{element.key}}"\n        ng-model="element.value[0]"\n        ng-required="{{element.required}}"\n        ng-class="{\'has-error\':element.hasError}"\n        ng-disabled="element.disabled || element.readOnly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n        ng-readonly="element.readonly">\n         \n        <div ng-repeat="option in element.options" class="radio">\n                <input  ng-readonly="element.readonly" ng-disabled="element.disabled || element.readOnly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n                        type="radio" name="{{element.key}}+radio_pick" ng-model="element.value[0]" ng-value="option.value" ng-change="$emit(\'update\')">\n                <span class="radio-item__name">{{option.displayValue}}</span>\n        </div>\n</div>');
$templateCache.put('component/radio-inline/template.html','<div class="{{element.classList}} radio-inline"\n        name="{{element.name}}"\n        id="{{element.key}}"\n        ng-model="element.value[0]"\n        ng-required="{{element.required}}"\n        ng-class="{\'has-error\':element.hasError}"\n        ng-disabled="element.disabled || element.readOnly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n        ng-readonly="element.readonly">\n         \n        <div ng-repeat="option in element.options" class="radio-inline">\n                <input  ng-readonly="element.readonly" ng-disabled="element.disabled || element.readOnly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n                        type="radio" name="{{element.key}}+radio_pick" ng-model="element.value[0]" ng-value="option.value" ng-change="$emit(\'update\')">\n                <span class="radio-item__name">{{option.displayValue}}</span>\n        </div>\n</div>');
$templateCache.put('component/radio-group/template.html','<div class="{{element.classList}} radio-group"\n        name="{{element.name}}"\n        id="{{element.key}}"\n        ng-model="element.value[0]"\n        ng-required="{{element.required}}"\n        ng-class="{\'has-error\':element.hasError}"\n        ng-disabled="element.disabled || element.readonly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n        ng-readonly="element.readonly">\n         \n        <div ng-repeat="option in element.options" class="radio-item">\n                <input  type="radio" name="{{element.key}}+radio_pick" ng-model="element.value[0]" ng-value="option.value" ng-change="$emit(\'update\')">\n                <span class="radio-item__name">{{option.value}}</span>\n        </div>\n</div>');
$templateCache.put('component/radio-record/template.html','<div class="{{element.classList}}" radio-record\n     name="{{element.name}}"\n     id="{{element.key}}"\n     ng-model="element.value[0]"\n     ng-required="{{element.required}}"\n     ng-class="{\'has-error\':element.hasError}"\n     ng-disabled="element.disabled || element.readonly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n     ng-readonly="element.readonly">\n\n\n    <div ng-repeat="option in element.options" class="radio_record__item" ng-value="option.value" ng-class="{active : (selectedValue == option.value)}" ng-click="itemSelected($event,option)"  >\n        <div class="white_bar"></div>\n        <div class="selection_bar"></div>\n        <div class="radio_record__item__content"  >\n            <span class="icon icon_select_option"></span>\n            <h4>{{option.displayValue}}</h4>\n            <div class="pull-right arrow-group">\n                <div class="vertical_divider"></div>\n                <span class="icon icon-chevron-right"></span>\n            </div>\n\n        </div>\n    </div>\n</div>');
$templateCache.put('component/save-my-progress/template.html','<div ng-controller="SaveMyProgressButtonController">\n    <button type="button"\n            role="button"\n            aria-label="{{element.get(\'caption\')}}"\n            class="{{element.classList}}"\n            name="{{element.name}}"\n            id="{{element.key}}"\n            ng-click="update(element)"\n            ng-bind="::element.get(\'caption\')">\n    </button>\n</div>');
$templateCache.put('component/save-statis/template.html','<div field class="form-group" ng-controller="SaveStatusController">\n    <div ng-if="element.value[0] ===  \'1\' || element.value[0] ===  1">\n        <i class="saving-logo"/>\n        <span ng-init="setTime()"  ng-bind="element.options[1].displayValue"></span>\n        </span>\n    </div>\n    <span ng-if="element.value[0] ===  \'2\' || element.value[0] ===  2" ng-init="setSaved()" ng-bind="element.options[2].displayValue"></span>\n    <span ng-if="element.value[0] ===  \'3\' || element.value[0] ===  3" ng-bind="element.options[3].displayValue"></span>\n    <span ng-if="element.value[0] ===  \'4\' || element.value[0] ===  4" ng-init="setLabelForLastSaved(element.options[4].displayValue)">{{lastSavedLabel}}</span>\n    <select class="form-control hidden"\n        name="{{element.name}}"\n        id="{{element.key}}"\n        aria-labelledby="{{element.key}}"\n        ng-model="element.value[0]"\n        ng-options="option.value as option.displayValue for option in element.options"\n        ng-change="$emit(\'update\')"\n        ng-disabled="element.disabled || element.readonly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n        ng-readonly="element.readonly">\n        <option value="" disabled selected style="display: none;">{{$ctrl.form.lookupMessage(\'selectOne\')}}</option>\n    </select>\n</div>');
$templateCache.put('component/scenario-selector/template.html','<div class="{{element.classList}} + radio-group" ng-class="{\'collapse-panel\': collapse}"\n     name="{{element.name}}"\n     id="{{element.key}}"\n     ng-class="{\'has-error\':element.hasError}"\n     ng-readonly="element.readonly"\n     scenario-selector>\n     <children></children>\n</div>\n');
$templateCache.put('component/statement-agree/template.html','<div class="form-group">\n    <div class="{{element.classList}} checkbox-group"\n        id="{{element.key}}" ng-controller="statementAgreeController"\n        ng-init="init(\'boolean\', element.label);">\n        <div class="checkbox">\n            <input type="checkbox" id="{{element.key}}-checkbox"\n                ng-model="statementAgreeValue" ng-true-value="true"\n                ng-false-value="false" ng-click="updateField()"\n                ng-disabled="element.disabled || element.readOnly"\n                ng-readonly="element.readOnly" class="digital-checkbox" />\n            <label class="checkbox-value label-text"\n                for="{{element.key}}-checkbox"> {{label}} <a\n                ng-click="popupLink(linkUrl)">{{linkLabel}}</a>\n            </label>\n        </div>\n    </div>\n    <div class="control-error"\n        ng-class="{ \'has-error\': (element.messages.length > 0) }"\n        role="alert">\n        <div ng-if="element.messages.length > 0"\n            class="control-description control-errors">\n            <div ng-repeat="error in element.messages">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    aria-label="{{::error.text}}">{{::error.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/content-item-h3/template.html','<div class="{{element.classList}}">\n    <h3 class="content-h3__children">\n        <children></children>\n    </h3>\n</div>');
$templateCache.put('component/story-selector/template.html','<div class="{{element.classList}} container_block" ng-class="{\'show_underline\': collapse}"  story-selector >\n    <div ng-if="element.get(\'displayName\')" class="story-selector__title container__title">\n        <div class="selector_title container__title__column"></div><h3 ng-bind="element.get(\'displayName\')"></h3>\n    </div>\n    <children></children>\n</div>\n');
$templateCache.put('component/stepped-slider/template.html','<div class="{{element.classList}}"  id="{{element.key}}" name="{{element.name}}" disabled="{{element.disabled}}" ng-model="element.value[0]">\n            <div class="stepped-slider-content"></div>\n</div>\n\n');
$templateCache.put('component/stickyblock/template.html','<div sticky-block class="{{element.classList}} container_block" ng-class="{\'show_underline\': ((!collapse) && element.get(\'displayName\')), \'attached\': fixed}" >\n    <div ng-if="element.get(\'displayName\')" class="container__title">\n        <div class="container__title__column"></div>\n        <h3 ng-bind="element.get(\'displayName\')"></h3>\n    </div>\n    <children></children>\n</div>\n');
$templateCache.put('component/content-item-list/template.html','<div class="{{element.classList}}">\n    <div class="content-list__children">\n        <children></children>\n    </div>\n</div>');
$templateCache.put('component/text-ask-amy/template.html','<!-- This is specially for ask amy container parsed from forms moduler -->\n\n<div class="ask-amy-body" role="presentation">\n    <div class="row ask-amy-row">\n        <div class="row">\n            <div class="col-md-10 col-lg-10 ask-amy-wrapper">\n                <div>\n                    <i class="profile-image circle-ask-amy"></i>\n                </div>\n                <div class="ask-amy-content">\n                    <b><span class="type-bold type__14" aria-label="{{element._e.askAmyText}}">{{element._e.askAmyText}}</span></b>\n                    <button role="button" data-ng-click="element.openAskAmy()" target="popup" class="hsbc-arrow-link type__14" aria-label="{{element._e.askAmyLinkText}}">\n                       <span role="link" href="#{{element._e.askAmyLinkText}}"> {{element._e.askAmyLinkText}}</span>\n                    </button>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/table/template.html','<div class="bbform-contentitem">\n    <table>\n        <tr ng-repeat="row in element.children" ng-if="row.children.length > 0">\n            <td ng-repeat="cell in row.children" ng-if="cell.children.length > 0">\n                <p ng-repeat="content in cell.children"\n                   ng-bind-html="content.nodes | formatContentItem" ng-if="content.nodes.length > 0"></p>\n            </td>\n        </tr>\n    </table>\n</div>');
$templateCache.put('component/text-item/template.html','<div class="{{(element.classList +\' \'+ element.contentStyle)}}" ng-controller="TextItemController" ng-init="onLoadTextItem()">\n    <!-- <children></children> -->\n    <p id="{{element._e.key}}"\n       aria-label="{{element._e.nodes | formatContentItem}}"\n       ng-bind-html="element._e.nodes | formatContentItem"\n       class="{{element._e.styles | beautify}}"\n       data-ng-if="element.styles[0] != \'password_tick\' && element.styles[1] != \'password_tick\'">\n    </p>\n    <p id="{{element._e.key}}-id"\n       aria-label="{{element._e.nodes | formatContentItem}}"\n       ng-bind-html="element._e.nodes | formatContentItem"\n       class="password-validation-label {{element._e.styles | beautify}}"\n       data-ng-if="element.styles[0] == \'password_tick\'  || element.styles[1] == \'password_tick\'">\n    </p>\n</div>\n');
$templateCache.put('component/text-download-link/template.html','<button type="button"\n        here class="btn-link {{(element.classList +\' \'+ element.contentStyle )}}"\n        name="{{element.name}}" id="{{element._e.key}}"\n        ng-click="element.callLink()">\n    {{element._e.linkText}}\n</button>\n');
$templateCache.put('component/text-save-progress/template.html','<span hidden id="savedTextHidden">{{element._e.nodes[0].values[0]}}</span>\n<span hidden id="savedTimeHidden">{{element._e.nodes[2].values[0]}}</span>\n<span hidden id="caseIDHidden" >{{element._e.nodes[4].values[0]}}</span>');
$templateCache.put('component/textarea/template.html','<textarea\n    class="form-control {{::element.classList}}"\n    ng-model="element.value[0]"\n    name="{{element.name}}"\n    id="{{element.key}}"\n    ng-blur="$emit(\'update\')"\n    ng-required="element.required"\n    ng-disabled="element.disabled"\n    ng-readonly="element.readOnly"\n    maxlength="{{element.maxLength}}"\n    novalidate>\n</textarea>\n');
$templateCache.put('component/utag_event_data/template.html','<div id="{{element.styles[1]}}" ng-controller="UtagEventController" ng-init="onLoad()">\n    <p id="{{element._e.key}}"\n       aria-label="{{element._e.nodes | formatContentItem}}"\n       ng-bind-html="element._e.nodes | formatContentItem"\n       class="{{element._e.styles | beautify}}"\n       data-ng-if="element.styles[0] != \'password_tick\' && element.styles[1] != \'password_tick\'">{{element}}\n    </p>\n</div>\n');
$templateCache.put('component/text-download-item/template.html','<button type="button"\n        here class="{{(element.classList +\' \'+ element.contentStyle )}}"\n        name="{{element.name}}" id="{{element._e.key}}"\n        ng-click="element.callAction()"\n        style="margin-left: 120px; margin-top: 20px;">\n    <!--<i class="icon icon-download" style="font-size: 24pt;"></i>-->\n    {{element._e.linkText}}\n</button>\n');
$templateCache.put('component/utag_page_data/template.html','<div id="utagPageData" ng-controller="UtagPageController"></div>\n');
$templateCache.put('component/wf-application-primary-container/template.html','<div id="{{elementChild.key}}"\n    ng-repeat="elementChild in element.children track by elementChild.key">\n    <div ng-controller="FormApplicationPrimaryContainer"\n        ng-init="setChildData(elementChild);">\n        <div ng-if="blockName === 1">\n            <div class="row form-primary-header">\n                <div\n                    class="col-xs-offset-1 col-xs-10 col-sm-offset-1 col-sm-10 col-md-offset-1 col-md-10 col-lg-offset-1 col-lg-10">\n                    <div id="{{elementChild.key}}-Header">\n                        <h1 class="type-thin"\n                            ng-if="elementChild._e.displayName"\n                            ng-bind="elementChild._e.displayName"\n                            aria-label="{{elementChild._e.displayName}}"></h1>\n                    </div>\n                </div>\n            </div>\n            <div class="row page-description type-thin"\n                ng-if="elementChild.children.length > 0">\n                <div\n                    class="col-xs-offset-1 col-xs-9 col-sm-offset-1 col-sm-9 col-md-offset-1 col-md-9 col-lg-offset-1 col-lg-8">\n                    <div\n                        id="{{elementChild._e._displayName.key}}-Description">\n                        <bb-element data-key="{{child.key}}"\n                            ng-repeat="child in elementChild.children track by child.key"></bb-element>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="row" ng-if="blockName === 2">\n            <div\n                class="col-xs-offset-1 col-xs-9 col-sm-offset-1 col-sm-9 col-md-offset-1 col-md-9 col-lg-offset-1 col-lg-8 col form-application-primary-container">\n                <bb-element data-key="{{child.key}}"\n                    ng-repeat="child in [elementChild] track by child.key"></bb-element>\n            </div>\n        </div>\n        <div class="row" ng-if="blockName === 4 && isSystemNotification">\n            <div\n                class="col-xs-offset-1 col-xs-10 col-sm-offset-1 col-sm-10 col-md-offset-1 col-md-10 col-lg-offset-1 col-lg-10">\n                <div class="system-notification" role="alert">\n                    <div class="notification-icon"></div>\n                    <div class="notification-wrapper">\n                        <bb-element data-key="{{child.key}}"\n                            ng-repeat="child in elementChild.children track by child.key"></bb-element>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="col-xs-12 form-controle-links"\n            ng-if="blockName === 3">\n            <div class="row">\n                <div\n                    class="col-xs-offset-1 col-xs-11 col-sm-offset-1 col-sm-11 col-md-offset-1 col-md-11 col-lg-offset-1 col-lg-11">\n                    <bb-element data-key="{{child.key}}"\n                        ng-repeat="child in elementChild.children track by child.key"></bb-element>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-container-accordion-list/template.html','<div class="accordion-panel-group accordion"\n    ng-repeat="firstLevelElement in element.children track by firstLevelElement.key">\n    <div class="accordion-panel" ng-controller="AccordionController"\n        ng-init="setCurrentElement(firstLevelElement)">\n        <div id="{{currentElement.name}}"\n            class="accordion-panel-heading">\n            <h4 class="accordion-panel-title">\n                <a id="{{currentElement.key}}-{{$index}}-toggle"\n                    ng-bind="currentElement.title"\n                    aria-label="{{currentElement.title}}"></a>\n                <div class="panel-header-right"\n                    ng-if="firstLevelElement.classList === \'accordian\'">\n                    <i class="icon icon-circle-confirmation-solid"\n                        ng-if="!showFirstLevel && showGreenTick"></i>\n                    <bb-element data-key="{{child.key}}"\n                        ng-repeat="child in [firstLevelElement.children[1]] track by child.key"\n                        ng-if="showFirstLevel"></bb-element>\n                    <span data-toggle="collapse"\n                        ng-click="showFirstLevel = !showFirstLevel"\n                        href="#{{firstLevelElement.key}}-{{$index}}"\n                        ng-class="{\'open\':showFirstLevel}"></span>\n                </div>\n            </h4>\n        </div>\n        <div id="{{firstLevelElement.key}}-{{$index}}"\n            class="accordion-panel-collapse collapse"\n            ng-class="{\'in\':showGreenTick === false || firstLevelElement.classList !== \'accordian\'}">\n            <div ng-if="firstLevelElement.classList === \'accordian\'"\n                class="accordion-panel-body">\n                <div id="{{child.key}}"\n                    ng-repeat="child in currentElement.content track by child.key"\n                    class="{{child.type}}">\n                    <div\n                        ng-if="child.type && child.type === \'sectionHeading\'">\n                        <h3 ng-bind="child.label"\n                            aria-label="{{child.label}}"></h3>\n                    </div>\n                    <div ng-if="child.type && child.type === \'capacity\'"\n                        class="capacity">\n                        <span class="type type__14"\n                            ng-if="child.label.length && child.label.length > 0"\n                            ng-bind="child.label"\n                            aria-label="{{child.label}}"></span>\n                        <div\n                            ng-repeat="capacityElement in child.selectCapacities"\n                            class="{{capacityElement.type}}">\n                            <div\n                                ng-if="capacityElement.type === \'boolean\'">\n                                <div class="field-value type type__16"\n                                    ng-if="capacityElement.label.length && capacityElement.label.length > 0"\n                                    ng-bind="capacityElement.label"\n                                    aria-label="{{capacityElement.label}}"></div>\n                            </div>\n                            <div\n                                ng-if="capacityElement.type !== \'boolean\'">\n                                <span class="type type__14"\n                                    ng-if="capacityElement.label.length && capacityElement.label.length > 0"\n                                    ng-bind="capacityElement.label"\n                                    aria-label="{{capacityElement.label}}"></span>\n                                <div class="field-value type type__16"\n                                    ng-if="capacityElement.value.length && capacityElement.value.length > 0"\n                                    ng-bind="capacityElement.value"\n                                    aria-label="{{capacityElement.value}}"></div>\n                                <div class="error-text type type__16"\n                                    ng-if="capacityElement.message.length && capacityElement.message.length > 0 && (!capacityElement.value.length || capacityElement.value.length === 0)"\n                                    ng-bind="capacityElement.message"\n                                    aria-label="{{capacityElement.message}}"></div>\n                            </div>\n                        </div>\n                    </div>\n                    <div\n                        ng-if="child.type && child.type !== \'sectionHeading\' && child.type !== \'table\' && child.type !== \'capacity\'">\n                        <span class="type type__14"\n                            ng-if="child.label.length && child.label.length > 0"\n                            ng-bind="child.label"\n                            aria-label="{{child.label}}"></span>\n                        <div class="field-value type type__16"\n                            ng-if="child.value.length && child.value.length > 0"\n                            ng-bind="child.value"\n                            aria-label="{{child.label}}"></div>\n                        <div class="error-text type type__16"\n                            ng-if="child.message.length&& child.message.length>0 && (!child.value.length ||child.value.length === 0)"\n                            ng-bind="child.message"\n                            aria-label="{{child.message}}"></div>\n                    </div>\n                    <div ng-if="child.type && child.type === \'table\'">\n                        <span class="type type__14"\n                            ng-if="child.label.length && child.label.length > 0"\n                            ng-bind="child.label"\n                            aria-label="{{child.label}}"></span>\n                        <div class="bbform-contentitem">\n                            <table class="table table-striped">\n                                <tbody>\n                                    <tr class="table-header">\n                                        <td\n                                            ng-repeat="tableHeaderElement in child.tableHeader">\n                                            <span class="type type__14"\n                                            ng-if="tableHeaderElement.length && tableHeaderElement.length > 0"\n                                            ng-bind="tableHeaderElement"\n                                            aria-label="{{tableHeaderElement}}"></span>\n                                        </td>\n                                    </tr>\n                                    <tr\n                                        ng-repeat="row in child.tableBody"\n                                        class=\'table-row\'>\n                                        <td ng-repeat="cell in row">\n                                            <div\n                                                class="field-value type type__16"\n                                                ng-if="cell.value.length && cell.value.length > 0"\n                                                ng-bind="cell.value"\n                                                aria-label="{{cell.value}}"></div>\n                                            <div\n                                                class="error-text type type__16"\n                                                ng-if="cell.message.length && cell.message.length > 0 && (!cell.value.length || cell.value.length === 0)"\n                                                ng-bind="cell.message"\n                                                aria-label="{{cell.message}}"></div>\n                                        </td>\n                                    </tr>\n                                </tbody>\n                            </table>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div ng-if="firstLevelElement.classList !== \'accordian\'"\n                class="accordion-sub-panel">\n                <div class="arrow-box">\n                    <div class="arrow"></div>\n                </div>\n                <bb-element data-key="{{child.key}}"\n                    ng-repeat="child in [firstLevelElement] track by child.key"></bb-element>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-all-forms-data/template.html','<div ng-controller="FormDataController" ng-init="init()">\n    <div ng-if="!hideChilds">\n        <bb-element data-key="{{child.key}}" ng-repeat="child in element.children track by child.key"></bb-element>\n    </div>\n</div>');
$templateCache.put('component/wf-container-contact-number/template.html','<div field class="form-group phone-number"\n    ng-controller="ContactNumberController" ng-init="init()">\n    <label class="control-label"> <span ng-bind="label"></span>\n        <div ng-if="showDescriptionIcon" class="pull-right">\n            <wf-tooltip popover-description="description"\n                popover-element-id="popoverElementId"></wf-tooltip>\n        </div>\n    </label>\n    <div class="phone-container">\n        <div ng-repeat="element in childrenElements">\n            <div ng-class="($first) ? \'area-code\' : \'number\'">\n                <div class="control-field"\n                    ng-class="{ \'has-error\': (element.messages.length > 0) }">\n                    <label for="{{element.key}}"\n                        class="control-label hidden"\n                        aria-label="{{label}}"> <span\n                        ng-bind="label"></span>\n                    </label> <input class="form-control digitaltext"\n                        id="{{element.key}}"\n                        aria-labelledby="{{element.key}}"\n                        name="{{element.name}}" type="text"\n                        ng-disabled="element.disabled"\n                        ng-readonly="element.readOnly"\n                        ng-class="{ \'empty\': (!element.values || element.values==\'\') }"\n                        ng-blur="$emit(\'update\')"\n                        ng-model="element.value[0]"\n                        ng-required="element.required"\n                        maxlength="{{element.maxLength = (!element.maxLength || element.maxLength === -1)? 200: element.maxLength}}"\n                        novalidate />\n                </div>\n            </div>\n            <span class="dash" ng-if="($first)">\u2014</span>\n        </div>\n    </div>\n    <div class="control-error" ng-repeat="element in childrenElements"\n        ng-if="element.messages.length > 0"\n        ng-class="{ \'has-error\': element.hasError }" role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="error in element.messages"\n                ng-if="$index === 0">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    aria-label="{{::error.text}}">{{::error.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-container-address/template.html','<div field class="form-group address-container" ng-controller="AddressController">\n    <label for="element.key" ng-if="element.get(\'displayName\')" class="control-label">\n        <span ng-bind="element.get(\'displayName\')"></span>\n    </label>\n    <div class="row">\n        <div class="col-xs-6" ng-repeat="child in elementChildren  track by child.key">\n            <bb-element data-key="{{child.key}}"></bb-element>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-container-currency/template.html','<div field class="form-group currency-container" ng-controller="CurrencyController" ng-init="init()">\n    <label for="{{element.key}}" ng-if="label !== \'\'" class="control-label">\n        <span ng-bind="element.get(\'displayName\')" aria-label="{{element.get(\'displayName\')}}"></span>\n        <div ng-if="showDescriptionIcon" class="tooltip">\n            <wf-tooltip popover-description="description" popover-element-id="popoverElementId"></wf-tooltip>\n        </div>\n    </label>\n    <div class="row">\n        <div class="col-xs-6"  ng-repeat="child in childrenElements track by child.key" aria-labelledby="{{element.key}}">\n            <bb-element data-key="{{child.key}}"></bb-element>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-container-hk-number/template.html','<div field class="form-group hkid-number" ng-controller="HKIDController" ng-init="init()">\n    <div class="control-label" aria-label="{{label}}">\n        <span ng-bind="label"></span>\n        <div ng-if="showDescriptionIcon" class="tooltip">\n            <wf-tooltip popover-description="description" popover-element-id="popoverElementId"></wf-tooltip>\n        </div>\n    </div>\n    <div class="hkid-container">\n        <div ng-repeat="element in childrenElements">\n            <div ng-class="($first) ? \'number\' : \'check-digit\'">\n                <div class="control-field" ng-class="{ \'has-error\': (element.messages.length > 0) }">\n                    <label for="{{element.key}}" class="control-label hidden" aria-label="{{label}}">\n                        <span ng-bind="label"></span>\n                    </label>\n                    <input\n                            class="form-control digitaltext"\n                            id="{{element.key}}"\n                            aria-labelledby="{{element.key}}"\n                            name="{{element.name}}"\n                            type="text"\n                            ng-disabled="element.disabled"\n                            ng-readonly="element.readOnly"\n                            ng-class="{ \'empty\': (!element.values || element.values==\'\') }"\n                            ng-blur="$emit(\'update\')"\n                            ng-model="element.value[0]"\n                            ng-required="element.required"\n                            maxlength="{{element.maxLength = (!element.maxLength || element.maxLength === -1)? 200: element.maxLength}}"\n                            novalidate />\n\n                </div>\n            </div>\n            <span class="bracket" ng-if="($first)">( </span>\n            <span ng-if="($last)">)</span>\n        </div>\n    </div>\n    <div class="control-error" ng-repeat="element in childrenElements" ng-init="hasError = (element.hasError)? hasError + 1: hasError " ng-if="element.messages.length > 0" ng-class="{ \'has-error\': element.hasError }" role="alert">\n        <div class="control-description control-errors" ng-if="hasError === 1">\n            <div ng-repeat="error in element.messages">\n                <i class="icon icon-circle-delete"></i>\n                <span class="description-body text-muted" aria-label="{{::error.text}}">{{::error.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-amount/template.html','<div field class="form-group amount" ng-controller="AmountController">\n    <label class="control-label" ng-if="element.label || element.label === \'empty\'">\n        <span ng-bind="element.label && element.label === \'empty\'"></span>\n        <span ng-bind="element.label === \'empty\'">&nbsp;</span>\n        <div ng-if="element.description !== \'\'" class="tooltip">\n            <wf-tooltip popover-description="element.description" popover-element-id="popoverElementId"></wf-tooltip>\n        </div>\n    </label>\n    <div class="control-field" ng-class="{ \'has-error\': element.hasError }">\n        <div>\n            <input type="text"\n                   numbers-only\n                class="form-control"\n                name="{{element.name}}"\n                id="{{element.key}}"\n                ng-blur="update()"\n                ng-model="amountValue"\n                ng-required="element.required"\n                ng-disabled="element.disabled"\n                ng-readonly="element.readOnly"\n                maxlength="{{element.maxLength = (!element.maxLength || element.maxLength === -1)? 200: element.maxLength}}"\n                novalidate>\n        </div>\n    </div>\n    <div class="control-error has-error" ng-if="element.hasError" role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="massage in element.messages">\n                <i class="icon icon-circle-delete"></i>\n                <span class="description-body text-muted" aria-label="{{::massage.text}}">{{::massage.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>\n');
$templateCache.put('component/wf-container-hash-password/template.html','<div ng-controller="HashPassword">\n    <div ng-repeat="childElement in element.children">\n        <input class="form-control digitaltext"\n            id="{{childElement.key}}" name="{{childElement.name}}"\n            type="hidden" ng-disabled="childElement.disabled"\n            ng-readonly="childElement.readOnly"\n            ng-class="{ \'empty\': (!childElement.value || !childElement.value[0] && childElement.value[0] === \'\') }"\n            ng-model="childElement.value[0]"\n            ng-required="childElement.required"\n            ng-if="childElement.classList === \'password-with-hashing\'"\n            novalidate />\n        <div ng-if="childElement.classList !== \'password-with-hashing\'"\n            ng-init="setHashChangeEvent(childElement)">\n            <bb-element data-key="{{child.key}}"\n                ng-repeat="child in [childElement] track by child.key"></bb-element>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-auto-complete/template.html','<div class="form-group" ng-controller="AutoCompleteControllerData" ng-init=\'init()\'>\n    <div class="control-label" ng-if="element.label" aria-label="{{element.label}}">\n        <span ng-bind="element.label"></span>\n        <span ng-if="element.description !== \'\'">\n            <wf-tooltip popover-description="element.description" popover-element-id="popoverElementId"></wf-tooltip>\n        </span>\n    </div>\n    <div class=\'multi-value autocomplete\'>\n        <div class="control-field" ng-class="{ \'has-error\': (element.messages.length > 0) }">\n            <div class="dropdown-input"\n                 id="{{elementId}}"\n                 ng-click=\'changeFocus()\'\n                 ng-class="{ \'has-error\': (element.messages.length > 0) }">\n                <ul>\n                    <li class=\'search\'>\n                        <pre class=\'pre-input\' ng-bind="hoverValue" ></pre>\n                        <label for="{{inputId}}" class="control-label hidden" aria-label="{{element.label}}">\n                            <span ng-bind="element.label"></span>\n                        </label>\n                        <input  id=\'{{inputId}}\'\n                                aria-labelledby=\'{{inputId}}\'\n                                aria-autocomplete="list"\n                                type=\'text\'\n                                ng-model=\'dataValue\'\n                                ng-change=\'onChange(dataValue)\'\n                                ng-keydown=\'keyDown($event)\'\n                                ng-class=\'{"hide-text":onHover}\'\n                                ng-blur="checkOption(dataValue)"\n                        />\n                    </li>\n                </ul>\n            </div>\n            <div class=\'dropdown-ul\'\n                 ng-show=\'optionsArray.length > 0\'\n                 id=\'{{dropdownId}}\'>\n                <ul>\n                    <li class=\'{{optionIdPrefix}}{{$index}}\'\n                        ng-repeat=\'option in optionsArray\'\n                        ng-class=\'{"selected" : $index === currentIndex}\'\n                        ng-mouseover=\'setHover(option)\'\n                        ng-mouseout=\'resetHover(option)\'\n                        ng-click=\'setOption(option, $event)\'>\n                        <span ng-bind-html=\'option.displayText\' role="option"></span>\n                    </li>\n                </ul>\n            </div>\n        </div>\n    </div>\n    <div class="control-error has-error" ng-if="element.hasError" role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="massage in element.messages">\n                <i class="icon icon-circle-delete"></i>\n                <span class="description-body text-muted" id="{{element.key}}-error_id" aria-label="{{::massage.text}}">{{::massage.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>\n');
$templateCache.put('component/wf-element-autotrigger-button/template.html','<div ng-controller="AutoTriggerController">\n    <div ng-if="trigger">\n        <button\n            class="hidden" \n            type="button" \n            here  \n            name="{{element.name}}" \n            id="{{element.key}}"\n            ng-click="$emit(\'update\')" \n            ng-init="$emit(\'update\')">\n        </button>\n    </div>\n</div>');
$templateCache.put('component/wf-element-button-generate-download-pdf/template.html','<button type="button" role="button"\n    aria-label="{{element.get(\'caption\')}}"\n    class="{{element.classList}}" name="{{element.name}}"\n    id="{{element.key}}" ng-click="update()"\n    ng-disabled="(element.disabled || element.readOnly)"\n    ng-controller="DownloadPdfButtonController">\n    <span ng-bind="::element.get(\'caption\')"></span>\n</button>');
$templateCache.put('component/wf-element-checkbox-group/template.html','<div class="form-group checkbox-group" name="{{element.name}}"\n    id="{{element.key}}" ng-model="element.value[0]"\n    ng-required="{{element.required}}"\n    ng-class="{\'has-error\':element.hasError}"\n    ng-disabled="element.disabled || element.readonly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n    ng-readonly="element.readonly"\n    ng-controller="CheckboxGroupController as cbg">\n    <div class="control-field"\n        ng-class="{ \'has-error\': (element.messages.length > 0) }">\n        <fieldset>\n            <legend for="{{element.key}}"\n                ng-if="element.questionText.length"\n                class="control-label"\n                aria-label="{{element.questionText}}">\n                <span ng-bind="element.label"></span> <span\n                    ng-if="element.description !== \'\'"> <wf-tooltip\n                        popover-description="element.description"\n                        popover-element-id="popoverElementId"></wf-tooltip>\n                </span>\n            </legend>\n            <div class="checkbox" ng-repeat="option in element.options">\n                <input type="checkbox" id="{{element.key}}-{{$index}}"\n                    name="{{element.name}}"\n                    ng-model="cbg.valueMap[$index]"\n                    ng-change="cbg.updateValues();"\n                    ng-disabled="element.disabled || element.readOnly"\n                    ng-readonly="element.readOnly"\n                    class="digital-checkbox" /> <label\n                    class="checkbox-value" ng-bind="option.displayValue"\n                    for="{{element.key}}-{{$index}}"></label>\n            </div>\n        </fieldset>\n    </div>\n    <div class="control-error has-error" ng-if="element.hasError"\n        role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="massage in element.messages">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    id="{{element.key}}-error_id"\n                    aria-label="{{::massage.text}}">{{::massage.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-datepicker/template.html','<div field class="form-group" ng-controller="WfDatepickerController">\n    <label class="control-label" ng-if="element.label"\n        for="{{element.key}}" aria-label="{{element.label}}"> <span\n        ng-bind="element.label"></span> <span\n        ng-if="element.description !== \'\'"> <wf-tooltip\n                popover-description="element.description"\n                popover-element-id="popoverElementId"></wf-tooltip>\n    </span>\n    </label>\n    <div class="control-field"\n        ng-class="{ \'has-error\': (element.messages.length > 0) }">\n        <input class="form-control digitaltext" id="{{element.key}}"\n            name="{{element.name}}" type="hidden"\n            maxlength="{{element.maxLength = (!element.maxLength || element.maxLength === -1)? 200: element.maxLength}}"\n            ng-disabled="element.disabled"\n            ng-readonly="element.readOnly"\n            ng-class="{ \'empty\': (!element.values || element.values==\'\') }"\n            ng-blur="update()" ng-focus="update()"\n            aria-labelledby="{{element.key}}"\n            ng-model="element.value[0]" ng-required="element.required"\n            novalidate />\n        <div class="{{element.classList}} date-wrapper" ng-class={\'has-error\':element.hasError} >\n            <input type="text" numbers-only placeholder="DD"\n                aria-label="Date" class="form-control date-input"\n                ng-model="dd" ng-blur="updateDate();"\n                ng-focus="$emit(\'update\');" min="1" max="31"\n                maxlength="2" /> <span class="dash">\u2014</span> <input\n                type="text" numbers-only placeholder="MM"\n                aria-label="Month" class="form-control date-input"\n                ng-model="mm" ng-blur="updateDate();"\n                ng-focus="$emit(\'update\');" min="1" max="12"\n                maxlength="2" /> <span class="dash">\u2014</span> <input\n                type="text" numbers-only placeholder="YYYY"\n                aria-label="Year" class="form-control date-input"\n                ng-model="yyyy" ng-blur="updateDate();"\n                ng-focus="$emit(\'update\');" min="1900" max="2050"\n                maxlength="4" />\n        </div>\n    </div>\n    <div class="control-error has-error" ng-if="element.hasError"\n        role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="massage in element.messages"\n                ng-if="!invalidDate">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    id="{{element.key}}-error_id"\n                    aria-label="{{::massage.text}}">{{::massage.text}}</span>\n            </div>\n            <div ng-repeat="massage in dateMessages" ng-if="invalidDate">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    id="{{element.key}}-error_id"\n                    aria-label="{{::massage.text}}">{{::massage.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-download-checklist/template.html','<a ng-controller="DownloadChecklistController" href="{{documentUrl}}"\n   target="_blank" download="{{documentName}}"\n    type="button"\n    class="{{element.classList}} hsbc-link"\n    name="{{element.name}}"\n    id="{{element.key}}"\n    ng-bind="::element.get(\'caption\')">\n</a>\n');
$templateCache.put('component/wf-element-dropdown/template.html','<div field class="form-group" ng-controller="DropdownController"\n    ng-init="setDropDownValue();">\n    <label class="control-label" for="{{element.key}}"\n        ng-if="element.label" aria-label="{{element.label}}"> <span\n        ng-bind="element.label"></span> <span ng-if="tooltipText !== \'\'">\n            <wf-tooltip popover-description="element.description"\n                popover-element-id="popoverElementId"></wf-tooltip>\n    </span>\n    </label>\n    <div class="control-field"\n        ng-class="{ \'has-error\': (element.messages.length > 0) }">\n        <div class="control-select custom-dropdown">\n            <!--<select class="form-control"                    name="{{element.name}}"                    id="{{element.key}}"                    aria-labelledby="{{element.key}}"                    ng-model="element.value[0]"                    ng-options="option.value as option.displayValue for option in element.options"                    ng-change="$emit(\'update\')"                    ng-disabled="element.disabled || element.readonly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"                    ng-readonly="element.readonly">                <option value="" disabled selected style="display: none;">{{element._e.explainText}}</option>            </select>-->\n            <div id="{{elementId}}" class="custom-dropdown-container">\n                <button id="btn-custom-dropdown"\n                    ng-click="triggerDropdoen($event)"\n                    ng-keydown="keyEvent($event)"\n                    ng-disabled="element.disabled || element.readonly"\n                    class="form-control dropdown-toggle"\n                    aria-label="{{selectedValue}}" aria-haspopup="true"\n                    aria-expanded="{{isOpen}}">\n                    <i class="icon"\n                        ng-class="{\'icon-chevron-up-small\':isOpen,\'icon-chevron-down-small\':!isOpen}"></i>\n                    {{selectedValue}}\n                </button>\n                <ul role="listbox" aria-labelledby="btn-custom-dropdown"\n                    ng-show="isOpen" id="{{dropdownId}}">\n                    <li role="optionitem"\n                        class=\'{{optionIdPrefix}}{{$index}}\'\n                        ng-repeat="option in element.options"\n                        ng-class="{\'selected\' : $index === currentIndex}"\n                        ng-click="select(option, $index)" tabindex="0"><span\n                        aria-label="{{option.displayValue}}">{{option.displayValue}}</span>\n                    </li>\n                </ul>\n            </div>\n        </div>\n    </div>\n    <div class="control-error has-error" ng-if="element.hasError"\n        role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="massage in element.messages">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    aria-label="{{::massage.text}}">{{::massage.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-checkbox/template.html','<div input-checkbox class="form-group checkbox checkbox-single">\n    <input type="checkbox"\n           id="{{element.key}}"\n           aria-labelledby="{{element.key}}"\n           name="{{element.name}}"\n           ng-model="element.value[0]"\n           ng-true-value="\'true\'"\n           ng-false-value="\'false\'"\n           ng-change="$emit(\'update\')"\n           ng-disabled="element.disabled || element.readOnly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n           ng-readonly="element.readOnly" />\n    <label class="checkbox-value" for="{{element.key}}" ng-bind="element.label" aria-label="{{element.label}}"></label>\n</div>');
$templateCache.put('component/wf-element-dropdown-disabled-like-text/template.html','<div field class="form-group"\n    ng-controller="DropdownDisabledLikeTextController"\n    ng-init="setDropDownValue()">\n    <label class="control-label" for="{{element.key}}"\n        ng-if="element.label" aria-label="{{element.label}}"> <span\n        ng-bind="element.label"></span> <span ng-if="tooltipText !== \'\'">\n            <wf-tooltip popover-description="element.description"\n                popover-element-id="popoverElementId"></wf-tooltip>\n    </span>\n    </label>\n    <div class="control-field"\n        ng-class="{ \'has-error\': (element.messages.length > 0) }">\n        <input class="form-control digitaltext" id="{{element.key}}"\n            name="{{element.name}}" type="text" disabled="disabled"\n            ng-class="{ \'empty\': (!element.values || element.values==\'\') }"\n            ng-blur="update()" ng-focus="update()"\n            aria-labelledby="{{element.key}}" ng-model="selectedValue"\n            ng-required="element.required" novalidate />\n    </div>\n    <div class="control-error has-error" ng-if="element.hasError"\n        role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="massage in element.messages">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    id="{{element.key}}-error_id"\n                    aria-label="{{::massage.text}}">{{::massage.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-form-notification/template.html','<div ng-repeat="child in element.children track by child.key"\n    ng-controller="FormNotificationController">\n    <div class="form-notification {{getClasses(child)}}" role="alert">\n        <div class="notification-icon"></div>\n        <div class="notification-wrapper">\n            <p id="{{child._e.key}}"\n                aria-label="{{child._e.nodes | formatContentItem}}"\n                ng-bind-html="child._e.nodes | formatContentItem"\n                class="{{child._e.styles | beautify}}"></p>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-label/template.html','<div field class="form-group" ng-controller="LabelController">\n    <label class="control-label" ng-if="element.label"> <span\n        ng-bind="element.label" aria-label="{{element.label}}"></span>\n        <div ng-if="element.description !== \'\'" class="tooltip">\n            <i class="icon icon-circle-info"></i> <span\n                class="tooltip-text" ng-bind="element.description"></span>\n        </div>\n    </label>\n    <div class="control-field"\n        ng-class="{ \'has-error\': (element.messages.length > 0) }">\n        <label class="type-regular type__14"\n            aria-label="{{element.value[0]}}">{{element.value[0]}}</label>\n    </div>\n    <div class="control-error has-error" ng-if="element.hasError"\n        role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="massage in element.messages">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    aria-label="{{::massage.text}}">{{::massage.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-multi-select/template.html','<div class="form-group" ng-controller="MultiSelectController"\n    ng-init=\'init()\'>\n    <div class="control-label" ng-if="element.label">\n        <span ng-bind="element.label" aria-label="{{element.label}}"></span>\n        <span ng-if="element.description !== \'\'"> <wf-tooltip\n                popover-description="element.description"\n                popover-element-id="popoverElementId"></wf-tooltip>\n        </span>\n    </div>\n    <div class=\'multi-value\'>\n        <div class="control-field"\n            ng-class="{ \'has-error\': (element.messages.length > 0) }">\n            <div class="dropdown-input" id="{{elementId}}"\n                ng-click=\'changeFocus()\' ng-focus=\'changeFocus()\'\n                ng-class="{ \'has-error\': (element.messages.length > 0) }">\n                <ul role="combobox">\n                    <li class=\'option\'\n                        ng-repeat="option in selectOptions">\n                        <div class="option-button">\n                            <span ng-bind=\'option.displayValue\'\n                                aria-label="{{option.displayValue}}"></span>\n                            <i class="icon icon-delete"\n                                ng-click=\'removeOption(option)\'></i>\n                        </div>\n                    </li>\n                    <li class=\'search\'><pre class=\'pre-input\'\n                            ng-bind="hoverValue"></pre> <label\n                        for="{{inputId}}" class="control-label hidden"\n                        aria-label="{{element.label}}"> <span\n                            ng-bind="element.label"></span>\n                    </label> <input id="{{inputId}}"\n                        aria-labelledby="{{inputId}}" type=\'text\'\n                        ng-keydown=\'keyDown($event)\'\n                        ng-keyup="keyEvent($event)" ng-model=\'fetchText\'\n                        ng-class="{\'hide-input\':onHover}" novalidate />\n                    </li>\n                </ul>\n            </div>\n            <div class="dropdown-ul"\n                ng-show=\'fetchTextOptions.length>0 && fetchText.length > 0\'\n                id="{{dropdownId}}">\n                <ul>\n                    <li class=\'{{optionIdPrefix}}{{$index}}\'\n                        role="optionitem"\n                        ng-repeat="option in fetchTextOptions"\n                        ng-class="{\'selected\' : $index === currentIndex}"\n                        ng-mouseover=\'setHover(option)\'\n                        ng-mouseout=\'resetHover(option)\'\n                        ng-click="selectThisOption(option, $event)"><span\n                        ng-bind=\'option.displayValue\'\n                        aria-label="option.displayValue"></span></li>\n                </ul>\n            </div>\n        </div>\n    </div>\n    <div class="control-error has-error" ng-if="element.hasError"\n        role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="massage in element.messages">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    id="{{element.key}}-error_id"\n                    aria-label="{{::massage.text}}">{{::massage.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-password/template.html','<div field class="form-group" ng-controller="PasswordController">\n    <label class="control-label" for="{{element.key}}"\n        aria-label="{{element.label}}"> <span\n        ng-bind="element.label"></span> <span ng-if="description !== \'\'">\n            <wf-tooltip popover-description="description"\n                popover-element-id="popoverElementId"></wf-tooltip>\n    </span>\n    </label>\n    <div class="control-field"\n        ng-class="{ \'has-error\': element.hasError }">\n        <div class="custom-password-field">\n            <input class="form-control" id="{{element.key}}"\n                aria-labelledby="{{element.key}}"\n                name="{{element.name}}" autocomplete="new-password"\n                ng-paste="$event.preventDefault();"\n                ng-copy="$event.preventDefault();"\n                ng-attr-type="{{fieldType}}"\n                ng-mouseover="mouseover()"\n                ng-disabled="isdisabled"\n                ng-readonly="element.readOnly"\n                ng-class="{ \'empty\': (!element.values || element.values==\'\') }"\n                ng-blur="update()" ng-keyup="keyPress($event)"\n                ng-model="element.value[0]"\n                ng-required="element.required"\n                maxlength="{{element.maxLength = (!element.maxLength || element.maxLength === -1)? 200: element.maxLength}}"\n                novalidate /> <span class="input-group-addon"\n                ng-if="fieldType === \'password\'"\n                ng-click="changeFieldType(\'text\')">\n                <div class="seperator">\n                    <span class="type__14" ng-bind="showText"></span>\n                </div>\n            </span> <span class="input-group-addon"\n                ng-if="fieldType === \'text\'"\n                ng-click="changeFieldType(\'password\')">\n                <div class="seperator">\n                    <span class="type__14" ng-bind="hideText"></span>\n                </div>\n            </span>\n        </div>\n    </div>\n    <div class="control-error has-error" ng-if="element.hasError"\n        role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="massage in element.messages"\n                ng-if="$index === 0">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    id="{{element.key}}-error_id"\n                    aria-label="{{::massage.text}}">{{::massage.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-percentage/template.html','<div field class="form-group" ng-controller="PercentageController">\n    <label class="control-label" for="{{element.key}}"\n        aria-label="{{element.label}}"> <span\n        ng-bind="element.label"></span>\n        <div ng-if="element.description !== \'\'" class="tooltip">\n            <i class="icon icon-circle-info"></i> <span\n                class="tooltip-text" ng-bind="element.description"></span>\n        </div>\n    </label>\n    <div class="control-field "\n        ng-class="{ \'has-error\': element.hasError }">\n        <div class="input-group custom-percentage-field ">\n            <input type="text" class="form-control"\n                name="{{element.name}}" id="{{element.key}}"\n                aria-labelledby="{{element.key}}" ng-blur="update()"\n                ng-model="percentageValue"\n                ng-required="element.required"\n                ng-disabled="element.disabled"\n                ng-readonly="element.readOnly"\n                maxlength="{{element.maxLength}}" novalidate /> <span\n                class="input-group-addon">%</span>\n        </div>\n    </div>\n    <div class="control-error has-error" ng-if="element.hasError"\n        role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="massage in element.messages">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    id="{{element.key}}-error_id"\n                    aria-label="{{::massage.text}}">{{::massage.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-radio-group/template.html','<div class="form-group radio custom-radio-button"\n    name="{{element.name}}" id="{{element.key}}"\n    ng-model="element.value[0]" ng-required="{{element.required}}"\n    ng-class="{\'has-error\':element.hasError}"\n    ng-disabled="element.disabled || element.readonly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n    ng-readonly="element.readonly">\n    <fieldset>\n        <legend class="control-label" ng-if="element.label"\n            aria-label="{{element.label}}">\n            <span ng-bind="element.label"></span> <span\n                ng-if="element.description !== \'\'"> <wf-tooltip\n                    popover-description="element.description"\n                    popover-element-id="popoverElementId"></wf-tooltip>\n            </span>\n        </legend>\n        <div class="control-field"\n            ng-class="{ \'has-error\': (element.messages.length > 0) }">\n            <div ng-repeat="option in element.options"\n                class="radio-item"\n                ng-class="{\'radio-vertical-align\' : (element.options.length <= 2)}">\n                <input type="radio" id="{{element.key}}-{{$index}}"\n                    name="{{element.key}}+radio_pick"\n                    ng-model="element.value[0]" ng-value="option.value"\n                    ng-change="$emit(\'update\')" /> <label\n                    for="{{element.key}}-{{$index}}"\n                    ng-class="{\'checked\':element.value[0] === option.value}"\n                    ng-bind="option.displayValue"></label>\n            </div>\n        </div>\n        <div class="control-error"\n            ng-class="{ \'has-error\': (element.messages.length > 0) }"\n            role="alert">\n            <div ng-if="element.messages.length > 0"\n                class="control-description control-errors">\n                <div ng-repeat="error in element.messages">\n                    <i class="icon icon-circle-delete"></i> <span\n                        class="description-body text-muted"\n                        aria-label="{{::error.text}}">{{::error.text}}</span>\n                </div>\n            </div>\n        </div>\n    </fieldset>\n</div>');
$templateCache.put('component/wf-element-page-tag/template.html','<div\n    class="wf-page-tag {{(element.classList +\' \'+ element.contentStyle)}}">\n    <p id="{{element._e.key}}"\n        aria-label="{{element._e.nodes | formatContentItem}}"\n        ng-bind-html="element._e.nodes | formatContentItem"\n        class="{{element._e.styles | beautify}}"></p>\n</div>');
$templateCache.put('component/wf-element-review/template.html','<div field class="form-group" ng-controller="ReviewElementController">\n    <div ng-bind="element.label" ng-if="element.label !== \'\'"></div>\n    <div class="error-text type type__16" ng-bind="getMessage(element.messages)" ng-if="element.hasError"></div>\n    <div class="field-value type type__16" ng-bind="getValue()" ng-if="!element.hasError"></div>\n</div>\n\n\n\n');
$templateCache.put('component/wf-element-button-link/template.html','<a target="_blank" name="{{element.name}}" id="{{element.key}}" button-link-directive ng-click="popupLink()" class="{{element.classList}} ">\n    <button type="button"  class="hsbc-link" ng-click="$emit(\'update\')" ng-bind="::caption" attr-name="buttonName"></button>\n</a>');
$templateCache.put('component/wf-element-statement-agree/template.html','<div class="form-group">\n    <div class="{{element.classList}} checkbox-group"\n        id="{{element.key}}" ng-controller="statementAgreeController"\n        ng-init="initMultiLabel(\'boolean\', element.label);">\n        <div class="checkbox">\n            <input type="checkbox" id="{{element.key}}-checkbox"\n                ng-class="{ \'has-error\': element.hasError }"\n                ng-model="statementAgreeValue" ng-true-value="true"\n                ng-false-value="false" ng-click="updateField()"\n                ng-keyup="changesValue($event)"\n                ng-disabled="element.disabled || element.readOnly"\n                ng-readonly="element.readOnly" class="digital-checkbox" />\n            <label class="checkbox-value label-text"\n                for="{{element.key}}-checkbox"><span ng-repeat="item in statementList"> <span\n                ng-bind="item.label"></span> <a ng-click="popupLink(item.linkUrl)">{{item.linkLabel}}</a></span>\n            </label>\n        </div>\n    </div>\n    <div class="control-error"\n        ng-if="element.messages.length > 0 && element.value[0] !== true"\n        ng-class="{ \'has-error\': element.hasError }" role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="error in element.messages">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    aria-label="{{::error.text}}">{{::error.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-unordered-list/template.html','<div class="unordered-list">\n    <ul type="circle">\n        <li class="type__14 {{child.classList}}" ng-repeat="child in element.children">\n            <bb-element data-key="{{child.key}}"></bb-element>\n        </li>\n    </ul>\n</div>');
$templateCache.put('component/wf-element-text/template.html','<div field class="form-group" ng-controller="TextController">\n    <label class="control-label" ng-if="element.label"\n        for="{{element.key}}" aria-label="{{element.label}}"> <span\n        ng-bind="element.label"></span> <span\n        ng-if="element.description !== \'\'"> <wf-tooltip\n                popover-description="element.description"\n                popover-element-id="popoverElementId"></wf-tooltip>\n    </span>\n    </label>\n    <div class="control-field"\n        ng-class="{ \'has-error\': (element.messages.length > 0) }">\n        <input class="form-control digitaltext" id="{{element.key}}"\n            name="{{element.name}}" type="text"\n            maxlength="{{element.maxLength = (!element.maxLength || element.maxLength === -1)? 200: element.maxLength}}"\n            ng-disabled="element.disabled"\n            ng-readonly="element.readOnly"\n            ng-class="{ \'empty\': (!element.values || element.values==\'\') }"\n            ng-blur="update()" ng-focus="update()"\n            aria-labelledby="{{element.key}}"\n            ng-model="element.value[0]" ng-required="element.required"\n            novalidate />\n    </div>\n    <div class="control-error has-error" ng-if="element.hasError"\n        role="alert">\n        <div class="control-description control-errors">\n            <div ng-repeat="massage in element.messages">\n                <i class="icon icon-circle-delete"></i> <span\n                    class="description-body text-muted"\n                    id="{{element.key}}-error_id"\n                    aria-label="{{::massage.text}}">{{::massage.text}}</span>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-form-table/template.html','<div class="bbform-contentitem" ng-controller="FormTableController">\n    <table class="table table-striped">\n        <tbody>\n            <tr ng-repeat="row in tableData.children"\n                ng-class="{\'table-header\':$first}" ng-if="noRowsFound">\n                <td ng-repeat="cell in row.children"\n                    class="{{cell.classList}}">\n                    <div ng-if=\'$parent.$index === 0\'>\n                        <label class="control-label" ng-if="cell.label"\n                            aria-label="{{cell.label}}"> <span\n                            ng-bind="cell.label"\n                            arai-label="{{cell.label}}"></span> <span\n                            ng-if="cell.description !== \'\'"> <wf-tooltip\n                                    popover-description="cell.description"\n                                    popover-element-id="cell.key"></wf-tooltip>\n                        </span>\n                        </label>\n                        <div ng-if="!cell.label">\n                            <bb-element data-key="{{child.key}}"\n                                ng-repeat="child in [cell] track by child.key"></bb-element>\n                        </div>\n                    </div>\n                    <div ng-if="$parent.$index !== 0">\n                        <div ng-if="cell.type !== \'textitem\'">\n                            <bb-element data-key="{{child.key}}"\n                                ng-repeat="child in [cell] track by child.key"></bb-element>\n                        </div>\n                        <div ng-if="cell.type === \'textitem\'">\n                            <div\n                                ng-if="cell._e.plainText.indexOf(\'||\') === -1">{{cell._e.plainText}}</div>\n                            <div\n                                ng-if="cell._e.plainText.indexOf(\'||\') > -1"\n                                ng-init="data=iterateCAll(cell._e.plainText);">\n                                <div>{{data.lable}}</div>\n                                <wf-tooltip\n                                    popover-description="data.toolTipText"\n                                    popover-element-id="cell.key"></wf-tooltip>\n                            </div>\n                            <!-- <col-data data="cell" parent-key="$index"></col-data>-->\n                        </div>\n                    </div>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <div ng-if="!noRowsFound" class="table-error">No Data Found</div>\n</div>');
$templateCache.put('component/wf-hidden-attribute/template.html','<div hidden-attribute class="checkbox checkbox-single hidden"\n    role="hidden">\n    <input type="hidden" id="{{element.key}}" name="{{element.name}}"\n        ng-model="element.value[0]" ng-true-value="\'true\'"\n        ng-false-value="\'false\'" ng-change="$emit(\'update\')"\n        ng-disabled="element.disabled || element.readOnly || (element.hasError && element.hasStyle(\'FormReadOnlyOnError\'))"\n        ng-readonly="element.readOnly" />\n</div>');
$templateCache.put('component/wf-form-primary-container/template.html','<div class="form-primary-container"\n    ng-controller="FormPrimaryContainerController as ctrFp"\n    ng-init="onLoadPrimaryContainer()">\n    <div class="row form-primary-header">\n        <div\n            class="col-xs-offset-1 col-xs-10 col-sm-offset-1 col-sm-10 col-md-offset-1 col-md-10 col-lg-offset-1 col-lg-10">\n            <div id="{{ctrFp.headerElement.key}}-Header">\n                <h1 class="type-thin"\n                    ng-if="ctrFp.headerElement.displayName"\n                    ng-bind="ctrFp.headerElement.displayName"\n                    aria-label="{{ctrFp.headerElement.displayName}}"></h1>\n            </div>\n        </div>\n    </div>\n    <div class="row" ng-if="isSystemNotification">\n        <div\n            class="col-xs-offset-1 col-xs-10 col-sm-offset-1 col-sm-10 col-md-offset-1 col-md-10 col-lg-offset-1 col-lg-10">\n            <div class="system-notification" role="alert">\n                <div class="notification-icon"></div>\n                <div class="notification-wrapper">\n                    <bb-element data-key="{{child.key}}"\n                        ng-repeat="child in ctrFp.systemNotificationElement.children track by child.key"></bb-element>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class="row"\n        ng-if="ctrFp.ODCTRedirection.children && ctrFp.ODCTRedirection.children.length > 0">\n        <div\n            class="col-xs-offset-1 col-xs-10 col-sm-offset-1 col-sm-10 col-md-offset-1 col-md-10 col-lg-offset-1 col-lg-10">\n            <div\n                class="form-notification info-notification margin-top-twenty"\n                alert="role">\n                <div class="notification-icon"></div>\n                <div class="notification-wrapper">\n                    <bb-element data-key="{{child.key}}"\n                        ng-repeat="child in ctrFp.ODCTRedirection.children track by child.key"></bb-element>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class="row page-description type-thin"\n        ng-if="ctrFp.headerElementContainer.children.length > 0">\n        <div\n            class="col-xs-offset-1 col-xs-10 col-sm-offset-1 col-sm-10 col-md-offset-1 col-md-10 col-lg-offset-1 col-lg-10">\n            <div id="{{ctrFp.headerElement.key}}">\n                <bb-element data-key="{{child.key}}"\n                    ng-repeat="child in ctrFp.headerElementContainer.children track by child.key"></bb-element>\n            </div>\n        </div>\n    </div>\n    <div class="row form-primary-content">\n        <div class="col-xs-offset-1 col-xs-10 col-md-offset-1 col-md-6">\n            <div class="form-review-notification error-notification"\n                role="alert"\n                ng-if="ctrFp.formReviewContainer.children && ctrFp.formReviewContainer.children.length > 0 && showReviewNotification">\n                <div class="notification-icon"></div>\n                <div class="error-wrapper">\n                    <bb-element data-key="{{child.key}}"\n                        ng-repeat="child in [ctrFp.formReviewNotification.children[0]] track by child.key"></bb-element>\n                    <div class="error-text"\n                        ng-repeat="notificationElement in reviewNotification"\n                        ng-if="notificationElement.error === true">\n                        <button class="hsbc-link"\n                            ng-click="ctrFp.moveToElement(notificationElement.name)">{{notificationElement.title}}</button>\n                        <div class="error-text"\n                            style="padding-left: 20px;"\n                            ng-repeat="notificationChildrenElement in notificationElement.children"\n                            ng-if="notificationChildrenElement.error === true">\n                            <button class="hsbc-link" role="link"\n                                ng-click="ctrFp.moveToElement(notificationChildrenElement.name)"\n                                aria-label="{{notificationChildrenElement.title}}">{{notificationChildrenElement.title}}</button>\n                            <div class="error-text"\n                                style="padding-left: 20px;"\n                                ng-repeat="notificationSubChildrenElement in notificationChildrenElement.children"\n                                ng-if="notificationSubChildrenElement.error === true">\n                                <button class="hsbc-link" role="link"\n                                    ng-click="ctrFp.moveToElement(notificationSubChildrenElement.name)"\n                                    aria-label="{{notificationSubChildrenElement.title}}">{{notificationSubChildrenElement.title}}</button>\n                            </div>\n                        </div>\n                    </div>\n                    <bb-element data-key="{{child.key}}"\n                        ng-repeat="child in [ctrFp.formReviewNotification.children[1]] track by child.key"></bb-element>\n                </div>\n            </div>\n            <div class="form-secondary-left-container"\n                ng-if="ctrFp.formSecondaryLeftContainer.children.length > 0">\n                <div class="error-text margin-fix">\n                    <bb-element data-key="{{child.key}}"\n                        ng-repeat="child in ctrFp.incorrectAttempts.children track by child.key"></bb-element>\n                </div>\n                <bb-element data-key="{{child.key}}"\n                    ng-repeat="child in [ctrFp.notificationElementContainer] track by child.key"></bb-element>\n                <h3 ng-if="ctrFp.formSecondaryContainer.displayName"\n                    ng-bind="ctrFp.formSecondaryContainer.displayName"\n                    aria-label="{{ctrFp.formSecondaryContainer.displayName}}"></h3>\n                <bb-element data-key="{{child.key}}"\n                    ng-repeat="child in ctrFp.formSecondaryLeftContainer.children track by child.key"></bb-element>\n            </div>\n            <div class="form-review-container"\n                ng-if="ctrFp.formReviewContainer.children.length > 0">\n                <bb-element data-key="{{child.key}}"\n                    ng-repeat="child in ctrFp.formReviewContainer.children track by child.key"></bb-element>\n            </div>\n        </div>\n        <div class="col-xs-offset-1 col-xs-10 col-md-offset-1 col-md-3"\n            ng-if="ctrFp.formSecondaryRightContainer.children.length > 0">\n            <div class="form-secondary-right-container">\n                <bb-element data-key="{{child.key}}"\n                    ng-repeat="child in ctrFp.formSecondaryRightContainer.children track by child.key"></bb-element>\n            </div>\n        </div>\n        <div class="col-xs-12 form-controle-links"\n            ng-if="ctrFp.formControleLinks.children.length > 0">\n            <div class="row">\n                <div\n                    class="col-xs-offset-1 col-xs-11 col-sm-offset-1 col-sm-11 col-md-offset-1 col-md-11 col-lg-offset-1 col-lg-11">\n                    <bb-element data-key="{{child.key}}"\n                        ng-repeat="child in ctrFp.formControleLinks.children track by child.key"></bb-element>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-element-setlanguage/template.html','<div role="hidden" ng-controller="SetlanguageController"\n    ng-init="updateOnInit()">\n    <input type="" id="{{element.key}}" name="{{element.name}}"\n        ng-model="element.value[0]" ng-change="$emit(\'update\')" />\n</div>');
$templateCache.put('component/wf-onboarding-profile-table/template.html','<div class="bbform-contentitem" ng-controller="TableController"\n    ng-init="sortByInitial(\'LastSavedMyHSBCProfile\')">\n    <table class="table table-striped hsbc-profile-table">\n        <tbody>\n            <tr class="table-header">\n                <td\n                    ng-repeat="(tableHeaserKey, tableHeaserData) in tableHeader">\n                    <span ng-click="sortBy(tableHeaserKey)"\n                    ng-bind="tableHeaserData"\n                    aria-label="{{tableHeaserData}}"></span>\n                </td>\n            </tr>\n            <tr\n                ng-repeat="tableRow in tableRows | orderBy:propertyName:reverse">\n                <td ng-repeat="tableCol in tableRow">\n                    <div ng-if="tableCol.children">\n                        <bb-element data-key="{{child.key}}"\n                            ng-repeat="child in tableCol.children track by child.key"></bb-element>\n                    </div>\n                    <div ng-if="!tableCol.children">\n                        <col-data data="tableCol" parent-key="$index"></col-data>\n                    </div>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n</div>');
$templateCache.put('component/wf-landing-page-container/template.html','<div class="landing-page wf-landing-page-container"\n    ng-controller="LandingPageContainerController"\n    ng-init="onLoadPrimaryContainer()">\n    <div data-ng-repeat="element in elementChildren">\n        <div ng-if="element.classList == \'form-primary-header\'">\n            <div class="odct-component-page-header">\n                <div class="row">\n                    <div\n                        class="col-xs-offset-1 col-xs-10 col-sm-offset-1 col-sm-10 col-md-offset-1 col-md-10 col-lg-offset-1 col-lg-10">\n                        <h2 ng-bind="element._e.displayName"></h2>\n                        <p>\n                            <bb-element data-key="{{child.key}}"\n                                ng-repeat="child in element.children track by child.key"></bb-element>\n                        </p>\n                    </div>\n                    <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1"></div>\n                </div>\n            </div>\n        </div>\n        <div\n            ng-if="element.classList == \'system-notification\' && isSystemNotification">\n            <div class="row">\n                <div\n                    class="col-xs-offset-1 col-xs-10 col-sm-offset-1 col-sm-10 col-md-offset-1 col-md-10 col-lg-offset-1 col-lg-10">\n                    <div class="system-notification" role="alert">\n                        <div class="notification-icon"></div>\n                        <div class="notification-wrapper">\n                            <bb-element data-key="{{child.key}}"\n                                ng-repeat="child in element.children track by child.key"></bb-element>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="row"\n            ng-if="element.classList == \'form-notification\'">\n            <div\n                class="col-xs-offset-1 col-xs-10 col-sm-offset-1 col-sm-10 col-md-offset-1 col-md-10 col-lg-offset-1 col-lg-10">\n                <div\n                    class="form-notification info-notification margin-top-twenty"\n                    role="alert">\n                    <div class="notification-icon"></div>\n                    <div class="notification-wrapper">\n                        <bb-element data-key="{{child.key}}"\n                            ng-repeat="child in element.children track by child.key"></bb-element>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class="landing-page-content"\n            ng-if="element.classList === \'form-secondary-container\'">\n            <div class="row">\n                <div class="col-xs-offset-1 col-xs-10">\n                    <div class="clearfix">\n                        <div class="row clearfix"\n                            ng-if="element.children.length === 3">\n                            <h2 class="type__28 text-center type-thin"\n                                data-ng-bind="element._e.displayName"></h2>\n                            <div class="col-md-4 landing-page-col"\n                                ng-class="{\'first-child\':$first}"\n                                ng-repeat="child in element.children track by child.key">\n                                <div class="odct-component-circle">\n                                    <i class="icon {{child.classList}}"></i>\n                                </div>\n                                <bb-element data-key="{{child.key}}"></bb-element>\n                            </div>\n                        </div>\n                        <div class="row clearfix"\n                            ng-if="element.children.length === 2">\n                            <h2 class="type__28 text-center type-thin"\n                                data-ng-bind="element._e.displayName"></h2>\n                            <div class="row">\n                                <div\n                                    ng-class="($first) ? \'col-xs-offset-1 col-xs-10 col-sm-offset-1 col-sm-5 col-md-offset-2 col-md-4 col-lg-offset-3 col-lg-3\' : \'col-xs-offset-1 col-xs-10 col-sm-offset-0 col-sm-5 col-md-4 col-lg-3\'"\n                                    class="landing-page-button"\n                                    ng-repeat="child in element.children track by child.key">\n                                    <bb-element data-key="{{child.key}}"></bb-element>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div ng-if="element.isButton" class="hidden">\n            <bb-element data-key="{{child.key}}"\n                ng-repeat="child in [element] track by child.key"></bb-element>\n        </div>\n    </div>\n</div>');
$templateCache.put('component/wf-ordered-list/template.html','<div class="ordered-list">\n    <ol type="1">\n        <li class="type__16" ng-repeat="child in element.children">{{child._e.plainText}}</li>\n    </ol>\n</div>');}]);

	//forms angular module name
	return 'forms-ui';
}));