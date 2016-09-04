'use strict';

(function($) {
  
  var $window     = $(window);
  var $container  = $('.item-grid-container');
  var $items      = $container.find('.item-grid');
  var $activeItem = false;

  var $filtersWrap= $('.filters-section-wrap');


  var initIsotope = function() {
    // do Isotope
    $container.isotope({
      itemSelector: '.item-grid',
      // resizable: false,
      masonry: {
        columnWidth: '.item-grid-sizer'
      }
    });

    // trigger click on current item
    if (location.hash) {
      $items.filter(location.hash).trigger('click');
    }
  };


  // close active project
  var closeEverything = function() {
    if (!$activeItem) {
      return;
    }
    $activeItem.removeClass('js-active');
    // remove the project description;
    $activeItem.find('.js-insert-item-description').empty();
    $activeItem = false;
    $container.isotope('layout');
  };


  var initOpenClose = function() {

    // if this item was already open,
    // close it and quit


    

    $items.on('click', function(e) {
      e.preventDefault();
      
      var $this = $(this);                     // store the thing we just clicked on

      if ($this.is($activeItem)) {

        var $target = $(e.target);
        
        // if this is a click inside the content area, and not the x... return
        if ( !$target.hasClass('js-close') && $target.closest('.js-insert-item-description').length ) {
          return;
        }

        closeEverything();
        location.hash = 'projects';            // remove hash
      } 
      else {
        // otherwise...
        //  1.) close active item
        //  2.) open this item and store it as active item
        //  3. set hash
        //  4. relayout isotope
        //  5. load data
        //   afterload... 
        //  5.1  share handlers
        //  5.2 print handlers

        // 1.)
        closeEverything();
        // 2.) 
        $activeItem = $this.addClass('js-active');
        // 3. 
        location.hash = $this.attr('id');
        
        // 5. trigger isotope to re-layout 
        $container.isotope('layout');
        
        // 6. load data, parse it, and insert it into item
        $this.find('.js-insert-item-description')
          .load($this.find('.js-link').attr('href') + ' .item-description', function(){
          $container.isotope('layout');

          // 5.1 after loading... enable sharer
          $this.find('.js-share-toggle').on('click', function(e){
            e.preventDefault();
            
            // get the next thing and toggle it 
            $(this).next('.js-share-links').fadeToggle();

          });

          // 5.2 printer
          $this.find('.js-print').on('click', function(e){
            e.preventDefault();
            
            // get the next thing and toggle it 
            $this.print();

          });

        });
      }
      
    });
  };


  /** FILTERING **/
  var initFiltering = function() {

    var $filterGroups = $('.filter-group');


    // initialize the data
    $filterGroups.each(function() {
      $(this).data('filters', []);

    });
    // TODO: keep an array with all our filter information...
    // add/subtract to the array, and then isotope-filter
    // 'all'  is going to have special meaning.
    var filters = ['*'];

    $filterGroups.on('click', '.filter-option', function(e) {

      // close everything.. 
      closeEverything();

      var $thisFilterGroup = $(e.delegateTarget);
      var $thisFilter = $(this);

      // 1. if this is 'ALL', 
      //     1.a de-activate all other filters 
      //     2.a and empty filter array

      // 2. if this filter is active (hasClass('js-active'))
      // de-activate it, and remove it from the filter array
      //   if the filter array is empty at this point  ( data('filters').length === 0 )
      //   then insert '*'
      // 
      // else, if thisFilter ISN'T active ( !$thisFilter.hasClass('js-active'))
      //     then add class js-active, and add this to filter array
      //     If filter array has '*' remove '*'
      // fin

      // 1. if clicking 'all'
      if ($thisFilter.hasClass('js-all')) {

        // 1.a if all is already active, do nothing
        if ($thisFilter.hasClass('js-active')) {
          return;
        }
        // deactivate all other option.
        $thisFilterGroup.find('.filter-option').removeClass('js-active');
        // 2.a activate this
        $thisFilter.addClass('js-active');

        // empty filter array
        $thisFilterGroup.data('filters', []);
      } 
      // 2. if active, deactivate
      else if ($thisFilter.hasClass('js-active')) {
        // remove active class
        $thisFilter.removeClass('js-active');
        
        // remove this from the current group of filters 

        $thisFilterGroup.data('filters', _.without($thisFilterGroup.data('filters'), $thisFilter.data('filter')));

        // if filter array is empty, set all to true
        if  ($thisFilterGroup.data('filters').length === 0 ) {
          $thisFilterGroup.find('.js-all').addClass('js-active');
        }
      }
      // 3. if in-active, activate
      else {
        // deactivate 'all'
        $thisFilterGroup.find('.js-all').removeClass('js-active');

        $thisFilter.addClass('js-active');
        // add this filter data to the array of filter
        $thisFilterGroup.data('filters').push($thisFilter.data('filter') );
      }

      // log current state of this filter group to see how we're doing :)
      console.log($thisFilterGroup.data('filters'), 'THESE FILTERS');

      // last step... combine all our filters and hit up isotope
      // NOTE: isotope doesn't want an array, it wants a comma deliniated string
      
      // initialize an empty array;
      var allFilters = [];
      $filterGroups.each(function(i, elem) {
        // add filters from each group to our filter array
        allFilters = _.union(allFilters, $(this).data('filters'));
      });

      // spit out our array of ALL FILTERS
      console.log(allFilters, 'ALL FILTERS');

      // convert our array to a comma deliniated string, or * if empty
      var filterStr = !allFilters.length ? '*' : allFilters.join('');
      
      // finally... filter isotop 
      $container.isotope({
        filter: filterStr
      });
  
    });
  };


  // start everything only, once all images have loaded 
  $container.imagesLoaded().always( function( instance ) {
    initOpenClose();
    initIsotope();
    initFiltering();
  });
 

  
})(jQuery);
