/*	
		============================================================================
 		*
		*	Parallax.it
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	Making parallaxing easy. iPad compatible(ish).
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*   created         >>  25 January 2012
		*   updated         >>  19 December 2012
		*
		============================================================================
*/


//---------------------------------------------------------------------------------------------------------------------------------- 

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();


function ParallaxCue( time, options ) {
	
	this.func			= null;
	this.startTime		= null;
	this.endTime		= null;
	
	this.triggered		= false;
	
	this.onEnter		= null;
	this.onExit			= null;
	this.onTrigger		= null;
	this.onlyOnce		= false;
	
	this.init( time, options );
	
}

ParallaxCue.prototype.init = function( time, options ) {
	
	if ( typeof time == 'object' ) {
		
		if ( time.start != undefined && time.end != undefined ) {
			this.startTime = time.start;
			this.endTime = time.end;
		} else {
			if ( window.console ) console.log( 'Parallax.it !! cue segment time(s) not valid' );
		}
		
	} else if ( typeof time == 'number' ) {
		
		this.startTime = time - 60;
		this.endTime = time + 60;
		
	} else {
		if ( window.console ) console.log( 'Parallax.it !! cue time not valid type' );
	}
	
	if ( typeof options == 'object' ) {
		
		if ( options.onlyOnce != undefined ) this.onlyOnce = options.onlyOnce
		
		if ( options.onEnter != undefined ) {
			if ( typeof options.onEnter == 'function' ) this.onEnter = options.onEnter;
			else {
				if ( window.console ) console.log( 'Parallax.it !! cue option -- onEnter -- not valid type' );
			}
		}
		
		if ( options.onExit != undefined ) {
			if ( typeof options.onExit == 'function' ) this.onExit = options.onExit;
			else {
				if ( window.console ) console.log( 'Parallax.it !! cue option -- onExit -- not valid type' );
			}
		}
		
		if ( options.onTrigger != undefined ) {
			if ( typeof options.onTrigger == 'function' ) this.onTrigger = options.onTrigger;
			else {
				if ( window.console ) console.log( 'Parallax.it !! cue option -- onTrigger -- not valid type' );
			}
		}
		
	} else {
		if ( window.console ) console.log( 'Parallax.it !! cue options not valid type' );
	}
	
};

function ParallaxAnimation( el, timeframe, props ) {
	
	this.el				= $( el );
	this.ID				= el;
	
	this.onStart		= null;
	this.onEnd			= null;
	
	this.start			= null;
	this.end			= null;
	
	this.complete		= null;
	
	this.animation		= [];
	
	this.init( timeframe, props );
	
	//this.timeframe		= timeframe;
	//this.props			= props;
	
}

ParallaxAnimation.prototype.init = function( timeframe, props ) {
	
	if ( props == undefined || timeframe == undefined ) {
		if ( window.console ) console.log( 'ParallaxAnimation // no timeframe or properties' );
		return;
	}
	
	if ( !Parallax.checked_mobile ) Parallax.check_if_mobile();
	
	
	this.start 	= timeframe.start;
	this.end	= timeframe.end;
	
	
	
	//if ( this.props.onStart != undefined ) this.onStart = this.props.onStart;
	//if ( this.props.onEnd != undefined ) this.onEnd = this.props.onEnd;
	//return;
	var convertedProps = ParallaxUtils.convertProps( this, timeframe, props, true );
	var _props = convertedProps[0];
	var props = convertedProps[1];
	
	//console.log( Parallax.browser.is_mobile );
	
	ParallaxUtils.saveCSS( this, timeframe, props, _props );
	
	this.name = 'pAni-' + Parallax.totalAnimations;
}

ParallaxAnimation.prototype.update = function( ) {
	
	
	
}

ParallaxAnimation.prototype.extend = function( timeframe, props ) {
	
	if ( timeframe.start > this.start && timeframe.start < this.end ) {
		if ( window.console ) console.log( 'ParallaxAnimation.extend() // conflicting start -or- end' );
		return false;
	}
	
	if ( timeframe.end > this.start && timeframe.end < this.end ) {
		if ( window.console ) console.log( 'ParallaxAnimation.extend() // conflicting start -or- end' );
		return false;
	}
	
	var convertedProps = ParallaxUtils.convertProps( this, timeframe, props );
	
	var _props = convertedProps[0];
	
	props = convertedProps[1];
	
	ParallaxUtils.saveCSS( this, timeframe, props, _props );
	
	if ( timeframe.start < this.start ) this.start = timeframe.start;
	if ( timeframe.end > this.end ) this.end = timeframe.end;
}

