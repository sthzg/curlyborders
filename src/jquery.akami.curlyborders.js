/**
 * The manager coordinates tasks for all instances of the plugin on one page.
 * For instance preloading of images
 */
var cbManager = {

	/**
	 * Unique ID for each border container on a page. Incremented automatically by the
	 * curlyborders plugin
	 */
	pk: 0,

	/**
	 * Holds theme objects for all active themes that are visible on the page
	 */
	themes: [],

	/**
	 * Add a theme to the theme manager
	 */
	addTheme: function(theme, $listener) {
	
		// check if the theme is already there
		var found = false;
		if (typeof this.themes[theme] != 'undefined') 
			{ found = true; }
		
		// theme does not exist, create a manager object for the theme
		if (found == false) {
			
			this.themes[theme] = {};
			var t = this.themes[theme];
			
			t.theme = theme;
			t.$listener = $listener;
			t.listeners = [$listener];
			t.config = undefined;
			t.images = [];
			t.isLoaded = false;

			t.loadConfig = function() {
				var that = this;
				var path = this.$listener.data('settings').pluginRoot;
				var filename = path + '/themes/' + this.theme + '/theme.js';
				var filename_json = path + '/themes/' + this.theme + '/theme.json';
				var json = $.getJSON(filename_json, function(data) {
					that.onConfig(data);
				});
			};
			
			t.onConfig = function(data) {
				this.config = data;
				this.loadMedia();
			};
			
			t.loadMedia = function() {
				
				var that = this;
				
				// preload border graphics
				$.each(this.config.borders, function(i, borderside) {
				
					borderside._offsetLeft = 0;
					$.each(borderside.items, function(j, segment) {
						t.images.push(that.$listener.data('settings').pluginRoot + '/themes/' + that.theme + '/' + segment.id + '.' + segment.ext);
					});
				});
				
				$.imgpreloader({
					paths: this.images				
				}).always(function($allImages, $properImages, $brokenImages){
					that.onMedia();
				});				
			};
			
			t.onMedia = function() {
				var that = this;
				this.isLoaded = true;
				
				// get with and height of all images and set the values in the config obj
				var cnt = 0;
				$tmp_container = $('<div class="tmp-container-'+this.theme+'"></div>');
				$('body').append($tmp_container);
				
				$.each(this.config.borders, function(i, borderside) {
					$.each(borderside.items, function(j, segment) {
						$img = $('<img />').attr('src', that.images[cnt]);
						$tmp_container.append($img);
						segment.$img = $img;
						segment.imgWidth = $img.width();
						segment.imgHeight = $img.height();
						cnt++;
					});
				});
				
				$tmp_container.remove();
				this.notifyListeners();			
			};			
			
			t.notifyListeners = function() {
				var that = this;
				$.each(this.listeners, function(key, val) {
					val.curlyborders('process', { '$this': val });
				});
			};
			
			t.loadConfig();
		} else {
			// add the listener to the list of elements that get the border theme applied
			this.themes[theme].listeners.push($listener);	
		}
	}		
};


/**
 * The plugin itself
 */
(function( $ ){

	var methods = {
       
		init : function( options ) {
     
    	var $this = this;
     
			// default settings
			var settings = {				
				/**
				 * the view_mode is a switch between different display options.
				 */
				'manager': this.manager,
				'pluginRoot': 'src',
				'theme': 'curly',
				'handleResize': false,
				'bordersDir': '',
				'preloader': {
					'loaded': 0,
					'toLoad': 0
				},			
				'padding': '0',
				'paddingUnit': 'px',
			};
								
			return this.each(function(key, val) {							
				// If options exist, lets merge them with our default settings
				if ( options ) 
					{ settings = $.extend( {}, settings, options ); }										

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
				cbManager.addTheme($this.data('settings').theme, $this);				
			});
		},
			
			
		/**
		 * All the theme configs are ready, go on
		 */
		process : function(args) {
	
			$this = args.$this;
			settings = $this.data('settings');
			
			// generate unique id and assign it
			var id = 'curlyborders-instance-' + cbManager.pk++;
			settings.pk = id;
			$this.attr('id', id);
			
			// in some circumstances it might be appropriate for another controller to 
			// handle the resize-logic. in this case you can instantiate curlyborders with
			// the false flag for handleResize
			if (settings.handleResize === true)
				{ $(window).bind('resize', {'scope': $this}, methods.onResize); }
				
			// initially create the border
			methods._createBorders($this);			
				
	 },
	 
	 /**
		* method
		*/
		_createBorders: function($this) {

			// create markup
			var s = $this.data('settings');
			var w = Math.round($this.width() + 2 * s.padding);
			var h = Math.round($this.height() + 2 * s.padding);
			var t = Math.round($this.offset().top - s.padding);
			var l = Math.round($this.offset().left - s.padding);
			
			s.canvasWidth = w;
			s.canvasHeight = h;
			
			var $container = $('<div class="border-container-'+s.pk+'" />');
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
			
			// since the manager stores only one instance per theme, we need to deep copy the
			// borders object so that each instance can handle its separate calcs				
			s.borders = {};
			$.extend(true, s.borders, cbManager.themes[s.theme].config.borders);
			
			s.borders.top.foo = 'bar';
			console.log(s.borders);
			console.log(cbManager.themes[s.theme].config.borders);
			
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
					
					console.log(w,h);

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
			
		getApi: function() {
			return $(this);
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