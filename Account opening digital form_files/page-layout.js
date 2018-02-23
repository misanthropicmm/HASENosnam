/* global b$ */
(function () {
    'use strict';

    var Container = b$.bdom.getNamespace('http://backbase.com/2013/portalView').getClass('container');

	var showMenu = false;
	window.toggleLeftMenu = function() {
		if(showMenu) {
			document.getElementById('hsbc-odct-left-container').style.width = '0';
			document.getElementById('hsbc-odct-right-container').style.marginLeft= '0';
			showMenu = false;
		} else {
			document.getElementById('hsbc-odct-left-container').style.width = '250px';
			document.getElementById('hsbc-odct-right-container').style.marginLeft = '250px';
			showMenu = true;
		}
	}

	window.taggingEvent = function(utagData) {
        var real_utag = window.utag;
        if(real_utag){
            TMS.trackView(utagData);
            TMS.trackEvent('link', utagData);
        }
    }

    window.opinionLab = function(){
        OOo.oo_onSingleClick(event, 'oo_click');
    }
 
    Container.extend(function() {
        Container.apply(this, arguments);
        this.isPossibleDragTarget = true;
    }, {
        localName: 'hsbcTemplateOnboarding',
        namespaceURI: 'templates_hsbcTemplateOnboarding'
    }, {
        template: function(json) {
            var data = {item: json.model.originalItem};
            return window[this.namespaceURI][this.localName](data);
        },
        handlers: {
            DOMReady: function(){
                //add code, DOM ready

            },
            preferencesSaved: function(event){
                if(event.target === this) {
                    this.refreshHTML(function(item){
                        //add code, HTML refreshed
                    });
                }
            }
        }
    });
})();
