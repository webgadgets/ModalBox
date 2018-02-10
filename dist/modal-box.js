/*
 * Modal Box v1.2.1
 * http://webgadgets.net/plugins/modal-box
 *
 * Copyright 2018, WebGadgets
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: 2018-02-10
 *
 */
(function ($) {
    $.fn.wgModal = function (options) {

        // default settings:
        var defaults = {
            triggerElement: "", //
            openDelay: null, //openDelay - time in milliseconds
            openScrolled: null, //openScrolled - pixels forom top
            openAfterNClicks: null,
            width: null,
            verticalCentering: false,
            topOffset: null,
            bottomOffset: null,
            keyboard: true, // 	Closes the modal when escape key is pressed
            innerScroll: false,
            remote: null, // load content with ajax
            theme: '',
            responsive:{},
            onInitialize: function (e) {}, //event/callback
            onBeforeClose: function (e) {}, //event/callback
            onAfterClose: function (e) {}, //event/callback
            onBeforeOpen: function (e) {}, //event/callback
            onAfterOpen: function (e) {}, //event/callback


        };
        var settings = $.extend({}, defaults, options);

        var el = this;

        el.initialize = function () {
            el.addClass('wg-modal');
            el.wrapInner('<div class="wg-content"></div>');
            el.prepend($('<div class="wg-modal-close">&times;</div>'));
        };
        el.closeModal = function () {
            settings.onBeforeClose.call(el,el);
            el.parent('.bg-wg-modal').addClass('closing');
            setTimeout(function(){
                if (el.parent().hasClass('bg-wg-modal')) {
                    el.unwrap('.bg-wg-modal');
                    el.parent('.bg-wg-modal').removeClass('closing');
                }
            }, 400);
            $(el).css('padding-top','');
            settings.onAfterClose.call(el,el);
        };
        el.openModal = function () {
            if (el.parent().hasClass('bg-wg-modal') === false) {
                settings.onBeforeOpen.call(el,el);
                el.wrap('<div class="bg-wg-modal"></div>');
                
                if ( $(el).children('.wg-content').children('.wg-header').length > 0 ) {
                    var headerHeight = $(el).children('.wg-content').children('.wg-header').outerHeight();
                    console.log(headerHeight);
                    $(el).css({
                        'padding-top': parseFloat(headerHeight) + parseFloat($(el).css('padding-top'))
                    });
                }
                
                settings.onAfterOpen.call(el,el);
            }
        };



        return this.each(function () {

            var elem = $(this);
            var this_e = this;

            settings.onInitialize.call(this_e,el);

            el.initialize();

            checkResponsive();
            setSettings(this_e, true);
//            $(window).on("load resize", function (e) {
            $(window).on("resize", function (e) {
                checkResponsive();
                setSettings(this_e, false);
            });

            $(this_e).on("click", ".wg-modal-close", function() {
                el.closeModal();
            });
            $(document).on('click', ".bg-wg-modal", function() {
                if ($(this_e).parent().hasClass('bg-wg-modal')) {
                    el.closeModal();
                }
            });
            $(this_e).click(function(e) {
                e.stopPropagation();
            });



        });


        function checkResponsive() {
            var responsive_obj = settings.responsive;
            if (Object.keys(responsive_obj).length !== 0) {

                var windowW = $(window).width();
                var breakpoint = null;
                $.each(responsive_obj, function (key, value) {
                    if (windowW > key) {
                        breakpoint = key;
                    }
                });

                if (breakpoint !== null) {
                    settings = $.extend({}, settings, options);
                    settings = $.extend({}, settings, options.responsive[breakpoint]);
                } else {
                    settings = $.extend({}, settings, options);
                }
            }
        }
        function setSettings(this_e, refresh) {
            $(window).on("load resize", function (e) {
                if (settings.verticalCentering) {
                    if ($(this_e).height() < viewport().height) {
                        $(this_e).addClass('verticalCentering');
                    } else {
                        $(this_e).removeClass('verticalCentering');
                    }
                }
            });
            if (settings.remote !== null) {
                $(this_e).children('.wg-content').load(settings.remote);
            }
            if (settings.width !== null) {
                $(this_e).css('width', settings.width);
            }
            if (settings.topOffset !== null) {
                $(this_e).css('margin-top', settings.topOffset);
            }
            if (settings.bottomOffset !== null) {
                $(this_e).css('margin-bottom', settings.bottomOffset);
            }
            if (settings.innerScroll === true) {
                $(this_e).addClass('innerScroll');
                var sum_offset = null;
                var mt = parseFloat($(this_e).css('margin-top'));
                var mb = parseFloat($(this_e).css('margin-bottom'));
                var pt = parseFloat($(this_e).css('padding-top'));
                var pb = parseFloat($(this_e).css('padding-bottom'));
                var bt = parseFloat($(this_e).css('border-top-width'));
                var bb = parseFloat($(this_e).css('border-bottom-width'));
                sum_offset = mt + mb + pt + pb + bt + bb;
                var sum_offset_val = 'calc(100vh - ' + sum_offset + 'px)';
                $(this_e).children('.wg-content').css('max-height', sum_offset_val);
            }
            if (settings.theme !== '') {
                $(this_e).addClass(settings.theme);
            }
            
            
            

            if (settings.openAfterNClicks !== null) {
                var x = 12 * 12; //or whatever offset
                var CurrentDate = new Date();
                CurrentDate.setMonth(CurrentDate.getMonth() + x);
                var n_sel = el.selector;
                var n_sel = n_sel.replace("#", "id_");
                n_sel = n_sel.replace(".", "class_");
                n_sel = n_sel.replace("-", "_");

                var cookie_name = "wgModalCounter" + n_sel;
                var cookie_val = readCookie(cookie_name);
                if (cookie_val <= settings.openAfterNClicks){
                    cookie_val++;
                    document.cookie = cookie_name + "=" + cookie_val + "; expires=" + CurrentDate + ";path=/";
                    if (cookie_val === settings.openAfterNClicks){
                        el.openModal();
                    }
                }

            }
            if (settings.openScrolled !== null) {
                var x = 12 * 12; //or whatever offset
                var CurrentDate = new Date();
                CurrentDate.setMonth(CurrentDate.getMonth() + x);
                var n_sel = el.selector;
                var n_sel = n_sel.replace("#", "id_");
                n_sel = n_sel.replace(".", "class_");
                n_sel = n_sel.replace("-", "_");

                var cookie_name = "wgAlreadyOpened" + n_sel;
                
                $(window).on("load resize scroll", function (e) {
                    
                    var cookie_ao_val = readCookie(cookie_name);
                    var scroll = $(this).scrollTop();
                    if (scroll >= settings.openScrolled && cookie_ao_val != 1) {
                        el.openModal();
                        document.cookie = cookie_name + "=1; expires=" + CurrentDate + ";path=/";
                    }
                });
            }
            if (refresh) {
                if (settings.openDelay !== null) {
                    setTimeout(function(){
                        el.openModal();
                    }, settings.openDelay);

                }
            }
            if (settings.triggerElement !== '') {
                $(settings.triggerElement).click(function (){
                    el.openModal();
                });
            }
            if (settings.keyboard === true) {

                $(document).keyup(function (e) {
                    if (e.keyCode === 27 && $(this_e).parent().hasClass('bg-wg-modal')) { // escape key maps to keycode `27`
                        el.closeModal();
                    }
                });
            }
        }


    };



    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function viewport() {
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {width: e[ a + 'Width' ], height: e[ a + 'Height' ]};
    }
}(jQuery));