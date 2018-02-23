jQuery.noConflict();

var isDevices = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    winwidth = window.innerWidth || document.documentElement.clientWidth,
    winheight = window.innerHeight || document.documentElement.clientHeight,
    tablet = 992,
    mobile = 991,
    slider,
    mainSilder = [],
    slideitem = 1,
    slidew = winwidth,
    slidem = 0,
    slideroffer,
    sliderofferitem = 0,
    searchwrapper = jQuery('.hasebz_search_wrap'),
    header = jQuery('#hasebz_header'),
    navdropdown = jQuery('.navbar-nav>li.dropdown'),
    servicegrid = jQuery('.hasebz_services .dropdown-toggle'),
    urlservice;

(function($) {

    function getInternetExplorerVersion() {
        var rv = -1;
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        } else if (navigator.appName == 'Netscape') {
            var ua = navigator.userAgent;
            var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    }

    jQuery.uaMatch = function(ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            /(trident)[\/]([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    };

    matched = jQuery.uaMatch(navigator.userAgent);
    browser = {};

    if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = matched.version;
    }

    // Chrome is Webkit, but Webkit is also Safari.
    if (browser.chrome) {
        browser.webkit = true;
    } else if (browser.webkit) {
        browser.safari = true;
    }

    jQuery.browser = browser;

    $.fn.setAllToMaxHeight = function() {
        return this.height(Math.max.apply(this, $.map(this, function(e) {
            return $(e).height()
        })));
    }

    ie8 = $('.ie8');

    // Main slider
    var that = this;

    that.initmainSlider = function() {

        if ($('.hasebz_main_slider .bxslider li').length <= 1) {
            var el = $('#bx-pager li');
            el.parents('.hasebz_main_slider').addClass('inline');
            el.find('a').addClass('active');
        } else {
            if ($('#bx-pager li').length > 1) {

                var item = $('#bx-pager li').length;
                 $('#bx-pager').addClass('hasebz_page_'+ item);
                $('.hasebz_main_slider .bxslider').each(function(i) {
                    var el = $(this),
                        parent = el.parent();
                    slider = new Array(),
                        sliderpage = parent.find('#bx-pager'),
                        sliderprev = parent.find('a.pager-prev'),
                        slidernext = parent.find('a.pager-next');


                    slider[i] = el.bxSlider({
                        auto: true,
                        pagerCustom: sliderpage,
                        pager: true,
                        pause: 8000,
                        onSlideAfter: function(e) {
                            el.startAuto();
                        }
                    });
                    sliderprev.click(function() {
                        var current = slider[i].getCurrentSlide();
                        slider[i].goToPrevSlide(current) - 1;
                    });
                    slidernext.click(function() {
                        var current = slider[i].getCurrentSlide();
                        slider[i].goToNextSlide(current) + 1;
                    });
                });

                // slider = $('.hasebz_main_slider .bxslider').bxSlider({
                //     auto: true,
                //     pagerCustom: '#bx-pager',
                //     pager: true,
                //     pause: 8000,
                //     onSlideAfter: function() {
                //         slider.startAuto();
                //     }
                // });
                // $('.hasebz_main_slide a.pager-prev').click(function() {
                //     var current = slider.getCurrentSlide();
                //     slider.goToPrevSlide(current) - 1;
                // });
                // $('.hasebz_main_slide a.pager-next').click(function() {
                //     var current = slider.getCurrentSlide();
                //     slider.goToNextSlide(current) + 1;
                // });
            }
            if ($('.hasebz_bxslider li').length >= 2) {
                $('.hasebz_main_slider .bxslider').each(function(i) {
                    var el = $(this),
                        parent = el.parent();
                    slider = new Array(),
                    slider[i] = el.bxSlider({
                        auto: true,
                        pager: true,
                        pause: 8000,
                        onSlideAfter: function(e) {
                            el.startAuto();
                        }
                    });
                    sliderprev.click(function() {
                        var current = slider[i].getCurrentSlide();
                        slider[i].goToPrevSlide(current) - 1;
                    });
                    slidernext.click(function() {
                        var current = slider[i].getCurrentSlide();
                        slider[i].goToNextSlide(current) + 1;
                    });
                });
            }
        }
    }

    // Offers slider
    that.initSlider = function() {
        var startAuto = true,
            pager = true,
            infiniteLoop = true,
            offeritem = $('.hasebz_offers_slider .bxslider li');

        if ($(ie8).length > 0) slideitem = 2;

        if (offeritem.length <= 2) {
            if (winwidth >= tablet) {
                startAuto = false;
                pager = false;
                infiniteLoop = false;
            }
        }

        if (winwidth >= tablet) {
            if (offeritem.length > 2) {
                slideroffer = $('.hasebz_offers_slider .bxslider').bxSlider({
                    auto: true,
                    slideWidth: 600,
                    minSlides: 2,
                    maxSlides: 2,
                    pause: 10000,
                    slideMargin: 15,
                    infiniteLoop: infiniteLoop,
                    pager: pager,
                    onSlideAfter: function() {
                        if (startAuto) {
                            slideroffer.startAuto();
                        }

                    }
                });
            } else {
                offeritem.parents('.hasebz_offers_slider').addClass('distroy');
            }
        } else {
            offeritem.parents('.hasebz_offers_slider').removeClass('distroy');
            slideroffer = $('.hasebz_offers_slider .bxslider').bxSlider({
                auto: true,
                pause: 10000,
                infiniteLoop: infiniteLoop,
                pager: pager,
                onSlideAfter: function() {
                    if (startAuto) {
                        slideroffer.startAuto();
                    }

                }
            });
        }


    };
    // Nav
    // Nav
    // that.togglenav = function() {
    //      var navtoggle = $('.navbar-nav li.dropdown'),
    //          dropdown = navtoggle.find('.dropdown-menu.first');
             
    //             navtoggle.on('mouseover', function () {
    //                 var el = $(this);
    //                 if(winwidth <= 799) {
    //                     el.addClass('open');
    //                 }
    //                 // alert(1);
    //             });
    //             navtoggle.on('mouseleave', function () {
    //                 var el = $(this);
    //                 // el.removeClass('open');
    //                 if(winwidth <= 799) {
    //                     el.removeClass('open');
    //                 }
    //                 // alert(2);
    //             }); 
    //          // }
    // }
    that.navbarexpand = function() {
            var url,
                secondnav = $('.hasebz_sub_title'),
                navtoggle = $('.navbar-nav li.dropdown'),
                datatoggle = $('#navbar-collapse .dropdown'),
                bodyWidth = $('body').innerWidth();
            if (bodyWidth <= mobile) {
                $('.navbar').on('click', '.navbar-toggle', function(e) {
                    $(this).parents('.navbar').find('.navbar-collapse').addClass('open');
                    // alert(1)
                    // searchwrapper.addClass('open');

                    setTimeout(function() {
                        header.addClass('visible');
                    });
                    setTimeout(function() {
                        header.addClass('animation');
                    }, 300);
                     setTimeout( function () {
                        $('body').addClass('fixed');
                    },1000);
                });
                $('.show-search').on('click', function(e) {
                    searchwrapper.removeClass('hidden');
                    searchwrapper.addClass('open');
                     setTimeout( function () {
                        $('body').addClass('fixed');
                    }, 1000);
                    // $('.hasebz_green_nav').hide();
                });

                $('.icon-close').on('click', function() {
                    if ($(this).parents('.open').length > 0) {
                        // if($(this).parents('.hasebz_search_wrap').length = 0) {
                        //     $('body').removeClass('fixed');
                        // }
                        $(this).parents('.open').removeClass('open');

                        if ($(this).parents('.hasebz_search_wrap').length == 0) {
                            header.removeClass('animation');
                            $('body').removeClass('fixed');
                            setTimeout(function() {
                                header.removeClass('visible');
                            }, 800);
                        }
                    }
                });
                // -- Change url on NAV when responsive
                // secondnav.each(function() {
                //     var el = $(this);
                //     url = el.data('url');
                //     el.attr('href', url);
                // });
            } else {
                // if(datatoggle.hasClass('open')) {
                //     datatoggle.removeClass('open');
                // }
                $(document).on('touchstart', function(e) {

                    var container = $('[data-hover] .dropdown');
                    if (!container.is(e.target) // if the target of the click isn't the container...
                        && container.has(e.target).length === 0) // ... nor a descendant of the container
                    {
                        container.removeClass('open');
                        container.find('dropdown-menu').hide;
                    }
                });

                // hover child dropdow

                // $('.hasebz_sub_nav.dropdown').hover(function(e) {
                //     var $t = $(this);
                //     if ($t.hasClass('show')) return;
                //     var $m = $t.parent().children();
                //     $m.removeClass('show');
                //     $t.addClass('show');
                //     initHeightDropDown($t);
                // }, function(e) {
                //     return true;
                // });

                // $('body').on('mouseover', '.hasebz_sub_nav', function() {
                //     $('.hasebz_sub_nav').removeClass('active');
                // });
                // $('html').on('mouseleave', '.dropdownhover-bottom.first', function() {
                //     $('.hasebz_sub_nav').removeClass('show');
                //     $('.hasebz_sub_nav:first-child').addClass('show');
                //     var el = $(this);
                //     setTimeout(function() {
                //         el.height(0);
                //     }, 350);
                // });

            }
            $('.hasebz_sub_nav.dropdown').hover(function(e) {
                var $t = $(this);
                if ($t.hasClass('show')) return;
                var $m = $t.parent().children();
                $m.removeClass('show');
                $t.addClass('show');
                initHeightDropDown($t);
            }, function(e) {
                return true;
            });

            $('body').on('mouseover', '.hasebz_sub_nav', function() {
                $('.hasebz_sub_nav').removeClass('active');
            });
            $('html').on('mouseleave', '.dropdownhover-bottom.first', function() {
                $('.hasebz_sub_nav').removeClass('show');
                $('.hasebz_sub_nav:first-child').addClass('show');
                var el = $(this);
                // setTimeout(function() {
                //     el.height(0);
                // }, 350);
            });
            if(isDevices || windowWidth <= 991) {
                // $('.dropdown-menu').addClass('collapse')
                var hasesubtitle = $('.hasebz_sub_title');
                hasesubtitle.each(function (e) {
                    var el= $(this),
                        datasuburl= el.attr('href'),
                        subdropdown = el.parent().find('.dropdown-menu'),
                        datahref = el.data('href');
                        if(datahref === undefined) {
                            el.attr('data-href',datasuburl);
                            el.attr('href','javascript:;');
                            datahref = el.data('href')
                        } else { return; }
                        
                     el.on('touchstart', function (e) {
                        if(winwidth >= tablet && subdropdown.is(':visible')) {
                           window.location.href = datasuburl;
                        } else if(winwidth <= mobile) {
                            window.location.href = datasuburl;
                        }
                    })

                });

                var userAgent = navigator.userAgent || navigator.vendor || window.opera;
                var device = userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i );
                var eventTouch = device ? 'touchstart' : 'touchend';
                var navBar = $('#navbar-collapse').find('.dropdown'),
                    menu = $('.navbar-nav').find('.dropdown'),
                    logon = $('.hasebz_login_wrap a'),
                    logonParent = logon.parent();

                    navBar.unbind(eventTouch);
                    logon.unbind(eventTouch);
                if(isDevices){
                  if(windowWidth <= mobile) {
                    menu.off('hover').on(eventTouch, function(e) {

                      var el = $(this);
                      var timer = null;
                      if(el.is(menu)) {
                          setTimeout(function(){
                              logonParent.removeClass('open');
                              el.toggleClass('open').siblings().removeClass('open');
                          },300);
                          
                      }
                      // if(el.is(logon)) {
                      //     menu.removeClass('open');
                      //     el.parent().toggleClass('open');
                      // }
                    });
                    logon.off('hover').on(eventTouch, function(e) {
                      var el = $(this);
                      menu.removeClass('open');
                      el.parent().toggleClass('open');
                      
                    });
                  }
                }
                else if(!isDevices) {
                    menu.off('hover').on('click', function(e) {
                    e.stopPropagation();
                    //var el = $(this);
                    //var timer = null;
                    //if(el.is(menu)) {
                      if($(logonParent).hasClass("open")) {
                         $(logonParent).removeClass("open");
                      }
                      if($(this).hasClass("open")) {
                         $(this).removeClass("open");
                      }
                      else{
                        $(this).addClass('open').siblings().removeClass('open');
                      }
                        
                    //}
                    // if(el.is(logon)) {
                    //     menu.removeClass('open');
                    //     el.parent().toggleClass('open');
                    // }
                  });
                  logon.off('hover').on('click', function(e) {
                    var el = $(this);
                    menu.removeClass('open');
                    el.parent().toggleClass('open');
                  });
                }
                if(windowWidth >= tablet) {
                    $('.hasebz_login_wrap a').off('hover').on(eventTouch, function () {
                        var el = $(this);
                        var parent = el.parent();
                            if (!parent.hasClass('open')) {
                                parent.addClass('open');
                            } else {
                                parent.removeClass('open');
                            }
                    }); 
                }
            }
        } // end Nav

    that.initHeightDropDown = function(menu) {
        var dropMenu = menu.find('.dropdown-menu'),
            dropMenuHeight = $(dropMenu).outerHeight(),
            menuHeight = menu.outerHeight(),
            quicklink = menu.parent().next('.quick-link'),
            quiclinkHeight = $(quicklink).outerHeight(),
            mainMenu = menu.parent().parent();
        var totalHeight = dropMenuHeight + menuHeight;
        if (totalHeight > quiclinkHeight) {
            mainMenu.height(totalHeight);
        } else {
            mainMenu.height(quiclinkHeight);
        }
    }

    that.changeurlservice = function(e) {
        servicegrid.on('click', function() {
            var el = $(this);
            if (winwidth > 1024) {
                urlservice = el.data('url');
                window.location.href = urlservice;
            } else {
                window.location.href = "javascript:;";
            }
        })
    }

    that.showhideitems = function () {
        var maxitem = 6,
            showwrapper = $('[data-show-hide]'),
            item =  showwrapper.find('.col-md-4'),
            viewbutton = showwrapper.find('.hasebz_center_group'),
            buttonexand = viewbutton.find('.collapsed');
        if(item.length > maxitem) {
            for(var i = item.length; i > maxitem-1 ; i--) {
                item.eq(i).addClass('hasebz_hiddenitem');
            }
        } else {
            viewbutton.addClass('hidden');
        }
        buttonexand.on('click', function() {
            var that = this,
            parents = $(that).parents('[data-show-hide]'),
            hiddenitem = $(parents).find('.hasebz_hiddenitem');

            if(hiddenitem.is(":visible") == true) {
                hiddenitem.animate({
                    height: 'hide',
                    opacity: 'hide'
                }, 350);
            } else {
                hiddenitem.animate({
                    height: 'show',
                    opacity: 'show'
                }, 350);
            }
            $(parents).find('.hidden').removeClass('hidden');
            $(that).addClass('hidden');
            $(parents).toggleClass('on');

        });
    }

    that.subnavwidth = function function_name(argument) {
        navdropdown.each(function() {
            var el = $(this),
                navwrapwidth = el.find('.hasebz_sub_nav_wrap').outerWidth();

            if (el.find('.quick-link').length > 0) {
                navwrapwidth += el.find('.quick-link').outerWidth();
            }

            if ($('html').hasClass('ie11')) {
                navwrapwidth = el.find('.hasebz_sub_nav_wrap').width();
                if (el.find('.quick-link').length > 0) {
                    navwrapwidth += el.find('.quick-link').width();
                }
            }

            el.find('.dropdown-menu.first').css('width', navwrapwidth);
        })

    }



    var $window = $(window),
        windowWidth = $window.width(),
        windowHeight = $window.height();

    var resizeWindow = function(e) {
        var windowWidthNew = $window.width(),
            windowHeightNew = $window.height();
        if (windowWidth != windowWidthNew || windowHeight != windowHeightNew) {
            windowWidth = windowWidthNew;
            windowHeight = windowHeightNew;
            winwidth = windowWidthNew;
            winheight = windowHeightNew;
            if ($(ie8).length == 0) {
                if (windowWidth <= mobile) {
                    if (searchwrapper.hasClass('open') === false) {
                        searchwrapper.addClass('hidden');
                    } else {
                        searchwrapper.removeClass('hidden');
                    }
                    // alert(1);
                    // togglenav();
                    navbarexpand();
                    
                    // Offer silder init
                    if (slideroffer && $.isFunction(slideroffer.destroySlider)) {
                        setTimeout(function() {
                            slideroffer.destroySlider();
                        }, 300);
                        setTimeout(function() {
                            initSlider();
                        }, 300);
                    } else {
                        initSlider();
                    }
                } else {
                    navbarexpand();
                    subnavwidth();
                    searchwrapper.removeClass('hidden');
                    searchwrapper.removeClass('open');
                    $('body').removeClass('fixed');
                    header.removeClass('animation visible');
                    $('#hasebz_redirect').modal('hide');

                    // Offer silder init
                    if (slideroffer && $.isFunction(slideroffer.destroySlider)) {
                        setTimeout(function() {
                            slideroffer.destroySlider();
                        }, 300);
                        setTimeout(function() {
                            initSlider();
                        }, 300);
                    } else {
                        initSlider();
                    }
                    
                }
            }

            // Service
            changeurlservice();
        }
    }
    $(window).bind('resize', resizeWindow);

    jQuery(document).ready(function() {
        if ($.browser.msie) {
            if (parseInt($.browser.version) >= 10) {
                $('html').addClass('ie ie10');
            } else if (parseInt($.browser.version) == 9) {
                $('html').addClass('ie ie9');
            } else if (parseInt($.browser.version) <= 8) {
                $('html').addClass('ie ie8');
            }
        } else if ($.browser.trident) {
            var i = 'ie' + getInternetExplorerVersion();
            $('html').addClass('ie ' + i);
        }
        if (browser.safari) $('html').addClass('safari');
        if (isDevices) $('html').addClass('devices');


        windowWidth = $(window).width();
        windowHeight = $(window).height();

        // Remove placeholder
        var field = $('#input-search'),
            placeholdertext = $('.hasebz_search_block').find('[type=text]').attr('placeholder');

        function removefocus(el) {
            el.focus(function() {
                el.attr('placeholder', '');
                el.parents('form').find('.bootstrap-select').removeClass('open');
            });
            el.focusout(function() {
                el.attr('placeholder', placeholdertext);
            });
        }
        if (ie8.length || $('ie9').length || $('ie10').length) {
            field.placeholder();
        } else {
            removefocus(field);
        }

        $('.selectpicker').on('changed.bs.select', function(e) {
            $('.bootstrap-select').removeClass('open');
        });

        // Nav
        navbarexpand();
        subnavwidth();
        // Nav end
        if ($('.hasebz_offers_slider').length) {
            initSlider();
        }
        if ($('.hasebz_bxslider').length) {
            initmainSlider();
        }
        showhideitems();

        if (winwidth >= 768) {
            $('.panel-group span').on('click', function() {
                setTimeout(function() {
                    $('#hasebz_footer .item').setAllToMaxHeight();
                }, 500);
            });
        }

        

        if ($('#content-link').length > 0) {
            if ($('#content-link .nav-tabs > span').length == 1) {
                $('#content-link, a[href="#content-link"]').hide();
            }
        }

        // Append Script to content page
        var srciptpage=$('#loadedjs').data('src');
            script = document.createElement('script' );
            script.src = srciptpage;
            if(srciptpage) {
                $('body').append(script);
            }

    });

    // Sticky bar device
    $('.hasebz_sticky_bar .dropdown').on('touchstart', function () {
        var el = $(this);
        if(!el.hasClass('open')) {
            setTimeout(function () {
                el.addClass('open').siblings().removeClass('open');
            },500);
        } else {
             setTimeout(function () {
                 el.removeClass('open');
            },550);
        }
        
    })

    $('.navbar-nav > .dropdown').hover(function(e) {
        var el = $(this),
            dropdownparents = el.parents('.navbar-collapse');
        var subdropdownshow = el.find('.dropdown.show');
        var subdropdownactive = el.find('.dropdown.active');
        setTimeout(function() {
            if (subdropdownshow.length > 0) { initHeightDropDown($(subdropdownshow)); }
            if (subdropdownactive.length > 0) { initHeightDropDown($(subdropdownactive)); }
        }, 50);
    });
    $('.dropdown.last').off('mouseenter mouseleave').on({
        mouseenter: function () {
            $(this).closest('.navbar-collapse').addClass('hasebz_last_item');
        },
        mouseleave: function () {
            $(this).closest('.navbar-collapse').stop().removeClass('hasebz_last_item');
        }
    });

    $('.navbar-nav .dropdown').on('click', function function_name(argument) {
        var el = $(this),
            parents = el.closest('.navbar-collapse'),
            dropdown = el.find('.dropdown-menu');
        if (parents.hasClass('hasebz_last_item')) {
            parents.removeClass('hasebz_last_item');
        } else {
            if (el.hasClass('last') && dropdown.is(':hidden')) {
                parents.addClass('hasebz_last_item');
            }
        }
    });

    // View more/less Services
    var active=$(".hasebz_services .dropdown .fa-chevron-down");
    $(document).on('click', function (e){
      if (!active.is(e.target) // if the target of the click isn't the container...
          && active.has(e.target).length === 0) // ... nor a descendant of the container
      {
          active.removeClass('active');
      }
    });

    $(".hasebz_services .dropdown .fa-chevron-down").click(function() {
       var el = $(this);
       if (el.hasClass('active')) {
         el.removeClass('active');
       } else {
         el.addClass("active").closest('.col-sx-12').siblings().find('.fa-chevron-down').removeClass('active');
       }
       // if($('.hasebz_services .dropdown .fa-chevron-down').hasClass('active')){
       //   $(this).removeClass('active');
       // }
       // else{
       //   $(this).addClass("active").closest('.col-sx-12').siblings().find('.fa-chevron-down').removeClass('active');
       // }
    });
    $(".fancy_popup").fancybox({
        helpers: {
            title: null
        }
    });
    // Service
    changeurlservice();
    $(window).on('load', function () {
        // promontion popup
        // var isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        //     iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
        //     iOSOpenApp = "hasecmbapp://com.hangseng.cmbmobileapp",
        //     iOSLinkApp = "itms://itunes.apple.com/hk/app/hang-seng-business-banking/id1117207965?mt=8",
        //     androidOpenApp = "intent://scan/#Intent;scheme=com.hangseng.cmbmobileapp;package=com.hangseng.cmbmobileapp;end",
        //     // androidLinkApp = "https://play.google.com/store/apps/details?id=com.hangseng.cmbmobileapp",
        //     proPopup = $('.hasebz_promotion_popup'),
        //     btnLink = $('.btn', proPopup),
        //     isOpen = false;

        // $(window).on('resize.popup', function () {
        //     if( isTouchDevice && winwidth < winheight && !isOpen) {
        //         proPopup.slideDown();
        //         isOpen = true;
        //         if (iOS) {
        //             btnLink.attr('href', iOSOpenApp);
        //         } else {
        //             if (confirm('Are you sure you want to download app, cancel for open app if already installed')) {
        //                 window.location = iOSLinkApp;
        //             } else {
        //                 window.location = iOSOpenApp;
        //             }
        //         }
        //         $('.button', proPopup).on('click', function (e) {
        //             if (iOS) {
        //                 timer = setTimeout(function () {
        //                     window.location = iOSLinkApp;
        //                 }, 2000);
        //             }
        //         });

        //         $('.close-popup', proPopup).on('click', function (e) {
        //             proPopup.slideUp();
        //         });

        //         $(document).off('touchend').on('touchend', function (e) {
        //             if (!proPopup.is(e.target) && proPopup.has(e.target).length === 0) {
        //                 proPopup.slideUp();
        //             }
        //         });
        //     } else {
        //         if (proPopup.is(':visible')) {
        //             proPopup.slideUp();
        //         }
        //     }
        // }).trigger('resize.popup');

        $(window).on('resize.block', function () {
            var image = $('.hasebz_tool_gird').find('.img-responsive');
            if (image.length) {
                if ($(window).width() >= 992) {
                    var height = image.height();
                    $('.hasebz_tool_gird').find('.block').css('min-height', height);
                } else {
                    $('.hasebz_tool_gird').find('.block').css('min-height', 'auto');
                }
            }
        }).trigger('resize.block');

    });

})(jQuery);