var Parallax = {
	
	window				: null,
	ready				: false,
	resizing			: false,
	
	is_manual				: false,
	
	onProgress			: null,
	onResize			: null,
	onScrollUpdate		: null,
	onScrollEnd			: null,
	onScrollStart		: null,
	
	type 				: 'horizontal',
	sections 			: [],
	atSection			: 0,
	width 				: null,
	height				: null,
	
	fullWidth			: null,
	fullHeight			: null,
	
	scrollY				: null,
	
	scrollPercent		: null,
	scrollPercentX		: null,
	
	scrollPercentageY	: null,
	scrollPercentageX	: null,
	
	scrollWidth			: null,
	scrollHeight		: null,
	
	scrollBarWidth		: 16,
	scrollBarHeight		: null,
	
	scroll				: {
			
		y				: 0,
		percent			: null,
		percentX		: null,
		
		percentageY		: null,
		percentageX		: null,
		
		width			: null,
		height			: null,
		amount			: null,
		
		interval		: null,
		
		bind			: null
		
	},
	
	scrollbar			: {
		width			: 16,
		height			: null,
		visible			: true
	},
	
	options				: null,
	
	resizeTimeout		: null,
	
	animations			: [],
	totalAnimations		: 0,
	
	cues				: [],
	
	touch				: {
		
		start			: null,
		move			: null,
		end				: null,
		
		difference		: function() {
			return this.end - this.start;
		},
		
		startTime		: null,
		endTime			: null,
		
		differenceTime	: function() {
			return this.endTime - this.startTime;
		},
		
		x				: null
		
	},
	
	browser				: {
		
		info			: null,
		is_mobile		: false,
		is_msie			: false
		
	},
	
	moving				: false,
	
	ID					: {
		
		scroll			: 'parallaxScroll',
		css				: 'parallaxCSS',
		container		: 'parallax-it'
		
	},
	
	temp				: {
		
		amount			: null,
		time 			: null
		
	},
	
	ready				: false,
	
	setScrollAmount		: function( scrollAmount ) {
		
		if ( this.sections.length > 0 ) {
			if ( window.console ) console.log( '')
			return;
		}
		
		this.scroll.amount = scrollAmount;
		this.scroll.height = scrollAmount + $( window ).height();
		
		if ( this.ready ) {
			$( '#' + this.ID.scroll ).css( 'height', this.scroll.height );
		}
		
	},
	
	hideScrollbar : function( bool ) {
		
		this.scrollbar.visible = bool;
		
	},
	
	reset : function() {
		
		$( 'html,body' ).scrollTop( 0 );
		
	},
	
	scrollTo : function( amount, options ) {
		//var _time = time ? time : 500;
		var _time = 500;
		var _delay = 0;
		var _easing = 'jswing';
		var _queue = true;
		
		if ( options != undefined ) {
			if ( options.duration ) _time = options.duration;
			if ( options.delay ) _delay = options.delay;
			if ( options.init ) $( 'html,body' ).animate( { scrollTop: 0 }, 1 );
			if ( options.easing ) _easing = options.easing;
			if ( options.queue != undefined && options.queue == false ) _queue = false;
		}
		
		if ( this.scrollbar.visible ) {
			
			if ( _delay > 0 ) $( 'html,body' ).delay( _delay ).animate( { scrollTop: amount }, options );
			else $( 'html,body' ).animate( { scrollTop: amount }, options );
			
		} else {
			
			if ( typeof TweenLite == 'undefined' ) {
				if ( window.console ) console.log( 'ParallaxIt // missing GreenSock\'s TweenLite.min.js');
			} else {
				
				_easing = ( _easing == 'jswing' ) ? Linear.easeNone : _easing;
				
				_time *= .001;
				_delay *= .001;
				
				TweenLite.to( Parallax.scroll, _time, { y: amount, onUpdate: Parallax.scrollHandlerNoBar, delay: _delay, ease: _easing } );
				
			}
			
		}
		
	},
	
	cue : function( time, callback, onlyOnce ) {
		
		//var _onlyOnce = false;
		//if ( onlyOnce != undefined && onlyOnce == true ) _onlyOnce = true;
		
		this.cues.push(
			
			new ParallaxCue( time, callback, onlyOnce )
			
		);
		
	},
	
	anim : function( el, start, end, props ) {
		
		var exists = -1;
		
		for ( var i = 0, len = this.animations.length; i < len; i++ ) {
			//console.log( this.animations[i].ID );
			if ( el == this.animations[i].ID ) {
				exists = i;
				//continue;
				break;
			}
		}
		
		if ( exists != -1 ) {
			
			//this.animations[ exists ].extend( { start: start, end: end }, props );
			this.animations.push(
				new ParallaxAnimation( el, { start: start, end: end }, props )
			);
			
		} else {
			
			this.animations.push(
				new ParallaxAnimation( el, { start: start, end: end }, props )
			);
			
		}
		
		
		
	},
	
	manual : function() {
		this.is_manual = true;
		if ( !this.checked_mobile ) this.check_if_mobile();
	},
	
	it : function( options ) {
		
		if ( this.ready ) return;
		
		var _agent = navigator.userAgent.toLowerCase();
		var _msie = _agent.match(/msie/gi);
		if ( _msie != null && _msie[0] == 'msie' ) Parallax.browser.is_msie = true;
		
		if ( !this.scroll.bind ) this.scroll.bind = window;
		
		if ( !this.is_manual ) {
			if ( this.scrollbar.visible ) { 
				
				$( 'body' ).wrapInner( "<div id='" + this.ID.container + "'>" );
				$( 'body' ).append( '<div id="' + this.ID.scroll + '"></div>' );
			
				$( 'head' ).append( '<style id="' + this.ID.css + '" type="text/css"></style>');
				
				var css = '#' + this.ID.scroll + ' {';
				css += 'position: absolute;';
				css += 'width: 1px;';
				css += 'height: ' + this.scroll.height + 'px;';
				css += 'left: 0px; top: 0px;';
				css += 'z-index: -99; visible: false;';
				css += '}';
				
				css += '#' + this.ID.container + ' {';
				css += 'left: 0px; top: 0px; position: fixed;';
				css += 'width: 100%; height: 100%';
				css += '}';
				
				css += 'body { overflow: visible; }';
				
				$( '#' + this.ID.css ).append( css );
				
				this.scrollbar.height = $( window ).height();
			
			} else {
				
				$( 'head' ).append( '<style id="' + this.ID.css + '" type="text/css"></style>');
				
				var css = 'body { overflow: hidden; }';
				
				$( '#' + this.ID.css ).append( css );
				
			}
		
		}
		
		if ( !Parallax.browser.is_mobile ) _parallaxTimer = 0;
		
		this.listen();
		
		this.ready = true;
		
		return;
		
		
		if ( this.sections.length == 0 ) {
			if ( window.console ) console.log( 'parallax.it() // no sections created' );
			return false;
		}		
		
		if ( options ) this.options = options;
		this.resizeHandler();
		
		/*setTimeout( function() {
			var _atSection = 0;
			var _scrollTop = $( this.scroll.bind ).scrollTop();
			for ( var i = 0; i < parallax.sections.length; i++ ) {
				if ( _scrollTop > parallax.sections[i].startY ) _atSection = i;
			}
			parallax.atSection = _atSection;
			if ( parallax.sections[ parallax.atSection ].onEnter ) parallax.sections[ parallax.atSection ].onEnter();
			
		}, 1 );*/
		
		if ( this.options.keyboardNav != undefined && this.options.keyboardNav === true && !this.browser.is_mobile ) this.keyboardNavEvents( true );
		
		this.on();
	},
	
	update : function() {
		/*var _totalMiddle = 0;
		
		for ( var j = 1, len = this.sections.length - 1; j < len; j++ ) {
			_totalMiddle += this.sections[j].scroll;
		}*/
		
		for ( var i = 0; i < this.sections.length; i++ ) {
			this.sections[i].startY = ( this.fullHeight / this.sections.length ) * i;
			this.sections[i].scrollX = ( this.width * i ) / this.scrollWidth;
			
			if ( !this.options.auto ) {
				
				if ( i == 0 ) {
					this.sections[i].scrollPercent = 0;
				} /* else if ( i == this.sections.length - 1 ) {
					this.sections[i].scrollPercent = 1;
				} */ else {
					var _scroll = 0;
					_scroll = ( this.sections[i].scroll >> 1 );
					
					//console.log( _totalMiddle );
					//console.log( _scroll );
					
					/*this.sections[i].scrollPercent = _scroll / _totalMiddle;
					if ( i - 1 > 0 ) {
						this.sections[i].scrollPercent += this.sections[ i-1 ].scrollPercent;
					}
					this.sections[i].scrollPercent += ( ( _scroll / _totalMiddle ) * .5 );*/
					
					var _prevTotal = 0;
					for ( var j = i - 1; j > -1; j-- ) {
						_prevTotal += this.sections[j].scroll;
					}
					
					//console.log( _prevTotal );
					
					this.sections[i].scrollPercent = _prevTotal / this.options.scroll;
				}
				
				
				//console.log( this.sections[i].startPercent );
			}
			 
			
			//console.log( this.fullWidth );
		}
		
		for ( var k = this.sections.length - 1; k > -1; k-- ) {
			var _section = this.sections[k];
			var _nextSection = this.sections[k + 1];
			var _prevSection = this.sections[k - 1];
			
			if ( this.options.padding < 1 ) _section.percentIncrement = ( ( this.options.padding * _section.scroll ) / this.options.scroll );
			else _section.percentIncrement = this.options.padding / this.options.scroll;
			
			if ( k == this.sections.length - 1 ) {
				_section.percentA = _section.scrollPercent + _section.percentIncrement;
				_section.percentB = 1;
			} else if ( k == 0 ) {
				_section.percentA = 0;
				_section.percentB = _nextSection.scrollPercent - _section.percentIncrement;
			} else {
				_section.percentA = _section.scrollPercent + _section.percentIncrement;
				_section.percentB = _nextSection.scrollPercent - _section.percentIncrement;
			}
		}
		
	},
	
	toPercentage : function( p, range, fromZero ) {
		var _p = null;
		
		if ( fromZero ) _p = 1 - ( ( ( 1 - p ) - ( 1 - range ) ) / range );
		else _p = 1 - ( ( 1 - p ) / range );
		
		return _p;
	},
	
	percentIt : function( p, start, end, reverse ) {
		var _p = null;
			
		_p = ( p - start ) / ( ( p - end ) - ( p - start ) );
		_p *= -1;
		
		if ( reverse ) _p = 1 - _p;
		
		return _p;
	},
	
	checkAnimations : function() {
		//console.log( 'checking animations' );
		//console.log( this.scrollY );
		
		//if ( this.resizing ) return;
		
		for ( var i = 0, end = this.animations.length; i < end; i++ ) {
			
			
			
			var _ani = this.animations[i];
			if ( this.scroll.y > _ani.start - 200 && this.scroll.y < _ani.end + 200 ) {
				//console.log( true );
				if ( this.scroll.y >= _ani.start && this.scroll.y <= _ani.end ) {
					//console.log( scrollY );
					if ( _ani.animation[ this.scroll.y ] ) _ani.el.css( _ani.animation[ this.scroll.y ] );
				} else {
					if ( this.scroll.y < _ani.start ) _ani.el.css( _ani.animation[ _ani.start ] );
					else if ( this.scroll.y > _ani.end ) _ani.el.css( _ani.animation[ _ani.end ] );
				}
				
			}
			
		}
		
	},
	
	addAnimation : function( animation ) {
		this.animations.push( animation );
		this.totalAnimations++;
	},
	
	addSection : function( parallaxSection ) {
		this.sections.push( parallaxSection );
		this.section++;
	},
	
	goTo : function( sectionName, el ) {
		var scrollTo = null;
		
		if ( this.sections[ this.atSection ].name == sectionName ) return false;
		
		for ( var i = 0; i < this.sections.length; i++ ) {
			
			var _section = this.sections[i];
			if ( _section.name == sectionName ) {
				if ( this.type == 'horizontal' ) {
					//scrollTo = ( _section.startY / this.scrollBarHeight ) * this.scrollWidth;
					//if ( _section.onEnter ) _section.onEnter();
					//$( el ).animate( { left: -scrollTo }, 500 );
					//$( window ).scrollTop( _section.startY );
					
					var _scroll = 0;
					
					if ( this.options.auto ) _scroll = _section.startY;
					else {
						
						//this.scrollPercentageY = this.atSection / ( this.sections.length - 1 );
						//console.log( this.scrollPercentageY );
						//$( window ).scrollTop( this.scrollPercentageY * this.scrollBarHeight );
						
						//_scroll = _section.scrollPercent * parallax.options.scroll;
						_scroll = _section.scrollPercent;
						_scroll *= this.options.scroll;
					}
					
					$( 'html,body' ).animate( {
						scrollTop: _scroll
					}, 500, parallax.doneMoving );
				}
				
				
				//else scroll
				return true;
			}
		}
		
		return false;
	},
	
	find : function( name ) {
		var _section;
		for ( var i = 0; i < this.sections.length; i++ ) {
			
			if ( this.sections[i].name == name ) {
				_section = this.sections[i];
				return _section;
			}
			
		}
		return false;
	},
	
	checked_mobile : false,
	
	check_if_mobile : function() {
		if ( this.checked_mobile ) return;
		Parallax.browser.type = navigator.platform.toLowerCase();
		
		Parallax.browser.is_mobile =
		( Parallax.browser.type.indexOf( 'iphone' ) != -1 ) ||
        ( Parallax.browser.type.indexOf( 'ipod' ) != -1 ) || 
        ( Parallax.browser.type.indexOf( 'ipad' ) != -1 ) ||
        ( Parallax.browser.type.indexOf( 'android' ) != -1 );
        
        this.checked_mobile = true;
        
        if ( Parallax.browser.is_mobile ) {
        	if ( window.console ) console.log( 'Parallax.it !! Mobile Animation' );
        } else {
        	if ( window.console ) console.log( 'Parallax.it !! Desktop Animation' );
        }
        
	},
	
	listen : function() {
		
		if ( !this.checked_mobile ) this.check_if_mobile();
		
		if ( Parallax.browser.is_mobile ) {
			$( Parallax.scroll.bind ).bind( 'touchstart', function( e ) {
				Parallax.touch.start = e.originalEvent.touches[0].pageY;
				Parallax.touch.end = e.originalEvent.touches[0].pageY;
				if ( Parallax.onScrollStart ) Parallax.onScrollStart();
				Parallax.touch.startTime = Number( new Date() );
				Parallax.scrollHandler();
				Parallax.touch.x = e.originalEvent.touches[0].pageX;
			});
			
			$( Parallax.scroll.bind ).bind( 'touchmove', function( e ) {
				if ( Math.abs( e.originalEvent.touches[0].pageY - Parallax.touch.start ) < 5 ) {
					Parallax.touch.start = Parallax.touch.end = e.originalEvent.touches[0].pageY;
				} else {
					if ( Math.abs( e.originalEvent.touches[0].pageY - Parallax.touch.end ) < 5 ) {
						Parallax.touch.start = Parallax.touch.end = e.originalEvent.touches[0].pageY;
					} else {
						Parallax.touch.end = e.originalEvent.touches[0].pageY;	
					}
					
				}
				Parallax.touch.x = e.originalEvent.touches[0].pageX;
				Parallax.scrollHandler();
			});
			
			$( Parallax.scroll.bind ).bind( 'touchend', function( e ) {
				//Parallax.touch.start = e.touches[0].pageY;
				Parallax.touch.endTime = Number( new Date() );
				if ( Parallax.onScrollEnd ) Parallax.onScrollEnd();
				Parallax.scrollHandler();
			});
			
			/*document.addEventListener( 'touchstart' , function(e) {
				//Parallax.handle.is_scrolling = false;
				//Parallax.touch.start = e.touches[0].pageX >> 3;
				Parallax.touch.start = e.touches[0].pageY;
				Parallax.scrollHandler();
			
			}, false);
			
			
			
			document.addEventListener( 'touchmove' , function(e) {
							
				//Parallax.scrollHandler( null, Parallax.scrollY - ( ( e.touches[0].pageX >> 3 ) - Parallax.touch.start ) );
				//Parallax.scroll.y = Parallax.scroll.y - ( ( e.touches[0].pageX >> 3 ) - Parallax.touch.start );
				//Parallax.touch.start = e.touches[0].pageX >> 3;
				//Parallax.touch.start = e.touches[0].pageY >> 3;
				//console.log( e.touches[0].pageY >> 1 );
				Parallax.touch.end = e.touches[0].pageY;
				Parallax.scrollHandler();
				
			}, false);
			
			document.addEventListener( 'touchend' , function( e ) {
				//Parallax.test.animation();
				//Parallax.handle.is_scrolling = true;
				//setTimeout( Parallax.handle.scrolling, 10 );
				//Parallax.touch.start = e.touches[0].pageX >> 3;
				//Parallax.touch.end = e.touches[0].pageY >> 3;
				//console.log( e.originalEvent.touches[0] );
				//console.log( Parallax.touch.end - Parallax.touch.start );
				//$( Parallax.scroll.bind ).animate( { scrollTop: 1000 }, { duration: 3000, easing: 'easeOutBounce' } );
				Parallax.scrollHandler();
				
				//Parallax.scroll.y = Parallax.scroll.y - ( ( e.touches[0].pageX >> 3 ) - Parallax.touch.start );
				
			}, false );*/
			
			//$( document ).bind( 'scrollstart', this.handle.scrollstart );
			//$( document ).bind( 'scrollstop', this.handle.scrollstop );
			
			//$( Parallax.scroll.bind ).bind( 'scroll', this.scrollHandler );
		}
		else {
			$( Parallax.scroll.bind ).bind( 'scroll', this.scrollHandlerDesktop );
			//$( 'html,body' ).bind( 'scroll', function() { console.log( 'scroll' ) } );
		}
		
		$( window ).bind( 'resize', this.resizeHandler );
		
		/*document.addEventListener( 'touchmove' , function(e) {
			//e.preventDefault();
			console.log( e + ' // ' + e.touches[0].pageY + ' // ' + e.y );
		}, false);*/
		
		this.ready = true;
		
		$( window ).unload( function() { Parallax.reset(); });
	},
	
	test : {
		animation : function() {
			$( 'head' ).append( '<style id="' + 'cssAnimations' + '" type="text/css"></style>' );
				
				var animation = '@-webkit-keyframes ' + 'testAnimation' + ' {';
					animation += '0% { -webkit-transform: rotateX( ' + 0 + 'deg ); }';
					animation += '100% { -webkit-transform: rotateX( ' + 90 + 'deg ); }';
					animation += '}';
					$( '#cssAnimations' ).append( animation );
		
				$( '#main_' ).css( { '-webkit-animation-name': 'testAnimation', '-webkit-animation-duration': '5s' })
		}
	},
	
	handle : {
		
		scroll : function ( unbind ) {
			// cleaning up
			Parallax.scrollHandler();
		}
	},
	
	unlisten : function() {
		$( document ).unbind( 'scroll', Parallax.scrollHandler );
		$( window ).unbind( 'resize', Parallax.resizeHandler );
		this.ready = false;
	},
	
	scrollBindTo : function( el ) {
		this.scroll.bind = el;
	},
	
	scrollHandler : function( unbind ) {
		
		Parallax.scroll.y = $( Parallax.scroll.bind ).scrollTop();
		Parallax.scroll.percent = Parallax.scroll.y / Parallax.scroll.amount;
		//Parallax.scroll.percentY = Parallax.scroll.y / Parallax.scrollbar.height;
		
		if ( Parallax.scroll.percent > 1 ) Parallax.scroll.percent = 1;
		if ( Parallax.scroll.percentY > 1 ) Parallax.scroll.percentY = 1;
		
		//console.log( 'Parallax.scroll.y : ' + Parallax.scroll.y + ' -- Parallax.scroll.percent : ' + Parallax.scroll.percent );
		
		//this.updateSections();
		
		Parallax.checkAll();
		
		if ( !unbind ) if ( this.onScrollUpdate ) this.onScrollUpdate();
	},
	
	desktop : {
		scrollStop : function() {
			if ( Parallax.onScrollEnd ) Parallax.onScrollEnd();
			Parallax.desktop.endTime = Number( new Date() );
			Parallax.desktop.end = Parallax.scroll.y;
			Parallax.desktop.scrolling = false;
		},
		
		scrollStart : function() {
			Parallax.desktop.scrolling = true;
			if ( Parallax.onScrollStart ) Parallax.onScrollStart();
			Parallax.desktop.start = Parallax.scroll.y;
			Parallax.desktop.startTime = Number( new Date() );
		},
		
		scrollUpdate : function() {
			if ( Parallax.onScrollUpdate ) Parallax.onScrollUpdate();
		},
		
		start			: null,
		move			: null,
		end				: null,
		
		waitTime		: 150,
		
		scrolling		: false,
		
		difference		: function() {
			return this.end - this.start;
		},
		
		startTime		: null,
		endTime			: null,
		
		differenceTime	: function() {
			return this.endTime - this.startTime;
		}
	},
	
	scrollHandlerDesktop : function( unbind ) {
		
		Parallax.scrollHandler();
		
		if ( !Parallax.desktop.scrolling ) Parallax.desktop.scrollStart();
		else Parallax.desktop.scrollUpdate();
		
		clearTimeout( _parallaxTimer );
		_parallaxTimer = setTimeout( Parallax.desktop.scrollStop, Parallax.desktop.waitTime );
		
	},
	
	scrollHandlerNoBar : function () {
		
		Parallax.scroll.y = parseInt( Parallax.scroll.y );
		Parallax.scroll.percent = Parallax.scroll.y / Parallax.scroll.amount;
		//Parallax.scroll.percentY = Parallax.scroll.y / Parallax.scrollbar.height;
		
		if ( Parallax.scroll.percent > 1 ) Parallax.scroll.percent = 1;
		if ( Parallax.scroll.percentY > 1 ) Parallax.scroll.percentY = 1;
		
		//console.log( 'Parallax.scroll.y : ' + Parallax.scroll.y + ' -- Parallax.scroll.percent : ' + Parallax.scroll.percent );
		
		Parallax.checkAll();
	},
	
	checkAll : function() {
		
		Parallax.checkCues();
		Parallax.checkAnimations();
		
	},
	
	checkCues : function() {
		
		for ( var i = 0, end = this.cues.length; i < end; i++ ) {
			
			_cue = this.cues[i];
			
			if ( _cue.onlyOnce && _cue.triggered ) continue;
			
			if ( !_cue.triggered ) {
				if ( this.scroll.y > _cue.startTime && this.scroll.y < _cue.endTime ) {
					_cue.triggered = true;
					if ( _cue.onTrigger ) _cue.onTrigger();
				} 
			} else {
				if ( this.scroll.y < _cue.startTime || this.scroll.y > _cue.endTime ) {
					_cue.triggered = false
				} 
			}
			
		}
		
	},
	
	updateSections : function() {
		
		//parallax.scrollY = $( window ).scrollTop();
		//parallax.scrollPercentageY = ( parallax.scrollY / parallax.scrollBarHeight );
		//parallax.scrollPercent = ( parallax.scrollY / parallax.options.scroll );
		//if ( parallax.scrollPercentageY > 1 ) parallax.scrollPercentageY = 1;
		//if ( parallax.scrollPercent > 1 ) parallax.scrollPercent = 1;
		
		var _thisSection = parallax.sections[ parallax.atSection ];
		var _sectionPercentage = ( parallax.scrollY - _thisSection.scrollStart ) / _thisSection.scroll;
		if ( _sectionPercentage > 1 ) _sectionPercentage = 1;
		
		//$( parallax ).trigger( 'progress', parallax.scrollPercent );
		
		if ( parallax.onProgress ) parallax.onProgress( parallax.scrollPercent );
		if ( _thisSection.onProgress ) _thisSection.onProgress( _sectionPercentage );
		
		/*$( parallax ).trigger( parallax.sections[ parallax.atSection ].name, _sectionPercentage );*/
		
		
		if ( parallax.type == 'horizontal' ) {
			
			var _prevSection,
				_section,
				_nextSection;
				
			_prevSection = parallax.sections[ parallax.atSection - 1 ];
			_section = parallax.sections[ parallax.atSection ];
			_nextSection = parallax.sections[ parallax.atSection + 1 ];
			
			var _scrollPercent = parallax.scrollPercent;
			var _scrollPosition;
			
			var _scrollIncrement = 1 / ( parallax.sections.length - 1 );
			//console.log( _scrollIncrement );
			
			if ( parallax.options.stick ) {
			
			if ( _prevSection && !_nextSection ) {
				
				//parallax.scrollPercentX * parallax.scrollWidth
				//if ( parallax.scrollPercent < _section.scrollPercent ) parallax.scrollPercentX = _prevSection.scrollX;
				if ( _scrollPercent < _section.percentA && _scrollPercent > _prevSection.percentB ) {
					var _percent;
					if ( _scrollPercent < _section.scrollPercent ) {
						//console.log( Math.abs( _scrollPercent - _section.scrollPercent ) );
						_percent = Math.abs( _scrollPercent - _section.scrollPercent ) * _prevSection.percentIncrement;
						//console.log( _percent );
						parallax.scrollPercentX = _section.scrollX - ( _percent * _scrollIncrement );
					} else {
						_percent = Math.abs( _scrollPercent - _prevSection.scrollPercent ) * _section.percentIncrement;
						parallax.scrollPercentX = _section.scrollX + ( _percent * _scrollIncrement );
						if ( parallax.scrollPercentX > 1 ) parallax.scrollPercentX = 1;
					}
				} else if ( _scrollPercent > _section.percentA ) parallax.scrollPercentX = _section.scrollX;
			} else if ( _nextSection && !_prevSection ) {
				//if ( parallax.scrollPercent > _nextSection.scrollPercent ) parallax.scrollPercentX = _nextSection.scrollX;
				var _percent;
				if ( _scrollPercent > _section.percentB && _scrollPercent < _nextSection.percentA ) {
					if ( _scrollPercent < _nextSection.scrollPercent ) {
						_percent = Math.abs( _scrollPercent - _nextSection.scrollPercent );
						_percent = _percent / _section.percentIncrement;
						_percent *= _scrollIncrement;
						//console.log( _percent );
						//console.log( _scrollPercent + ' - ' + _nextSection.scrollPercent + ' :: ' + _section.percentIncrement );
						//parallax.scrollPercentX = _section.scrollPercent - ( Math.abs( _scrollPercent - _section.scrollPercent ) );
						parallax.scrollPercentX = _nextSection.scrollX - _percent;
						if ( parallax.scrollPercentX < 0 ) parallax.scrollPercentX = 0;
					} else {
						
						//parallax.scrollPercentX = _section.scrollPercent + ( Math.abs( _scrollPercent - _section.scrollPercent ) );
						_percent = Math.abs( _scrollPercent - _nextSection.scrollPercent );
						_percent = _percent / _nextSection.percentIncrement;
						_percent *= _scrollIncrement;
						//console.log( _percent );
						//console.log( _scrollPercent + ' - ' + _nextSection.scrollPercent + ' :: ' + _section.percentIncrement );
						parallax.scrollPercentX = _nextSection.scrollX + _percent;
						if ( parallax.scrollPercentX > _nextSection.scrollX ) parallax.scrollPercentX = _nextSection.scrollX;
					}
				} else if ( _scrollPercent < _section.percentB ) parallax.scrollPercentX = _section.scrollX;
				
			} else if ( _nextSection && _prevSection ){
				
				if ( _scrollPercent > _section.percentA && _scrollPercent < _section.percentB ){
					//console.log( 'A' );
					parallax.scrollPercentX = _section.scrollX;
				} else if ( _scrollPercent > _nextSection.percentA && _scrollPercent < _nextSection.percentB ) {
					//console.log( 'B' );
					parallax.scrollPercentX = _nextSection.scrollX;
				} else if ( _scrollPercent > _prevSection.percentA && _scrollPercent < _prevSection.percentB ) {
					//console.log( 'C' );
					parallax.scrollPercentX = _prevSection.scrollX;
				} else if ( _scrollPercent < _nextSection.percentA && _scrollPercent > _section.percentB ) {
					//console.log( 2 ); 
					if ( _scrollPercent < _nextSection.scrollPercent ) {
						//var _percent = Math.abs( _scrollPercent - _nextSection.scrollPercent ) * _section.percentIncrement;
						//console.log( _scrollPercent + ' - ' + _nextSection.scrollPercent + ' :: ' + _section.percentIncrement );
						var _percent = Math.abs( _scrollPercent - _nextSection.scrollPercent )
						_percent = _percent / _section.percentIncrement;
						_percent *= _scrollIncrement;
						//_percent *= .5;
						//_percent = Math.abs( _percent - 1 );
						//_percent *= _scrollIncrement;
						//_percent *= 50;
						//console.log( _percent + ', ' + _section.percentIncrement + ':: ' + _scrollIncrement );
						//console.log( _nextSection.percentA - _nextSection.scrollPercent );
						if ( _percent >= _scrollIncrement ) parallax.scrollPercentX = _nextSection.scrollX;
						else parallax.scrollPercentX = _nextSection.scrollX - _percent;
						
						if ( parallax.scrollPercentX < _section.scrollX ) parallax.scrollPercentX = _section.scrollX;
						
						//console.log( parallax.scrollPercentX );
					} else {
						var _percent = Math.abs( _scrollPercent - _nextSection.scrollPercent );
						_percent = _percent / _nextSection.percentIncrement;
						_percent *= _scrollIncrement;
						//_percent *= _scrollIncrement;
						//_percent *= 50;
						//console.log( _scrollPercent + ' - ' + _nextSection.scrollPercent );
						//console.log ( Math.abs( _scrollPercent - _nextSection.scrollPercent ) );
						//console.log( _percent + ', ' + _nextSection.percentIncrement );
						if ( _percent >= _scrollIncrement ) parallax.scrollPercentX = _nextSection.scrollX;
						else parallax.scrollPercentX = _nextSection.scrollX + _percent;
						
						if ( parallax.scrollPercentX > _nextSection.scrollX ) parallax.scrollPercentX = _nextSection.scrollX;
						
						//console.log( parallax.scrollPercentX );
					}
				} else {
					//console.log( 3 );
					parallax.scrollPercentX = _section.scrollX;
				}/*else if ( _scrollPercent < _section.percentA && _scrollPercent > _prevSection.percentB ) {
					console.log( 3 );
					if ( _scrollPercent < _section.scrollPercent ) {
						console.log( 8 );
						//var _percent = Math.abs( _scrollPercent - _section.scrollPercent ) * _prevSection.percentIncrement;
						//_percent *= _scrollIncrement;
						var _percent = Math.abs( _scrollPercent - _section.scrollPercent ) * _prevSection.percentIncrement;
						//_percent *= _scrollIncrement;
						//_percent *= 100;
						console.log( _percent );
						_percent = 0;
						parallax.scrollPercentX = _section.scrollX - _percent;
					} else {
						//console.log( 5 );
						//var _percent = Math.abs( _scrollPercent - _section.scrollPercent ) * _section.percentIncrement;
						//_percent *= _scrollIncrement;
						var _percent = Math.abs( _scrollPercent - _section.scrollPercent ) * _section.percentIncrement;
						//_percent *= _scrollIncrement;
						//_percent *= 100;
						//console.log( _percent + ', ' + _section.percentIncrement + ':: ' + _scrollIncrement );
						console.log( _percent );
						_percent = 0;
						parallax.scrollPercentX = _section.scrollX + _percent;
					}
				}*/
				
				//if ( parallax.scrollPercent > _nextSection.scrollPercent ) parallax.scrollPercentX = _nextSection.scrollX;
				//else if ( parallax.scrollPercent < _section.scrollPercent ) parallax.scrollPercentX = _prevSection.scrollX;
			}
			
			//console.log( _scrollPercent + ', ' + parallax.scrollPercentX );
			
			} else {
				var _diff;
				
				if ( _prevSection && !_nextSection ) {
					//console.log( 'A' );
					if ( _scrollPercent > _section.scrollPercent ) {
						_diff = _scrollPercent - _section.scrollPercent;
						_diff = _diff / ( 1 - _section.scrollPercent );
						_diff *= _scrollIncrement;
						parallax.scrollPercentX = _section.scrollX + _diff;
						if ( parallax.scrollPercentX > 1 ) parallax.scrollPercentX = 1;
					} else {
						
						_diff = _section.scrollPercent - _scrollPercent;
						_diff = _diff / ( _section.scrollPercent - _prevSection.scrollPercent );
						_diff *= _scrollIncrement;
						parallax.scrollPercentX = _section.scrollX - _diff;
						if ( parallax.scrollPercentX < _prevSection.scrollX ) parallax.scrollPercentX = _prevSection.scrollPercent;
						
					}
					
					
				} else if ( _nextSection && !_prevSection ) {
					
					if ( _scrollPercent < _nextSection.scrollPercent ) {
						_diff = _nextSection.scrollPercent - _scrollPercent;
						_diff = _diff / _nextSection.scrollPercent;
						_diff *= _scrollIncrement;
						parallax.scrollPercentX = _nextSection.scrollX - _diff;
						if ( parallax.scrollPercentX < 0 ) parallax.scrollPercentX = 0;
					} else {
						_diff = ( _nextSection.percentB + _nextSection.percentIncrement ) - _scrollPercent;
						_diff = _diff / ( ( _nextSection.percentB + _nextSection.percentIncrement ) - _section.scrollPercent );
						_diff *= _scrollIncrement;
						parallax.scrollPercentX = _section.scrollX - _diff;
						if ( parallax.scrollPercentX > _nextSection.scrollPercent ) parallax.scrollPercentX = _nextSection.scrollPercent;
					}
					
				} else if ( _nextSection && _prevSection ){
					
					if ( _scrollPercent < _nextSection.scrollPercent ) {
						//console.log( 2 );
						_diff = _nextSection.scrollPercent - _scrollPercent;
						_diff = _diff / ( _nextSection.scrollPercent - _section.scrollPercent );
						_diff *= _scrollIncrement;
						
						parallax.scrollPercentX = _nextSection.scrollX - _diff;
						
						//if ( parallax.scrollPercentX < _section.scrollPercent ) parallax.scrollPercentX = _section.scrollPercent;
					} 
					
					//console.log( parallax.scrollPercentX + ' :: ' + _section.scrollPercent );
				}
				
				
			}
			
			//console.log( parallax.scrollPercentX );
			
			parallax.options.container.css( 'left', '-' + ( parallax.scrollPercentX * parallax.scrollWidth ) + 'px' );
		}
		
		parallax.check();
		
	},
	
	resizeHandler : function() {
		//console.log( 'resizing' );
		
		Parallax.scrollbar.height = $( window ).height();
		Parallax.setScrollAmount( Parallax.scroll.amount );
		Parallax.resizing = true;
		
		return;
		//parallax.width = $( document ).width();
		//parallax.height = $( window ).height();
		
		if ( parallax.type == 'horizontal' ) {
			parallax.fullWidth = parallax.width * parallax.sections.length;
			//console.log( parallax.fullWidth );
			$( parallax.options.container ).width( parallax.fullWidth + 'px');
		}
		
		if ( parallax.options ) {
			
			if ( parallax.options.type != undefined ) parallax.type = parallax.options.type;
			
		}
		
		if ( parallax.type == 'horizontal' ) {
			parallax.fullWidth = parallax.width * parallax.sections.length;
			parallax.scrollWidth = parallax.width * ( parallax.sections.length - 1 );
			
			if ( parallax.options.auto ) {
				parallax.fullHeight = parallax.height * parallax.sections.length;
				parallax.scrollBarHeight = parallax.fullHeight * ( ( parallax.sections.length - 1 ) / parallax.sections.length );
				$( '#_height' ).css( 'height', ( parallax.fullHeight ) + 'px' );
			} else {
				parallax.fullHeight = parallax.options.scroll;
				parallax.scrollBarHeight = parallax.fullHeight * ( ( parallax.sections.length - 1 ) / parallax.sections.length );
				$( '#_height' ).css( 'height', ( parallax.fullHeight + parallax.height - parallax.scrollBarWidth ) + 'px' );
			}
			//this.scrollHeight -= this.scrollBarWidth;
			//this.fullWidth += 20;
		}
		
		parallax.update();
		if ( parallax.options.stick == true ) parallax.stick();
		
		if ( parallax.onResize ) parallax.onResize();
		
		if ( parallax.type == 'horizontal' ) {
			if ( parallax.options.stick == true ) parallax.options.container.css( 'left', '-' + ( ( parallax.atSection / ( parallax.sections.length - 1 ) ) * parallax.scrollWidth ) + 'px' );
			else {
				if ( parallax.atSection == parallax.sections.length - 1 ) parallax.options.container.css( 'left', '-' + parallax.scrollWidth + 'px' );
			}
		}
		
		$( '.section' ).width( parallax.width );
		
		if ( parallax.resizeTimeout ) {
			clearTimeout( parallax.resizeTimeout );
			parallax.resizeTimeout = null;
		}
		
		parallax.resizeTimeout = setTimeout( function() {
			parallax.resizing = false;
			clearTimeout( parallax.resizeTimeout );
			parallax.resizeTimeout = null;
		}, 200 );
	},
	
	stick : function() {
		this.scrollPercentageY = this.atSection / ( this.sections.length - 1 );
		//console.log( this.scrollPercentageY );
		
		var _scroll;
		_scroll = this.sections[ this.atSection ].scrollPercent;
		_scroll *= this.options.scroll;
		
		$( this.scroll.bind ).scrollTop( _scroll );
		
		//$( window ).scrollTop( this.scrollPercentageY * this.scrollBarHeight );
	},
	
	keyboardNavEvents : function( on ) {
		if ( on ) $( window ).bind( 'keydown', parallax.keydownHandler );
		else $( window ).unbind( 'keydown', parallax.keydownHandler );
	},
	
	keydownHandler : function( e ) {
		if ( parallax.moving ) return;
		
		var key = e.keyCode || 0;
	
		// LEFT -or- UP ARROW
		if ( key == 37 /*|| key == 38*/ ) {
			if ( parallax.atSection == parallax.sections.length - 1 &&  parallax.scrollY > parallax.sections[ parallax.atSection ].scrollStart ) {
				parallax.moving = true;
				parallax.goTo( parallax.sections[ parallax.atSection ].name );
			} else if ( parallax.atSection > 0 ) {
				parallax.moving = true;
				parallax.goTo( parallax.sections[ parallax.atSection - 1 ].name );
			}
			return;
		};
		
		// RIGHT -or- DOWN ARROW
		if ( key == 39 /*|| key == 40*/ ) {
			if ( parallax.atSection < parallax.sections.length - 1 ) {
				parallax.moving = true;
				parallax.goTo( parallax.sections[ parallax.atSection + 1 ].name );
			} else if ( parallax.atSection == parallax.sections.length - 1 ) {
				if ( parallax.scrollY == parallax.options.scroll ) return;
				parallax.moving = true;
				$( 'html,body' ).animate( {
					scrollTop: parallax.options.scroll
				}, 500, parallax.doneMoving );
			}
			return;
		};
		
	},
	
	doneMoving : function() {
		parallax.moving = false;
	},
	
	check : function() {
		if ( this.resizing ) return;
		
		if ( this.atSection > 0 && this.atSection < this.sections.length - 1 ) {
			var _nextSection = this.sections[ this.atSection + 1 ];
			var _currentSection = this.sections[ this.atSection ];
			var _prevSection = this.sections[ this.atSection - 1 ];
			if ( _prevSection.scrollPercent == 0 && _nextSection.scrollPercent == 1 ) {
				if ( this.scrollPercent >= .995 ) {
					if ( _currentSection.onExit ) {
						if ( _currentSection.onExitParams ) _currentSection.onExit.apply( {}, _currentSection.onExitParams );
						else _currentSection.onExit();
					}
					if ( _nextSection.onEnter ) {
						if ( _nextSection.onEnterParams ) _nextSection.onEnter.apply( {}, _nextSection.onEnterParams );
						else _nextSection.onEnter();
					}
					
					if ( _currentSection.onEnd ) {
						if ( _currentSection.onEndParams ) _currentSection.onEnd.apply( {}, _currentSection.onEndParams );
						else _currentSection.onEnd();
					}
					
					if ( _nextSection.onStart ) {
						if ( _nextSection.onStartParams ) _nextSection.onStart.apply( {}, _nextSection.onStartParams );
						else _nextSection.onStart();
					}
					
					if ( _currentSection.onProgress ) _currentSection.onProgress( 1 );
					//$( parallax ).trigger( parallax.sections[ parallax.atSection ].name, 1 );
					this.atSection++;
				} else if ( this.scrollPercent < _currentSection.scrollPercent ) {
					if ( _currentSection.onExit ) {
						if ( _currentSection.onExitParams ) _currentSection.onExit.apply( {}, _currentSection.onExitParams );
						else _currentSection.onExit();
					}
					
					if ( _prevSection.onEnter ) {
						if ( _prevSection.onEnterParams ) _prevSection.onEnter.apply( {}, _prevSection.onEnterParams );
						else _prevSection.onEnter();
					}
					
					if ( _currentSection.onStart ) {
						if ( _currentSection.onStartParams ) _currentSection.onStart.apply( {}, _currentSection.onStartParams );
						else _currentSection.onStart();
					}
					
					if ( _prevSection.onEnd ) {
						if ( _prevSection.onEndParams ) _prevSection.onEnd.apply( {}, _prevSection.onEndParams );
						else _prevSection.onEnd();
					}
					
					if ( _currentSection.onProgress ) _currentSection.onProgress( 0 );
					//$( parallax ).trigger( parallax.sections[ parallax.atSection ].name, 0 );
					this.atSection--;
				}
			} else if ( _prevSection.scrollPercent == 0 ) {
				if ( this.scrollPercent >= _nextSection.scrollPercent ) {
					if ( _currentSection.onExit ) {
						if ( _currentSection.onExitParams ) _currentSection.onExit.apply( {}, _currentSection.onExitParams );
						else _currentSection.onExit();
					}
					if ( _nextSection.onEnter ) {
						if ( _nextSection.onEnterParams ) _nextSection.onEnter.apply( {}, _nextSection.onEnterParams );
						else _nextSection.onEnter();
					}
					
					if ( _currentSection.onEnd ) {
						if ( _currentSection.onEndParams ) _currentSection.onEnd.apply( {}, _currentSection.onEndParams );
						else _currentSection.onEnd();
					}
					
					if ( _nextSection.onStart ) {
						if ( _nextSection.onStartParams ) _nextSection.onStart.apply( {}, _nextSection.onStartParams );
						else _nextSection.onStart();
					}
					
					if ( _currentSection.onProgress ) _currentSection.onProgress( 1 );
					//$( parallax ).trigger( parallax.sections[ parallax.atSection ].name, 1 );
					this.atSection++;
				} else if ( this.scrollPercent < _currentSection.scrollPercent ) {
					if ( _currentSection.onExit ) {
						if ( _currentSection.onExitParams ) _currentSection.onExit.apply( {}, _currentSection.onExitParams );
						else _currentSection.onExit();
					}
					
					if ( _prevSection.onEnter ) {
						if ( _prevSection.onEnterParams ) _prevSection.onEnter.apply( {}, _prevSection.onEnterParams );
						else _prevSection.onEnter();
					}
					
					if ( _currentSection.onStart ) {
						if ( _currentSection.onStartParams ) _currentSection.onStart.apply( {}, _currentSection.onStartParams );
						else _currentSection.onStart();
					}
					
					if ( _prevSection.onEnd ) {
						if ( _prevSection.onEndParams ) _prevSection.onEnd.apply( {}, _prevSection.onEndParams );
						else _prevSection.onEnd();
					}
					
					if ( _currentSection.onProgress ) _currentSection.onProgress( 0 );
					//$( parallax ).trigger( parallax.sections[ parallax.atSection ].name, 0 );
					this.atSection--;
				}
			} else if ( _nextSection.scrollPercent == 1 ) {
				if ( this.scrollPercent >= .995 ) {
					if ( _currentSection.onExit ) {
						if ( _currentSection.onExitParams ) _currentSection.onExit.apply( {}, _currentSection.onExitParams );
						else _currentSection.onExit();
					}
					if ( _nextSection.onEnter ) {
						if ( _nextSection.onEnterParams ) _nextSection.onEnter.apply( {}, _nextSection.onEnterParams );
						else _nextSection.onEnter();
					}
					
					if ( _currentSection.onEnd ) {
						if ( _currentSection.onEndParams ) _currentSection.onEnd.apply( {}, _currentSection.onEndParams );
						else _currentSection.onEnd();
					}
					
					if ( _nextSection.onStart ) {
						if ( _nextSection.onStartParams ) _nextSection.onStart.apply( {}, _nextSection.onStartParams );
						else _nextSection.onStart();
					}
					
					if ( _currentSection.onProgress ) _currentSection.onProgress( 1 );
					//$( parallax ).trigger( parallax.sections[ parallax.atSection ].name, 1 );
					this.atSection++;
				} else if ( this.scrollPercent < this.sections[this.atSection ].scrollPercent ) {
					if ( _currentSection.onExit ) {
						if ( _currentSection.onExitParams ) _currentSection.onExit.apply( {}, _currentSection.onExitParams );
						else _currentSection.onExit();
					}
					
					if ( _prevSection.onEnter ) {
						if ( _prevSection.onEnterParams ) _prevSection.onEnter.apply( {}, _prevSection.onEnterParams );
						else _prevSection.onEnter();
					}
					
					if ( _currentSection.onStart ) {
						if ( _currentSection.onStartParams ) _currentSection.onStart.apply( {}, _currentSection.onStartParams );
						else _currentSection.onStart();
					}
					
					if ( _prevSection.onEnd ) {
						if ( _prevSection.onEndParams ) _prevSection.onEnd.apply( {}, _prevSection.onEndParams );
						else _prevSection.onEnd();
					}
					
					if ( _currentSection.onProgress ) _currentSection.onProgress( 0 );
					//$( parallax ).trigger( parallax.sections[ parallax.atSection ].name, 0 );
					this.atSection--;
				}
			} else {
				if ( this.scrollPercent >= _nextSection.scrollPercent ) {
					if ( _currentSection.onExit ) {
						if ( _currentSection.onExitParams ) _currentSection.onExit.apply( {}, _currentSection.onExitParams );
						else _currentSection.onExit();
					}
					
					if ( _nextSection.onEnter ) {
						if ( _nextSection.onEnterParams ) _nextSection.onEnter.apply( {}, _nextSection.onEnterParams );
						else _nextSection.onEnter();
					}
					
					if ( _currentSection.onEnd ) {
						if ( _currentSection.onEndParams ) _currentSection.onEnd.apply( {}, _currentSection.onEndParams );
						else _currentSection.onEnd();
					}
					
					if ( _nextSection.onStart ) {
						if ( _nextSection.onStartParams ) _nextSection.onStart.apply( {}, _nextSection.onStartParams );
						else _nextSection.onStart();
					}
					
					if ( _currentSection.onProgress ) _currentSection.onProgress( 1 );
					//$( parallax ).trigger( parallax.sections[ parallax.atSection ].name, 1 );
					this.atSection++;
				} else if ( this.scrollPercent < this.sections[this.atSection ].scrollPercent ) {
					if ( _currentSection.onExit ) {
						if ( _currentSection.onExitParams ) _currentSection.onExit.apply( {}, _currentSection.onExitParams );
						else _currentSection.onExit();
					}
					
					if ( _prevSection.onEnter ) {
						if ( _prevSection.onEnterParams ) _prevSection.onEnter.apply( {}, _prevSection.onEnterParams );
						else _prevSection.onEnter();
					}
					
					if ( _currentSection.onStart ) {
						if ( _currentSection.onStartParams ) _currentSection.onStart.apply( {}, _currentSection.onStartParams );
						else _currentSection.onStart();
					}
					
					if ( _prevSection.onEnd ) {
						if ( _prevSection.onEndParams ) _prevSection.onEnd.apply( {}, _prevSection.onEndParams );
						else _prevSection.onEnd();
					}
					
					if ( _currentSection.onProgress ) _currentSection.onProgress( 0 );
					//$( parallax ).trigger( parallax.sections[ parallax.atSection ].name, 0 );
					this.atSection--;
				}
			}
			
		} else {
			var _currentSection = this.sections[ this.atSection ];
			if ( this.atSection == 0 ) {
				var _nextSection = this.sections[1];
				if ( this.scrollPercent >= _nextSection.scrollPercent ) {
					if ( _currentSection.onExit ) {
						if ( _currentSection.onExitParams ) _currentSection.onExit.apply( {}, _currentSection.onExitParams );
						else _currentSection.onExit();
					}
					
					if ( _nextSection.onEnter ) {
						if ( _nextSection.onEnterParams ) _nextSection.onEnter.apply( {}, _nextSection.onEnterParams );
						else _nextSection.onEnter();
					}
					
					if ( _currentSection.onEnd ) {
						if ( _currentSection.onEndParams ) _currentSection.onEnd.apply( {}, _currentSection.onEndParams );
						else _currentSection.onEnd();
					}
					
					if ( _nextSection.onStart ) {
						if ( _nextSection.onStartParams ) _nextSection.onStart.apply( {}, _nextSection.onStartParams );
						else _nextSection.onStart();
					}
					
					if ( _currentSection.onProgress ) _currentSection.onProgress( 1 );
					//$( parallax ).trigger( parallax.sections[ parallax.atSection ].name, 1 );
					this.atSection = 1;
				}
			} else {
				var _section = this.sections[ this.sections.length - 1 ];
				var _prevSection = this.sections[ this.sections.length - 2 ];
				if ( this.scrollPercent < _currentSection.scrollPercent ) {
					
					if ( _currentSection.onExit ) {
						if ( _currentSection.onExitParams ) _currentSection.onExit.apply( {}, _currentSection.onExitParams );
						else _currentSection.onExit();
					}
					if ( _prevSection.onEnter ) {
						if ( _prevSection.onEnterParams ) _prevSection.onEnter.apply( {}, _prevSection.onEnterParams );
						else _prevSection.onEnter();
					}
					
					if ( _currentSection.onStart ) {
						if ( _currentSection.onStartParams ) _currentSection.onStart.apply( {}, _currentSection.onStartParams );
						else _currentSection.onStart();
					}
					
					if ( _prevSection.onEnd ) {
						if ( _prevSection.onEndParams ) _prevSection.onEnd.apply( {}, _prevSection.onEndParams );
						else _prevSection.onEnd();
					}
					
					if ( _currentSection.onProgress ) _currentSection.onProgress( 0 );
					//$( parallax ).trigger( parallax.sections[ parallax.atSection ].name, 0 );
					this.atSection--;
				}
			}
		}
		
		
		
	}
}



