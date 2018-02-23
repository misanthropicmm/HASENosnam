define(function(require, exports, module) {
    'use strict';

    /**
     * send web tag.
     *
     * @param {tag} tag
     */
    exports.tagging = function( tag ){
        var utag = window.utag;
        if(utag){
            utag.view({
                page_ad_click : tag,
                customer_id : $.cookie('eID') ? $.cookie('eID') : ''
            });
        }
    };
});
