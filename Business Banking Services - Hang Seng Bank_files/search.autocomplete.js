 jQuery(function() {
	jQuery("#searchStringTop").autocomplete({
        source: function(request, response) {
            jQuery.ajax({
                url: '/1/PA_1_1_P1/D2G_GetSearchResultXML_gif',
                dataType: "json",
                data: {
	        		'action': 'suggest',
	    			'searchString': request.term,
	    			'scope': jQuery('#scope option:selected').val(),
	    			'outputFormat': 'json',
					'perventCache': jQuery.now()
	    		},
          		success: function(data) {
          			if (!jQuery.isEmptyObject(data.results)) {
          				var autoComResult = data.results;
	                    var nameArray = [];
	                    jQuery.each(autoComResult, function(i, n) {
	                    	if (i < 8)
                    			nameArray[i] = n.name;
	                 	});
	                    response(nameArray);
          			}
      			}
            });
        },
		select: function(event, ui) {			
			jQuery(this).val(ui.item.value);
			jQuery('#searchStringTop').blur();
		    document.getElementById('btnSearchTop').click();				
		},
        minLength: 1
    });
    
    jQuery('body').on('keypress', '#searchStringTop', function(e) {
		if (e.which == 13) {
			jQuery('#searchStringTop').blur();
			document.getElementById('btnSearchTop').click();
	    }
	});
});
   
		
  