/**
 * General Error helpers.
 * @module error
 */
define(function(require, exports, module) {
    'use strict';

    /**
    * @const define Error code
    */
    var ERRORCODE_TO_KEY = {

        0  : 'GBB_W009',

		400: 'GBB_W002',
		401: 'GBB_W003',
		403: 'GBB_W004',
		404: 'GBB_W005',
		405: 'GBB_W006',
		406: 'GBB_W007',
		408: 'GBB_W008',

		500: 'GBB_W001'
    };

    /**
     * transfer errorcode to NLS key.
     *
     * @param {Error} error
     */
    exports.getErrorCode = function( err ){

        if( err.data.errorCode ){ return err.data.errorCode; }

		if( ERRORCODE_TO_KEY[err.status] ){
			return ERRORCODE_TO_KEY[err.status];
		} else if( err.status > 500 ){
			return ERRORCODE_TO_KEY[500];
		}

		return ERRORCODE_TO_KEY[0];
    };

	/**
     * get Error type
     * FIXME:TO BE REASON_CODE
     * @param {Error} error
     */
	exports.getErrorType = function( err ){
        // adjust the error for incomingfund fullpage process, error: no data
        if(err.data
		&& err.data.errorCode
		&& err.data.errorCode === 'GBB_M012'){ return 1000; }
        // adjust the error for incomingfund fullpage deposited, error: no data
        if(err.data
        && err.data.errorCode
        && err.data.errorCode === 'BRC_316'){ return 1000; }

        if( err.data
		&& err.data.errorCode
		&& err.data.errorCode.indexOf('BRC') > -1 ){ return 1; }
		return 0;
	};
});