ParallaxUtils = {};

ParallaxUtils.saveCSS = function( pAni, animation, props, _props ) {
	for ( var start = animation.start, end = animation.end + 1, count = 0; start < end; start++, count++ ) {
		
		var _css = {};
		
		for ( var i in _props ) {
			
			switch ( i ) {
				case 'rotation':
					$.extend( _css, ParallaxUtils.rotationCSS( props.sRotation + ( props.rotation * count ) ) );
					break;
				case 'scale':
					$.extend( _css, ParallaxUtils.scaleCSS( props.sScale + ( props.scale * count ) ) );
					break;
				case 'opacity':
					if ( Parallax.browser.is_msie ) $.extend( _css, { opacity: props.sOpacity + ( props.opacity * count ) } );
					else $.extend( _css, { opacity: props.sOpacity + ( props.opacity * count ), 'filter': 'alpha(opacity=' + parseInt( ( props.sOpacity + ( props.opacity * count ) ) * 100 ) + ')' } );
					break;
				case 'left':
					if ( Parallax.browser.is_mobile ) $.extend( _css, { '-webkit-transform': 'translate3D(' + Math.round( props.sLeft + ( props.left * count ) ) + 'px, 0px, 0px)' } );
					else $.extend( _css, { left: props.sLeft + ( props.left * count ) } );
					//console.log( Math.round( props.sLeft + ( props.left * count  ) ) );
					
					break;
				case 'left%':
					$.extend( _css, { left: ( parseInt( props.sLeft ) + ( props.left * count ) ) + '%' } );
					break;
				case 'top':
					
					if ( Parallax.browser.is_mobile ) $.extend( _css, { '-webkit-transform': 'translate3D( 0px, ' +  Math.round( props.sTop + ( props.top * count ) ) + 'px, 0px)' } );
					else $.extend( _css, { top: props.sTop + ( props.top * count ) } );
					//console.log( Math.round( props.sLeft + ( props.left * count  ) ) );
					
					//$.extend( _css, { top: props.sTop + ( props.top * count ) } );
					break;
				case 'top%':
					$.extend( _css, { top: ( parseInt( props.sTop ) + ( props.top * count ) ) + '%' } );
					break;
				case 'width':
					$.extend( _css, { width: props.sWidth + ( props.width * count ) } );
					break;
				case 'height':
					$.extend( _css, { height: props.sHeight + ( props.height * count ) } );
					break;
				case 'bottom':
					$.extend( _css, { bottom: props.sBottom + ( props.bottom * count ) } );
					break;
				case 'right':
					$.extend( _css, { right: props.sRight + ( props.right * count ) } );
					break;
			}
		}
		
		pAni.animation[ start ] = _css;
	}
}

