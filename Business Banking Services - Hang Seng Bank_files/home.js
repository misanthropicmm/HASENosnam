(function( $ ) {
  var windowWidth = $(window).width(),
      windowHeight = $(window).height();

  var resizeMainWindow = function(e){
      var windowWidthNew = jQuery(window).width();
      var windowHeightNew = jQuery(window).height();
      if(windowWidth != windowWidthNew || windowHeight != windowHeightNew){
          windowWidth = windowWidthNew;
          windowHeight = windowHeightNew;
          if(winwidth >= 768 && winwidth <= 1024) {
            $('.hasebz_aditional_block .item').css('height', 'auto');
            $('.hasebz_aditional_block .links').css('height', 'auto');
            setTimeout(function(){
              $('.hasebz_aditional_block .item').setAllToMaxHeight();
              $('.hasebz_aditional_block .links').setAllToMaxHeight();
            },500);
          }
      }
  };


  jQuery(document).ready(function($){
    // Main slider
     initmainSlider();
     
     if(winwidth >= 768 && winwidth <= 1024) {
      $('.hasebz_aditional_block .item').css('height', 'auto');
      $('.hasebz_aditional_block .links').css('height', 'auto');
      $('.hasebz_aditional_block .item').setAllToMaxHeight();
      $('.hasebz_aditional_block .links').setAllToMaxHeight();
    }

  });

  $(window).bind('resize', resizeMainWindow);

})(jQuery);