/*	
		============================================================================
 		*
		*	_.Mobile.Scrollios
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	Custom Scrolling for Mobile ( specifically iOS )
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

//------------------------------------------------------------------- _.Mobile.Scrollios

var _ = _ ? _ : {};
_.Mobile = _.Mobile ? _.Mobile : {};

if ( !_.Mobile.Scrollios ) {
	_.Mobile.Scrollios = function( divID, options ) {
		
		this._divID 		= divID;
		
		this.duration 		= 2000;
		this.speed 			= 4;
		this.distance 		= 6;
		
		this.stylesID		= 'creatologist-scrollios';
		
		
		this.SCROLLBAR = {
			ID						: null,
			parentID				: null,
			
			style : {
				width				: 4,
				height				: null,
				
				right				: 3,
				top					: 0,
				'margin-top'		: 5,
				'margin-bottom'		: 5,
				border				: 'none',
				'background-color'	: 'black',
				opacity				: 1
			},
			
			BROWSER	: {
				status_bar 			: 20,
				landscape_extra		: 0 /* 60 */
			},
			
			height					: null,
			total_height			: null,
			scroll_height			: null,
			
			portrait				: {
				ready				: false,
				height				: null,
				total_height		: null,
				scroll_height		: null,
				sb_height			: null
			},
			
			landscape				: {
				ready				: false,
				height				: null,
				total_height		: null,
				scroll_height		: null,
				sb_height			: null
			},
			
			init_orientation		: null,
			sb_height_diff			: 0,
			disabled				: false,
			
			show : function() {
				$( this.ID ).stop().animate( { opacity: this.style.opacity }, { queue: false, duration: 200, easing: 'easeOutQuad' } );
			},
			
			hide : function() {
				//console.log( 'hide' );
				$( this.ID ).stop().animate( { opacity: 0 }, { duration: 600, easing: 'easeOutQuad' } );
			},
			
			move : function() {
				if ( this.disabled ) return;
				var _st = $( this.parentID ).scrollTop();
				//console.log( _st );
				if ( _st == 0 ) {
					$( this.parentID ).stop();
					$( this.ID ).css( { top: 0 } );
					this.hide();
					return;
				} else if ( _st >= this.scroll_height ) {
					$( this.parentID ).stop();
					$( this.ID ).css( { top: this.max_pos } );
					this.hide();
					return;
				}
				
				var _per = _st / this.scroll_height;
				_st += ( _per * this.BROWSER.landscape_extra );
				var pos = _st + ( _per * this.total_height );
				
				//console.log( _st + ' / ' + this.scroll_height );
				//console.log( $( this.parentID )[0].scrollHeight + ' / ' + this.scroll_height );
				
				//console.log( this.max_pos );
				pos -= ( _per * ( this.height + ( this.sb_height_diff * .5 ) ) );
				pos += ( _per * ( this.BROWSER.status_bar ) );
				//console.log( parseInt( pos ) ) ;
				
				
				if ( _st > this.scroll_height ) {
					$( this.parentID ).scrollTop( this.scroll_height );
					pos = this.max_pos;
				}
				
				if ( pos >= this.max_pos ) {
					$( this.ID ).css( { top: this.max_pos } );
					$( this.parentID ).stop();
					this.hide();
					return;
				}
				
				
				$( this.ID ).css( { top: pos } );
			},
			
			update : function( reset ) {
				var _curOrientation = 'portrait';
				if ( window.orientation == 90 || window.orientation == -90 ) _curOrientation = 'landscape';
				if ( !this.init_orientation ) {
					this.init_orientation = _curOrientation;
				} else {
					if ( this.init_orientation == 'portrait' && _curOrientation == 'landscape' ) this.BROWSER.landscape_extra = 60; 
					else this.BROWSER.landscape_extra = 0;
				}
				/*if ( window.orientation != 90 && window.orientation != -90 ) {
					if ( this.portrait.ready ) {
						this.height = this.portrait.height;
						this.total_height = this.portrait.total_height;
						this.scroll_height = this.portrait.scroll_height;
						$( this.ID ).css( { height: this.portrait.sb_height } );
						return;
					}
				} else {
					if ( this.landscape.ready ) {
						this.height = this.landscape.height;
						this.total_height = this.landscape.total_height;
						this.scroll_height = this.landscape.scroll_height;
						$( this.ID ).css( { height: this.landscape.sb_height } );
						return;
					}
				}*/
				
				var _height = $( this.parentID ).height();
				var _sh = $( this.parentID )[0].scrollHeight;
				this.height = ( _height / _sh ) * _height;
				
				
				this.total_height = $( this.parentID ).height();
				this.scroll_height = _sh;
				
				if ( this.init_orientation == 'portrait' && _curOrientation == 'landscape' ) {
					this.total_height -= 60;
				}
				
				var _diff = this.total_height + ( this.BROWSER.status_bar * .5 );
				this.scroll_height -= _diff;
				var sb_min_height = 50;
				var sb_height = this.height - this.BROWSER.status_bar;
				
				if ( sb_height > .8 * this.total_height ) {
					this.disabled = true;
					$( this.ID ).css( 'display', 'none' );
				} else {
					this.disabled = false;
					$( this.ID ).css( 'display', 'block' );
				}
				
				if ( this._curOrientation == 'portrait' ) {
					//$( this.ID ).css( { height: this.height - this.BROWSER.status_bar } );
					this.max_pos = this.scroll_height + this.total_height - this.height + this.BROWSER.status_bar;
					
					if ( sb_height < 50 ) {
						this.height = 50;
						$( this.ID ).css( { height: 50 } );
						this.max_pos -= ( 50 - sb_height );
						this.sb_height_diff = 50 - sb_height;
					} else {
						$( this.ID ).css( { height: this.height - this.BROWSER.status_bar - 10 } );
						this.sb_height_diff = 0;
					}
				} else {
					this.max_pos = this.scroll_height + this.total_height - this.height + this.BROWSER.status_bar;
					
					if ( sb_height < 50 ) {
						this.height = 50;
						$( this.ID ).css( { height: 50 } );
						this.max_pos -= ( 50 - sb_height );
						this.sb_height_diff = 50 - sb_height;
					} else {
						$( this.ID ).css( { height: this.height - this.BROWSER.status_bar - 10 } );
						this.sb_height_diff = 0;
					}
					
					
				}
				
				
				
				
				if ( window.orientation != 90 && window.orientation != -90 ) {
					this.portrait.height = this.height;
					this.portrait.total_height = this.total_height;
					this.portrait.scroll_height = this.scroll_height;
					this.portrait.sb_height = this.height - this.BROWSER.status_bar;
					this.portrait.ready = true;
				} else {
					
				}
				return;
				console.log( this.height );
				console.log( this.total_height );
				console.log( this.scroll_height );
			}
			
			
		};
		
		this.TOUCH = {
			startY		: null,
			endY		: null,
			prevY		: null,
			initY		: null,
			
			startX		: null,
			endX		: null,
			prevX		: null,
			initX		: null,
			
			x			: null,
			y			: null,
			
			differenceY : function() {
				return this.endY - this.startY;
			},
			
			distanceY : function() {
				return this.y - this.initY;
			},
			
			startTime	: null,
			endTime		: null,
			
			timeDifference : function() {
				return this.endTime - this.startTime;
			},
			
			reset		: function() {
				this.startY = this.endY = this.prevY = this.initY = null;
				
			}
		};
		
		this.SCROLL = {
			start		: null,
			end			: null,
			
			difference : function() {
				return this.end - this.start;
			}
		};
		
		this.init( options );
		
		return this;
		
	};
	
	_.Mobile.Scrollios.prototype.init = function( options ) {
		
		if ( !__.$( '_.Mobile.Scrollios' ) ) return;
		
		var scrollbar = false;
		
		if ( options != undefined ) {
			if ( options.duration != undefined ) this.duration = options.duration;
			if ( options.speed != undefined ) this.speed = options.speed;
			if ( options.distance != undefined ) this.distance = options.distance;
			if ( options.scrollbar != undefined ) {
				if ( typeof options.scrollbar == 'object' ) {
					this.addScrollbar( options.scrollbar );
					scrollbar = true;
				} else if ( typeof options.scrollbar == 'string' ) {
					this.SCROLLBAR.parentID = this._divID;
					this.SCROLLBAR.ID = options.scrollbar;
					this.SCROLLBAR.update();
					scrollbar = true;
				} else {
					if ( window.console ) console.log( '_.Mobile.Scrollios !! scrollbar type not valid' );
				}
			}
		}
		
		if ( !scrollbar ) this.addScrollbar();
		$( 'body' ).bind( 'orientationchange', $.proxy( function( e ) {
			this.handleEvent( e );
		}, this ));
		
		$( this._divID ).bind( 'touchmove', $.proxy( function( e ) {
			this.handleEvent( e );
		}, this ));
		
		$( this._divID ).bind( 'touchstart', $.proxy( function( e ) {
			this.handleEvent( e );
		}, this ));
		
		$( this._divID ).bind( 'touchend', $.proxy( function( e ) {
			this.handleEvent( e );
		}, this ));
		
		$( this._divID ).bind( 'touchcancel', $.proxy( function( e ) {
			this.handleEvent( e );
		}), this );
	};
	
	_.Mobile.Scrollios.prototype.addScrollbar = function( options ) {
		if ( $( '#' + this.stylesID ).length == 0 ) {
			$( 'head' ).append( '<style id="' + this.stylesID + '" type="text/css"></style>' );	
		}
		
		var id = 'scrollios-' + this._divID[1] + '-' + Number( new Date() );
		this.SCROLLBAR.ID = '#' + id;
		this.SCROLLBAR.parentID = this._divID;
		
		var css = '#' + id + ' {';
		
		if ( options != undefined ) {
			if ( options[ 'background-color' ] != undefined ) this.SCROLLBAR.style[ 'background-color' ] = options[ 'background-color' ];
			if ( options[ 'margin-top' ] != undefined ) this.SCROLLBAR.style[ 'margin-top' ] = options[ 'margin-top' ];
			if ( options[ 'margin-bottom' ] != undefined ) this.SCROLLBAR.style[ 'margin-bottom' ] = options[ 'margin-bottom' ];
			if ( options.width != undefined ) this.SCROLLBAR.style.width = options.width;
			if ( options.right != undefined ) this.SCROLLBAR.style.right = options.right;
			if ( options.left != undefined ) this.SCROLLBAR.style.left = options.left;
			if ( options.border != undefined ) this.SCROLLBAR.style.border = options.border;
			if ( options.opacity != undefined ) this.SCROLLBAR.style.opacity = options.opacity;	
		}
		
		css += 'position: absolute!important;';
		css += 'z-index: 6;';
		css += ( 'width: ' + this.SCROLLBAR.style.width + 'px;' );
		css += ( 'opacity: 0;' );
		css += ( 'margin-top: ' + this.SCROLLBAR.style[ 'margin-top' ] + 'px;' );
		css += ( 'margin-bottom: ' + this.SCROLLBAR.style[ 'margin-bottom' ] + 'px;' );
		css += ( 'top: ' + this.SCROLLBAR.style.top + 'px;' );
		if ( this.SCROLLBAR.style.left != undefined ) css += ( 'left: ' + this.SCROLLBAR.style.left + 'px;' );
		else css += ( 'right: ' + this.SCROLLBAR.style.right + 'px;' );
		css += ( 'background-color: ' + this.SCROLLBAR.style['background-color'] + ';' );
		css += ( 'border: ' + this.SCROLLBAR.style.border + ';' );
		css += '}';
		
		$( this._divID ).append( '<div id="' + id + '"></div>' );
		
		$( '#' + this.stylesID ).append( css );
		
		this.SCROLLBAR.update();
	};
	
	_.Mobile.Scrollios.prototype.scrollTo = function( pos, duration ) {
		if ( duration != undefined ) {
			$( this._divID ).stop().animate( { scrollTop: pos }, { duration: duration, easing: 'easeOutQuad' } );
		} else {
			$( this._divID ).scrollTop( pos );
		}
	}
	
	_.Mobile.Scrollios.prototype.handleEvent = function( e ) {
		switch( e.type ) {
			case 'touchstart':
				//e.preventDefault();
				this.SCROLL.start = $( this._divID ).scrollTop();
				this.TOUCH.startY = this.TOUCH.initY = this.TOUCH.endY = this.TOUCH.y = e.originalEvent.touches[0].pageY;
				this.TOUCH.startTime = Number( new Date() );
				this.TOUCH.x = e.originalEvent.touches[0].pageX;
				
				
				this.onScrollStart();
				if ( $( window ).scrollTop() != 1 ) {
					window.scrollTo(0, 1);
				}
				
				this.SCROLLBAR.show();
				break;
			case 'touchmove':
				e.preventDefault();
				this.TOUCH.endY = this.TOUCH.y = e.originalEvent.touches[0].pageY;
				this.SCROLL.end = this.SCROLL.start - this.TOUCH.distanceY();
				this.TOUCH.endTime = Number( new Date() );
				if ( ( this.TOUCH.timeDifference() > 200 ) && Math.abs( this.TOUCH.prevY - this.TOUCH.endY ) < 5 ) {
					this.TOUCH.startTime = Number( new Date() );
					this.TOUCH.startY = this.TOUCH.initY = this.TOUCH.endY = this.TOUCH.y = e.originalEvent.touches[0].pageY;
					this.SCROLL.start = $( this._divID ).scrollTop();
				}
				this.TOUCH.prevY = this.TOUCH.endY;
				
				this.onScrollUpdate();
				break;
			case 'touchend':
				this.TOUCH.endTime = Number( new Date() );
				this.onScrollEnd();
				//e.preventDefault();
				break;
			case 'orientationchange':
				this.scrollTo( 0 );
				this.SCROLLBAR.update( );
				break;
			default:
		}
	}
	
	_.Mobile.Scrollios.prototype.onScrollStart = function() {
		
		$( this._divID ).clearQueue();
		$( this._divID ).stop();
		this.SCROLLBAR.move();
	};
	
	_.Mobile.Scrollios.prototype.onScrollUpdate	= function() {
		if ( this.SCROLL.end >= this.SCROLLBAR.scroll_height ) return;
		if ( this.SCROLL.end <= 0 ) return;
		$( this._divID ).scrollTop( this.SCROLL.end );
		this.SCROLLBAR.move();
	};
	
	_.Mobile.Scrollios.prototype.onScrollEnd = function() {
		var _diff = this.TOUCH.differenceY();
		var _timeDiff = this.TOUCH.timeDifference();
		var _diffMultiplier = 1;
		
		if ( _timeDiff > 300 ) _timeDiff = 300;
		_timeDiff = 300 - _timeDiff;
		_diffMultiplier += ( _timeDiff * .001 ) * this.speed;
		_diffMultiplier *= this.distance;
		
		if ( Math.abs( _diff ) > 15 ) {
			$( this._divID ).stop().animate( { scrollTop: this.SCROLL.end + ( this.SCROLL.difference() * _diffMultiplier ) },
				{ duration: this.duration, easing: 'easeOutQuad', step: $.proxy( function( now ) { this.SCROLLBAR.move(); }, this ),
				complete: $.proxy( function() { this.SCROLLBAR.hide(); }, this ) }
			);
		} else {
			this.SCROLLBAR.hide();
		}
		
		this.TOUCH.reset();
	}
	
	_.Mobile.Scrollios.prototype.onScrollCancel = function() {
		this.TOUCH.reset();
		this.SCROLLBAR.hide();
	}
	
	
	
	
	
}