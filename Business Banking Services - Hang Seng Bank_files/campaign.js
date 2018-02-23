jQuery.noConflict();

(function($) {

  /*------------- selection dropdown ------------------*/
	// var config = {
	//     '.chosen-select'           : {max_selected_options: 5},
	//     '.chosen-select-deselect'  : {allow_single_deselect:true},
	//     '.chosen-select-width'     : {width:"100%"},'.chosen-select-deselect'  : {allow_single_deselect:true},
 //        '.chosen-select-no-results': {no_results_text:'Please select an option!'}
	// }
	// for (var selector in config) {
	//     $(selector).chosen(config[selector]);
	// }
	
	// if ($('.chosen-container').length > 0) {
 //      $('.chosen-container').on('touchstart', function(e){
 //        e.stopPropagation(); e.preventDefault();
 //        // Trigger the mousedown event.
 //        $(this).trigger('mousedown');
 //      });
 //    }
  
  $(".js-example-basic-multiple").select2();
  $(".js-example-basic-single").select2();
  /*------------- selection dropdown END------------------*/


  /*------------- text field Alphabets only ------------------*/
  $("#inputTextBox").keypress(function(event){
    var inputValue = event.charCode;
    if(!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0)){
        event.preventDefault();
    }
  });
  /*------------- text field Alphabets only END------------------*/

  var inputQuantity = [];
  $(function() {
    $(".quantity").each(function(i) {
      inputQuantity[i]=this.defaultValue;
       $(this).data("idx",i); // save this field's index to access later
    });
    $(".quantity").on("keyup", function (e) {
      var $field = $(this),
          val=this.value,
          $thisIndex=parseInt($field.data("idx"),10); // retrieve the index
//        window.console && console.log($field.is(":invalid"));
        //  $field.is(":invalid") is for Safari, it must be the last to not error in IE8
      if (this.validity && this.validity.badInput || isNaN(val) || $field.is(":invalid") ) {
          this.value = inputQuantity[$thisIndex];
          return;
      } 
      if (val.length > Number($field.attr("maxlength"))) {
        val=val.slice(0, 2);
        $field.val(val);
      }
      inputQuantity[$thisIndex]=val;
    });      
  });

  /*------------- loan calculator show hide ------------------*/
  $("#calculate-result").hide();
  $("#monthly-flat-rate-instalment-loan .hasebz_disclaimer").hide();
  $("#calculate-result2").hide();
  $("#show-result").click(function(){
      $("#calculate-result").fadeIn(1000);
      $(".form-group1").fadeOut(500);
    $(".hasebz_disclaimer").show();
  });
  $("#show-result2").click(function(){
      $("#calculate-result2").fadeIn(1000);
      $(".form-group1").fadeOut(500);
    $(".hasebz_disclaimer").show();
  });

  /*------------- loan calculator show hide END------------------*/


  // function onlyAlphabets(e, t) {
  //     try {
  //         if (window.event) {
  //             var charCode = window.event.keyCode;
  //         }
  //         else if (e) {
  //             var charCode = e.which;
  //         }
  //         else { return true; }
  //         if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
  //             return true;
  //         else
  //             return false;
  //     }
  //     catch (err) {
  //         alert(err.Description);
  //     }
  // }

})(jQuery);	

