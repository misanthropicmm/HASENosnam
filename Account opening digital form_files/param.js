/**
 * Input helpers.
 * @module input
 */
define(function(require, exports, module) {
    'use strict';
    var base = require('base');
    var lpCoreUtils = base.inject('lpCoreUtils', require('core').name);
    exports.getParam = function(id) {
        return JSON.parse(window.sessionStorage.getItem( id));
    };

    /**
     * get exist data's key from  sessionStorage
     * @param{String} paramDataStr paramData
     * @returns {undefined} data's key
     */
    var getParamKey = function(paramDataStr){
        var sessionStorage = window.sessionStorage;
        var paramLenth = sessionStorage.length;
        for(var i =0;i<paramLenth;i++){
            var key =  sessionStorage.key(i);
            if(paramDataStr === sessionStorage.getItem(key)){
               return key;
            }
        }
        return undefined;
    };
    /**
     * set lpCoreUtilsparam
     * @param {element} paramData param  data
     * @return {element} the param id
     */
    exports.setParam = function(paramData) {
        var paramString = JSON.stringify(paramData);
        var sessionStorage = window.sessionStorage;
        var id = getParamKey(paramString);
        if('undefined' === typeof(id)){
            id = lpCoreUtils.generateUUID();
            sessionStorage.setItem(id, paramString);
        }

        return id;
    };

    /**
     * get param key from URL
     * @param  url url
     * @param paramName param key name
     * @returns {null} param key
     */
    exports.getUrlParamKey = function(url,paramName){
        var reg = new RegExp('(^|&)'+ paramName +'=([^&]*)(&|$)');
        var r = url.substr(1).match(reg);
        var context = '';
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == '' || context == 'undefined' ? '' : context;
    };

    /**
     * get param data from url param key
     * @param paramName
     */
    exports.getParamFromUrl = function(paramName,url){
        var url = url || window.location.search;
        var paramKey = this.getUrlParamKey(url,paramName);
        return this.getParam(paramKey);
    };


});
