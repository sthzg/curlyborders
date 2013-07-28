(function( $ ){

  var methods = {
       
     init : function( options ) {
     
     		var $this = this;
     
				// default settings
				var settings = {
				
					/**
					 * the view_mode is a switch between different display options.
					 */
					'pluginRoot': 'src',
					'theme': 'curly',
					'handleResize': false,
					'bordersDir': '',
					'preloader': {
						'loaded': 0,
						'toLoad': 0
					},
					
					/**
					 * The most interesting attributes for setting up the border 
					 * behaviour are repeat, freq, freqUnit and pos
					 * 
					 * Border segments can be defined to use two units:
					 * 1| percent
					 * 2| multiple
					 *
					 * Depending on the unit freq defines the length or height
					 * of the item:
					 *
					 * >> percent >> freq means XYZ percent of available space
					 * >> multiple >> freq means XYZ times the length/height of the item
					 *
					 * For example, if you define your top border elements with
					 * topleft | toprepeat | topright
					 *
					 * Her topleft and topright might be two separate border images
					 * that are setup to be displayed (freq:)1 time as (freqUnit) 'multiple'. 
					 * The toprepeat segment might span 100% of the space between
					 * topleft and topright
					 *
					 * 
					 */
					'borders': {
						'top': {
							'orientation': 'horizontal',
							'fixedWidths': 0,
							'fixedHeights': 0,
							'items': [
								{
									'id': 'topleft',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': false,
									'freq': 1,
									'freqUnit': 'multiple',
									'pos': 0,
									'totalWidth': 0,
									'totalHeight': 0
								},
								{
									'id': 'top',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': true,
									'freq': 100,
									'freqUnit': 'percent',
									'pos': 100,
									'totalWidth': 0,
									'totalHeight': 0
								},
								{
									'id': 'topright',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': false,
									'freq': 1,
									'freqUnit': 'multiple',
									'pos': -1,
									'totalWidth': 0,
									'totalHeight': 0
								}
							]
						},
						'right': {
							'orientation': 'vertical',
							'fixedWidths': 0,
							'fixedHeights': 0,
							'items': [
								{
									'id': 'righttop',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': false,
									'freq': 1,
									'freqUnit': 'multiple',
									'pos': 0,
									'totalWidth': 0,
									'totalHeight': 0
								},								
								{
									'id': 'right',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': true,
									'freq': 100,
									'freqUnit': 'percent',
									'pos': 100,
									'totalWidth': 0,
									'totalHeight': 0
								},
								{
									'id': 'rightbottom',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': false,
									'freq': 1,
									'freqUnit': 'multiple',
									'pos': 100,
									'totalWidth': 0,
									'totalHeight': 0
								}
							]
						},
						'bottom': {
							'orientation': 'horizontal',
							'fixedWidths': 0,
							'fixedHeights': 0,
							'items': [
								{
									'id': 'bottomleft',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': false,
									'freq': 1,
									'freqUnit': 'multiple',
									'pos': 0,
									'totalWidth': 0,
									'totalHeight': 0
								},
								{
									'id': 'bottom',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': true,
									'freq': 100,
									'freqUnit': 'percent',
									'pos': 100,
									'totalWidth': 0,
									'totalHeight': 0
								},
								{
									'id': 'bottomright',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': false,
									'freq': 1,
									'freqUnit': 'multiple',
									'pos': -1,
									'totalWidth': 0,
									'totalHeight': 0
								}
							]
						},
						'left': {
							'orientation': 'vertical',
							'fixedWidths': 0,
							'fixedHeights': 0,
							'items': [
								{
									'id': 'lefttop',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': false,
									'freq': 1,
									'freqUnit': 'multiple',
									'pos': -1,
									'totalWidth': 0,
									'totalHeight': 0
								},
								{
									'id': 'left',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': true,
									'freq': 75,
									'freqUnit': 'percent',
									'pos': 100,
									'totalWidth': 0,
									'totalHeight': 0
								},

								{
									'id': 'leftbubble',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': false,
									'freq': 1,
									'freqUnit': 'multiple',
									'pos': -1,
									'totalWidth': 0,
									'totalHeight': 0
								},
								
								{
									'id': 'left',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': true,
									'freq': 25,
									'freqUnit': 'percent',
									'pos': 100,
									'totalWidth': 0,
									'totalHeight': 0
								},
								
								{
									'id': 'leftbottom',
									'ext': 'png',
									'$img': undefined,
									'imgWidth': 0,
									'imgHeight': 0,
									'repeat': false,
									'freq': 1,
									'freqUnit': 'multiple',
									'pos': -1,
									'totalWidth': 0,
									'totalHeight': 0
								}	
							]
						}
					},
					
					'padding': '0',
					'paddingUnit': 'px'
				};
				
				// If options exist, lets merge them with our default settings
				if ( options ) {
					settings = $.extend( {}, settings, options );
				}

       return this.each(function(key, val){
        
         var $this = $(this);
         var data = $this.data('curlyborders');
         
         // If the plugin hasn't been initialized yet
         if ( ! data ) {

           $(this).data('curlyborders', {
               target : $this,
		 					 resizeTimeout: null
           });
           
           $this.data( 'settings', settings );
         }         
					
					// check border configuration and set the count of img the prelaoder has to get
					$.each(settings.borders, function(i, borderside) {
						$.each(borderside.items, function(j, segment) {
							settings.preloader.toLoad++;
						});
					});
					
					// preload border graphics
					$.each(settings.borders, function(i, borderside) {
					
						borderside._offsetLeft = 0;
						$.each(borderside.items, function(j, segment) {
							var path = settings.pluginRoot + '/themes/' + settings.theme + '/' + segment.id + '.' + segment.ext  + '?c=' + (new Date().getTime());

							console.log(path);

								$('<img />').load( function() {
										
									settings.preloader.loaded++;
									console.log(settings.preloader.loaded);
									
									// fill the data store
									segment.$img = $(this);
									segment.imgWidth = this.width;
									segment.imgHeight = this.height;
									
									// anything is laoded, start processing
									if(settings.preloader.loaded === settings.preloader.toLoad) {
										// call method to start the calculations
										console.log('pre _createBorders() call');
										methods._createBorders($this);
									}
									
								}).attr('src', path);

						});
					});
         
					// generate unique id and assign it
					var id = 'curlyborders-instance-' + key;
					$this.attr('id', id);
					
					// in some circumstances it might be appropriate for another controller to 
					// handle the resize-logic. in this case you can instantiate curlyborders with
					// the false flag for handleResize
					if (settings.handleResize === true)
						{ $(window).bind('resize', {'scope': $this}, methods.onResize); }
					
       });
     },
     
     /**
      * method
      */
			_createBorders: function($this) {
				console.log('create');
				// create markup
				var s = $this.data('settings');
				var w = Math.round($this.width() + 2 * s.padding);
				var h = Math.round($this.height() + 2 * s.padding);
				var t = Math.round($this.offset().top - s.padding);
				var l = Math.round($this.offset().left - s.padding);
				
				s.canvasWidth = w;
				s.canvasHeight = h;
				
				var $container = $('<div class="border-container" />');
				$container.css({
					'z-index': '0',
					'position': 'absolute',
					'width': w + 'px',
					'height': h + 'px',
					'overflow': 'hidden',
					'top': t + 'px',
					'left': l + 'px'
				});
				
				$this.css({
					'z-index': '1',
					'position': 'relative'
				});
				
				
				// this loop analyses and calculates position values and applies these
				// to the elements. it runs a two-step rendering process.
				$.each(s.borders, function(i, borderside) {
				
					// reset variables
					borderside._offset = 0;
				
					// 1st run: analyse
					$.each(borderside.items, function(j, segment) {
						
						// calculate pixel unit items
						if	(	segment.repeat === false || 
									( segment.repeat === true && 
										segment.freqUnit === 'multiple' 
									)
								)
						{
							segment.isVariable = false;
							switch (borderside.orientation) {
								case 'horizontal':
									segment.totalWidth = segment.freq * segment.imgWidth;
									borderside.fixedWidths += segment.totalWidth;
									segment.totalHeight = segment.imgHeight;
									segment._bgrep = 'repeat-x';
									break;
									
								case 'vertical':
									segment.totalHeight = segment.freq * segment.imgHeight;
									borderside.fixedHeights += segment.totalHeight;
									segment.totalWidth = segment.imgWidth;
									segment._bgrep = 'repeat-y';
									break;
							}
						} else {
							segment.isVariable = true;
						}
					});
					
					// 2nd run: position
					$.each(borderside.items, function(j, segment) {
					
						var path = s.pluginRoot + '/themes/' + s.theme + '/' + segment.id + '.' + segment.ext;										
						var $el = $('<div class="border border-side-top segment-'+ segment.id + '" />');
						var w = 0,
								h = 0,
								t = 0,
								l = 0;
					
						switch (i) {
							case 'top':
								var vertPos = { 
									'top': '0',
									'left': borderside._offset + 'px'
								};
								break;
								
							case 'right':
								var vertPos = {
									'top': borderside._offset + 'px',
									'right': '0'
								}
								break;
								
							case 'bottom':
								var vertPos = { 
									'bottom': '0',
									'left': borderside._offset + 'px'
								};
								break;
								
							case 'left':
								var vertPos = {
									'top': borderside._offset + 'px',
									'left': '0'
								}
								break;
						}
								
						if (segment.isVariable === false) {
							w = segment.totalWidth;
							h = segment.totalHeight;
						} else {
							if (borderside.orientation === 'horizontal') {
								w = Math.round((s.canvasWidth - borderside.fixedWidths) / 100 * segment.freq);
								h = segment.imgHeight;
							} else {
								w = segment.imgWidth;
								h = Math.round((s.canvasHeight - borderside.fixedHeights) / 100 * segment.freq);
							}
						}

					
						$el.css({
							'position': 'absolute',
							'width': w + 'px',
							'height': h + 'px',
							'overflow': 'hidden',
							'background-image': 'url(' + path + ')',
							'background-repeat': segment.bgrep
						});
						
						$el.css( vertPos );
						
						if (borderside.orientation === 'horizontal') {
							borderside._offset += w;
						} else {
							borderside._offset += h;						
						}
						
						$container.append($el);
										
					});
				});
				
				$('body').append($container);
				
			},
			
			onResize: function(ev) {
				var $this = ev.data.scope;
				var s = $this.data('settings');
				
				if (s.handleResize === true) {
					// tasks should be done only once when the user stopped resizing
					
					clearTimeout($this.data('curlyborders').resizeTimeout);
					$this.data('curlyborders').resizeTimeout = setTimeout(function() {
						$('.border-container ').remove();
						methods._createBorders($this);
					}, 350);
				} else {
					$('.border-container ').remove();
					methods._createBorders($this);
				}
			},
     
     destroy : function( ) {

       return this.each(function(){

         var $this = $(this),
             data = $this.data('curlyborders');

         // Namespacing FTW
         $(window).unbind('.curlyborders');
         $this.removeData('curlyborders');

       })

     },
     
     reposition : function( ) {  },
     show : function( ) {  },
     hide : function( ) {  },
     update : function( content ) { }
  };

  $.fn.curlyborders = function( method ) {
    
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.curlyborders' );
    }    
  
  };

})( jQuery );