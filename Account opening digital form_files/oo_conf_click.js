/*
OnlineOpinion v5.9.9
Released: 08/02/2016. Compiled 08/02/2016 02:01:40 PM -0500
Branch: master 2a8b05f36a87035a4e8fac9b85c18815b63da4e3
Components: Full
UMD: disabled
The following code is Copyright 1998-2016 Opinionlab, Inc. All rights reserved. Unauthorized use is prohibited. This product and other products of OpinionLab, Inc. are protected by U.S. Patent No. 6606581, 6421724, 6785717 B1 and other patents pending. http://www.opinionlab.com
*/

/* global window, OOo */

/*
Click Event configuration
**************************
Object is now being instantiated against the OOo object (1 global class)
To call this object, place the below in the click event
OOo.oo_onSingleClick(event, 'oo_click')
*/
var o = OOo;

o.oo_click = new o.Ocode({
    events: {
        onSingleClick: 100
    },
    cookie: {
        name: 'oo_click',
        type: 'domain',
        expiration: 2592000
    },
    referrerRewrite: {
        searchPattern: /:\/\/[^\/]*/,
        replacePattern: '://ws4.business.hsbc.com.hk'
    },
    customVariables: {
        s_vi: o.readCookie('s_vi')
    }
});

o.oo_onSingleClick = function(e, feedback) {
    //var evt = e || window.event;
    //o[feedback].show(evt, 'onSingleClick');
};

