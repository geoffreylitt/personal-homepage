/*
Main JS for geoffreylitt.com
By Geoffrey Litt
*/

(function(){
  //globals
  var siteWidth = $("#header_content").width();
  var panels = ['about', 'projects', 'blog'];
  var containerWidth = 0;
  var containerOffset = 0;

  $(document).ready(function() {
    positionPanels();
    updatePanel(false); //

    $(window).resize(positionPanels); //resize layout on window resize
    $(window).hashchange(function(){updatePanel(true)}); //wire up panel changing logic

    //project
    $(".project_description").each(function(i, element){
      $(this).find("p").first().show();
    });

    layoutProjects();

    var $prev_link = $();

    $("a.toggle_details").click(function(){
      this_box = $(this).parents(".project_box").get(0);
      prev_box = ($prev_link.length > 0) ? $prev_link.parents(".project_box").get(0) : null;
      if (prev_box){
        $prev_link.show();
        $prev_link.siblings("p").slice(1).slideUp(100, function(){
          setTimeout(function(){$("#projects_container").isotope('shiftColumnOfItem', prev_box);}, 100);
        });
        $prev_link.siblings("h2").slideUp(100);
      }
      $prev_link = $(this);
      $(this).hide();
      $(this).siblings("p").slideDown(125, function(){
        setTimeout(function(){$("#projects_container").isotope('shiftColumnOfItem', this_box);}, 100);
      });
      $(this).siblings("h2").slideDown(125);
    });
  });

  function positionPanels(){
    var numberOfPanels = $(".panel").length;
    var windowWidth = $(window).width();
    containerWidth = numberOfPanels * windowWidth; //full width including hidden parts
    $("#panel_container").width(windowWidth);
    for (i = 0; i < numberOfPanels; i++)
    {
      var $panel = $('#' + panels[i] + '_panel');
      var horizontalMargin = (windowWidth - $panel.outerWidth())/2 + 'px';
      var margin = '0 ' + horizontalMargin;
      $panel.css('margin', margin);
    }
  }

  function updatePanel(animate){
    if (window.location.hash !== '')
      panel = window.location.hash.split("#")[1];
    else
      panel = 'about';

    layoutProjects();
    var numberOfPanels = $(".panel").length;
    var windowWidth = $(window).width();
    var windowHeight = $(window).height()-20; //stop the appearance of the horizontal scrollbar from creating a vertical scrollbar
    var panelIndex = $.inArray(panel, panels);
    var panelExists = (panelIndex !== -1);
    var goalOffset = panelIndex * windowWidth * -1;
    var animationDuration = animate ? windowWidth/4 : 0; //animation speed is constant, duration proportional to animation distance

    if (panelExists) {
      $('#panel_container').css({'width':containerWidth, 'height':windowHeight+'px', 'margin-left':containerOffset});
      $('.panel').show();
      $('#panel_container').animate({'marginLeft': goalOffset + 'px'}, animationDuration, function(){
        containerOffset = goalOffset;
        $('.panel').not($('#'+panel+'_panel')).hide();
        $('#panel_container').css({'marginLeft':'0px', 'width':windowWidth+'px', 'height':'auto'});
        positionPanels();
      });
    }
  }

  function layoutProjects(){
    var $projects_container = $('#projects_container');
    $projects_container.imagesLoaded(function(){
      $projects_container.isotope({
        itemSelector: '.project_box',
        layoutMode: 'masonryColumnShift'
      });
    });
  }

    // custom layout mode
  $.Isotope.prototype._masonryColumnShiftReset = function() {
    // layout-specific props
    var props = this.masonryColumnShift = {
      columnBricks: []
    };
    // FIXME shouldn't have to call this again
    this._getSegments();
    var i = props.cols;
    props.colYs = [];
    while (i--) {
      props.colYs.push( 0 );
      // push an array, for bricks in each column
      props.columnBricks.push([])
    }
  };

  $.Isotope.prototype._masonryColumnShiftLayout = function( $elems ) {
    var instance = this,
        props = instance.masonryColumnShift;
    $elems.each(function(){
      var $brick  = $(this);
      var setY = props.colYs;

      // get the minimum Y value from the columns
      var minimumY = Math.min.apply( Math, setY ),
          shortCol = 0;

      // Find index of short column, the first from the left
      for (var i=0, len = setY.length; i < len; i++) {
        if ( setY[i] === minimumY ) {
          shortCol = i;
          break;
        }
      }

      // position the brick
      var x = props.columnWidth * shortCol,
          y = minimumY;
      instance._pushPosition( $brick, x, y );
      // keep track of columnIndex
      $.data( this, 'masonryColumnIndex', i );
      props.columnBricks[i].push( this );

      // apply setHeight to necessary columns
      var setHeight = minimumY + $brick.outerHeight(true),
          setSpan = props.cols + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        props.colYs[ shortCol + i ] = setHeight;
      }

    });
  };

 $.Isotope.prototype._masonryColumnShiftGetContainerSize = function() {
    var containerHeight = Math.max.apply( Math, this.masonryColumnShift.colYs );
    return { height: containerHeight };
  };

  $.Isotope.prototype._masonryColumnShiftResizeChanged = function() {
    return this._checkIfSegmentsChanged();
  };

  $.Isotope.prototype.shiftColumnOfItem = function( itemElem, callback ) {

    var columnIndex = $.data( itemElem, 'masonryColumnIndex' );

    // don't proceed if no columnIndex
    if ( !isFinite(columnIndex) ) {
      return;
    }

    var props = this.masonryColumnShift;
    var columnBricks = props.columnBricks[ columnIndex ];
    var $brick;
    var x = props.columnWidth * columnIndex;
    var y = 0;
    for (var i=0, len = columnBricks.length; i < len; i++) {
      $brick = $( columnBricks[i] );
      this._pushPosition( $brick, x, y );
      y += $brick.outerHeight(true);
    }

    // set the size of the container
    if ( this.options.resizesContainer ) {
      var containerStyle = this._masonryColumnShiftGetContainerSize();
      containerStyle.height = Math.max( y, containerStyle.height );
      this.styleQueue.push({ $el: this.element, style: containerStyle });
    }

    this._processStyleQueue( $(columnBricks), callback )

  };

  $(function(){

    var $container = $('#container');

    $container.isotope({
      itemSelector: '.shifty-item',
      layoutMode: 'masonryColumnShift'
    });

    $container.find('.shifty-item').hover(
      function() {
        $(this).css({ height: "+=100" });
        // note that element is passed in, not jQuery object
        $container.isotope( 'shiftColumnOfItem', this );
      },
      function() {
        $(this).css({ height: "-=100" });
        $container.isotope( 'shiftColumnOfItem', this );
      }
    );

  });

})();