ParallaxUtils.scaleCSS = function( scale ) {
	return {'-moz-transform':'scale('+scale+')',
		  '-webkit-transform':'scale('+scale+')',
		  '-o-transform':'scale('+scale+')',
		  '-ms-transform':'scale('+scale+')'}
	
}

ParallaxUtils.rotationCSS = function( deg ) {
	return {'-moz-transform':'rotate('+deg+'deg)',
		  '-webkit-transform':'rotate('+deg+'deg)',
		  '-o-transform':'rotate('+deg+'deg)',
		  '-ms-transform':'rotate('+deg+'deg)'}
	
}

ParallaxUtils.checkTimeframe = function( pAni ) {
	
	if ( pAni.start <= 1 && pAni.end <= 1 ) {
		pAni.start 	= pAni.start * Parallax.scroll;
		pAni.end	= pAni.end * Parallax.scroll;
	}
	
}

ParallaxUtils.checkProps = function( props ) {
	
	for ( var i in props ) {
		switch ( i ) {
			case 'eLeft' :
			case 'sLeft' :
				if ( props[i][ props[i].length - 1 ] == '%' ) props[ 'left%' ] = true;
				else props[ 'left' ] = true;
				break;
			case 'sOpacity' :
			case 'eOpacity' :
				props[ 'opacity' ] = true;
				break;
			case 'sTop' :
			case 'eTop' :
				if ( props[i][ props[i].length - 1 ] == '%' ) props[ 'top%' ] = true;
				else props[ 'top' ] = true;
				break;
			case 'sWidth' :
			case 'eWidth' :
				props[ 'width' ] = true;
				break;
			case 'sHeight' :
			case 'eHeight' :
				props[ 'height' ] = true;
				break;
			case 'sBottom' :
			case 'eBottom' :
				props[ 'bottom' ] = true;
				break;
			case 'sRight' :
			case 'eRight' :
				props[ 'right' ] = true;
				break;
			case 'sRotation' :
			case 'eRotation' :
				props[ 'rotation' ] = true;
				break;
			case 'sScale' :
			case 'eScale' :
				props[ 'scale' ] = true;
				break;
		}
	}
	
	return props;
}

