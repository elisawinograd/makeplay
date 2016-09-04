'use strict';

(function($) {
  
  var $shareToggle  = $('.js-share-toggle');

  $shareToggle.on('click', function(e){
    e.preventDefault();

    debugger;
    // get the next thing and toggle it 
    $(this).next('.js-share-links').fadeToggle();

  });
  
})(jQuery);
