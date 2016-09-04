'use strict';

(function($) {
  
  var $window       = $(window);
  var $navbar       = $('#js-main-nav'); 
  var $navAnchor    = $('#js-nav-anchor'); 
  var $filters      = $('#filters-section-wrap'); 
  var $filtSizer    = $('#js-filters-section-wrap-sizer').hide(); 
  
  var $catToggler   = $navbar.find('.js-category-toggler').hide();
  var $catPlusMinus = $catToggler.find('.js-plus-minus');
  

  $catToggler.on('click', function(e) {
    e && e.preventDefault();
    $filters.fadeToggle();
    if ( $catPlusMinus.text().trim() === '+' ) {
      $catPlusMinus.text('-');
    } else {
      $catPlusMinus.text('+');
    }
  });
  

  // 1 big scroll event.

  $window.on('resize.nav', function() {
    // determin the spot where we switch from static to sticky.
    // recalc these values on resize, as the position will change
    
    //------------ navbar ----------//

    var wasFixed = $navbar.hasClass('js-fixed');

    // quickly unfix item and find it's waypoint and then fix it again if it was fixed, return its height
    var _h = $navbar.data('waypoint', $navbar.removeClass('js-fixed').offset().top).height();

    $navAnchor.height( _h );

    if (wasFixed) {
      $navbar.addClass('js-fixed');
    } 

    //------------ endNavbar ----------//


    //------------ filters ----------//
    
    wasFixed = $filters.hasClass('js-fixed');

    $filters.data('waypoint', parseInt($filters.removeClass('js-fixed').offset().top, 10) - _h).css('top', _h);

    if (wasFixed) {
      $filters.addClass('js-fixed');
    } 

    // set the sizers height so there isn't that akward jump
    $filtSizer.height($filters.height());

    //------------ endFilters ----------//

  })
  .trigger('resize.nav')
  .on('scroll.nav', function(){
    // get scroll position
    var scrollPos = $window.scrollTop();


    //------------ navbar ----------//
    
    var _firstRun = false;

    if (scrollPos > $navbar.data('waypoint')) {
      $navbar.addClass('js-fixed');
      $navAnchor.show();
        
      if (!_firstRun) {
        _firstRun = true;
        $(window).trigger('resize');
      }

    } else {
      $navbar.removeClass('js-fixed');
      $navAnchor.hide();
    }
    //------------ filters ----------//

    if ( scrollPos > $filters.data('waypoint') ) {
      $filters.addClass('js-fixed');
      $filtSizer.show();
      $catToggler.show();
    } else {
      $filters.removeClass('js-fixed');
      $filtSizer.hide();
      $catToggler.hide();
    }

  });
  

  // // SHAMEFUL
  // setInterval( function() {
  //   console.log('interval')
  //   $(window).trigger('rezize');
  // }, 100 );
  
})(jQuery);