ParallaxUtils.error = {};
ParallaxUtils.error.autoPosition = function( ID ) {
	if ( window.console ) console.log( 'ParallaxAnim // ' + ID + ' - top or left value returns as auto, change CSS position to relative / absolute / other ' );
};

ParallaxUtils.convertProps = function( pAni, animation, props, init ) {
	
	props = ParallaxUtils.checkProps( props );
	
	var _props = {};
	var _frames = animation.end - animation.start;
	
	for ( var k in props ) {
		var good = true;
		
		switch( k ) {
			case 'rotation':
				/*if ( init || ( props.auto != undefined && props.auto == true ) ) {
					if ( props[ 'eLeft' ] == undefined ) props[ 'eLeft' ] = parseInt( this.el.css( 'left' ) );
					if ( props[ 'sLeft' ] == undefined ) props[ 'sLeft' ] = parseInt( this.el.css( 'left' ) );
				} else {
					if ( props[ 'sLeft' ] == undefined || props[ 'eLeft' ] == undefined ) {
						console.log( 'Parallax.extend() // sLeft -or- eLeft missing' );
						good = false;
					}
				}*/
				
				props.rotation = ( props[ 'eRotation' ] - props[ 'sRotation' ] ) / _frames;
				$.extend( _props, { rotation: true } );
				break;
			case 'scale':
				if ( props[ 'sScale' ] == undefined ) props[ 'sScale' ] = 1;
				props.scale = ( props[ 'eScale' ] - props[ 'sScale' ] ) / _frames;
				$.extend( _props, { scale: true } );
				break;
			case 'left':
				var left = pAni.el.css( 'left' );
				
				//if ( pAni.ID == '#logo' ) console.log( props );
				
				if ( init ) {
					if ( left == 'auto' && ( props[ 'eLeft' ] == undefined || props[ 'sLeft' ] == undefined ) ) ParallaxUtils.error.autoPosition( pAni.ID );
					
					if ( props[ 'eLeft' ] && typeof props[ 'eLeft' ] == 'string' && props[ 'eLeft' ][ 1 ] == '=' ) {
						var s = props[ 'eLeft' ].split( '=' );
						
						
						if ( left != 'auto' ) {
						
							if ( s[0] == '-' ) props[ 'eLeft' ] = parseInt( left ) - parseInt( s[1] );
							else props[ 'eLeft' ] = parseInt( left ) + parseInt( s[1] );
						}
					}
					
				}
				
				
			
				if ( init || ( props.auto != undefined && props.auto == true ) ) {
					if ( left != 'auto' ) {
						if ( props[ 'eLeft' ] == undefined ) props[ 'eLeft' ] = parseInt( left );
						if ( props[ 'sLeft' ] == undefined ) props[ 'sLeft' ] = parseInt( left );
					}
				} else {
					if ( props[ 'sLeft' ] == undefined || props[ 'eLeft' ] == undefined ) {
						if ( window.console ) console.log( 'Parallax.extend() // sLeft -or- eLeft missing' );
						good = false;
					}
				}
				
				
				
				props.left = ( props[ 'eLeft' ] - props[ 'sLeft' ] ) / _frames;
				$.extend( _props, { left: true } );
				break;
			case 'left%':
				if ( init || ( props.auto != undefined && props.auto == true ) ) {
					if ( props[ 'eLeft' ] == undefined ) props[ 'eLeft' ] = parseInt( pAni.el.css( 'left' ) );
					if ( props[ 'sLeft' ] == undefined ) props[ 'sLeft' ] = parseInt( pAni.el.css( 'left' ) );
				} else {
					if ( props[ 'sLeft' ] == undefined || props[ 'eLeft' ] == undefined ) {
						if ( window.console ) console.log( 'Parallax.extend() // sLeft -or- eLeft missing' );
						good = false;
					}
				}
				
				props.left = ( parseInt(props[ 'eLeft' ]) - parseInt( props[ 'sLeft' ] ) ) / _frames;
				$.extend( _props, { 'left%': true } );
				break;
			case 'opacity':
				if ( init || ( props.auto != undefined && props.auto == true ) ) {
					if ( props[ 'sOpacity' ] == undefined ) props[ 'sOpacity' ] = pAni.el.css( 'opacity' );
					if ( props[ 'eOpacity' ] == undefined ) props[ 'eOpacity' ] = pAni.el.css( 'opacity' );
				} else {
					if ( props[ 'sOpacity' ] == undefined || props[ 'eOpacity' ] == undefined ) {
						if ( window.console ) console.log( 'Parallax.extend() // sOpacity -or- eOpacity missing' );
						good = false;
					}
				}
				
				if ( good ) {
					props.opacity = ( props[ 'eOpacity' ] - props[ 'sOpacity' ] ) / _frames;
					$.extend( _props, { opacity: true } );
				}
				break;
			case 'top':
				var top = pAni.el.css( 'top' );
				
				
				if ( init ) {
					if ( left == 'auto' && ( props[ 'eTop' ] == undefined || props[ 'sTop' ] == undefined ) ) ParallaxUtils.error.autoPosition( pAni.ID );
					
					if ( props[ 'eTop' ] && typeof props[ 'eTop' ] == 'string' && props[ 'eTop' ][ 1 ] == '=' ) {
						var s = props[ 'eTop' ].split( '=' );
						
						if ( top != 'auto' ) {
							if ( s[0] == '-' ) props[ 'eTop' ] = parseInt( top ) - parseInt( s[1] );
							else props[ 'eTop' ] = parseInt( top ) + parseInt( s[1] );
						}
					}
					
				}
			
				if ( init || ( props.auto != undefined && props.auto == true ) ) {
					if ( top != 'auto' ) {
						if ( props[ 'sTop' ] == undefined ) props[ 'sTop' ] = parseInt( top );
						if ( props[ 'eTop' ] == undefined ) props[ 'eTop' ] = parseInt( top );
					}
				} else {
					/*if ( props[ 'sTop' ] == undefined || props[ 'eTop' ] == undefined ) {
						console.log( 'Parallax.extend() // sTop -or- eTop missing' );
						good = false;
					}*/
					if ( props[ 'sTop ' ] == undefined ) {
						if ( animation.start > pAni.end ) props[ 'sTop' ] = pAni.animation[ pAni.end ].top;
						else props[ 'sTop' ] = pAni.animation[ pAni.start ].top;
					} else if ( props[ 'eEnd'] == undefined ) {
						
					}
				}
				
				if ( good ) {
					props.top = ( props[ 'eTop' ] - props[ 'sTop' ] ) / _frames;
					$.extend( _props, { top: true } );
				}
				break;
			case 'top%':
				if ( init || ( props.auto != undefined && props.auto == true ) ) {
					if ( props[ 'sTop' ] == undefined ) props[ 'sTop' ] = parseInt( pAni.el.css( 'top' ) );
					if ( props[ 'eTop' ] == undefined ) props[ 'eTop' ] = parseInt( pAni.el.css( 'top' ) );
				} else {
					if ( props[ 'sTop' ] == undefined || props[ 'eTop' ] == undefined ) {
						if ( window.console ) console.log( 'Parallax.extend() // sTop -or- eTop missing' );
						good = false;
					}
					
					
				}
				
				if ( good ) {
					props.top = ( parseInt( props[ 'eTop' ] ) - parseInt( props[ 'sTop' ] ) ) / _frames;
					$.extend( _props, { 'top%': true } );
				}
				break;
			case 'width':
				if ( init || ( props.auto != undefined && props.auto == true ) ) {
					if ( props[ 'sWidth' ] == undefined ) props[ 'sWidth' ] = parseInt( pAni.el.width() );
					if ( props[ 'eWidth' ] == undefined ) props[ 'eWidth' ] = parseInt( pAni.el.width() );
				} else {
					if ( props[ 'sWidth' ] == undefined || props[ 'eWidth' ] == undefined ) {
						if ( window.console ) console.log( 'Parallax.extend() // sWidth -or- eWidth missing' );
						good = false;
					}
				}
				
				if ( good ) {
					props.width = ( props[ 'eWidth' ] - props[ 'sWidth' ] ) / _frames;
					$.extend( _props, { width: true } );
				}
				break;
			case 'height':
				if ( init || ( props.auto != undefined && props.auto == true ) ) {
					if ( props[ 'sHeight' ] == undefined ) props[ 'sHeight' ] = parseInt( pAni.el.height() );
					if ( props[ 'eHeight' ] == undefined ) props[ 'eHeight' ] = parseInt( pAni.el.height() );
				} else {
					if ( props[ 'sHeight' ] == undefined || props[ 'eHeight' ] == undefined ) {
						if ( window.console ) console.log( 'Parallax.extend() // sHeight -or- eHeight missing' );
						good = false;
					}
				}
				
				if ( good ) {
					props.height = ( props[ 'eHeight' ] - props[ 'sHeight' ] ) / _frames;
					$.extend( _props, { height: true } );
				}
				break;
			case 'bottom':
				if ( init || ( props.auto != undefined && props.auto == true ) ) {
					if ( props[ 'sBottom' ] == undefined ) props[ 'sBottom' ] = parseInt( pAni.el.css( 'bottom' ) );
					if ( props[ 'eBottom' ] == undefined ) props[ 'eBottom' ] = parseInt( pAni.el.css( 'bottom' ) );
				} else {
					if ( props[ 'sBottom' ] == undefined || props[ 'eBottom' ] == undefined ) {
						if ( window.console ) console.log( 'Parallax.extend() // sBottom -or- eBottom missing' );
						good = false;
					}
				}
				
				if ( good ) {
					props.bottom = ( props[ 'eBottom' ] - props[ 'sBottom' ] ) / _frames;
					$.extend( _props, { bottom: true } );
				}
				break;
			case 'right':
				if ( init || ( props.auto != undefined && props.auto == true ) ) {
					if ( props[ 'sRight' ] == undefined ) props[ 'sRight' ] = parseInt( pAni.el.css( 'right' ) );
					if ( props[ 'eRight' ] == undefined ) props[ 'eRight' ] = parseInt( pAni.el.css( 'right' ) );
				} else {
					if ( props[ 'sRight' ] == undefined || props[ 'eRight' ] == undefined ) {
						if ( window.console ) console.log( 'Parallax.extend() // sRight -or- eRight missing' );
						good = false;
					}
				}
				
				if ( good ) {
					props.right = ( props[ 'eRight' ] - props[ 'sRight' ] ) / _frames;
					$.extend( _props, { right: true } );
				}
				break;
		}
	}
	
	return [ _props, props ];
	
}

function ParallaxSection( name, options ) {
	
	this.name			= name;
	this.options		= options;
	
	this.onEnter		= null;
	this.onEnterParams	= null;
	
	this.onExit			= null;
	this.onExitParams	= null;
	
	this.onStart		= null;
	this.onStartParams	= null;
	
	this.onEnd			= null;
	this.onEndParams	= null;
	
	this.onProgress		= null;
	
	this.scrollStart	= null;
	this.scroll			= null;
	
	this.padding		= null;
	this.percentA		= null;
	this.percentB		= null;
	
	this.scrollPercent	= null;
	
	this.init();
}

ParallaxSection.prototype.init = function() {
	
	if ( this.options ) $.extend( this, this.options );
	
	parallax.addSection( this );
}