/*	
		============================================================================
 		*
		*	superAnimate
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	Extension to jQuery's animate()
 		* 	Used by AnimationTimeline and CharacterRig
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*   created         >>  11 April 2011
		*   updated         >>  22 June 2012
		*
		============================================================================
*/


//----------------------------------------------------------------------------------------------------------------------------------

(function($){
    $.fn.extend({ 
    	
        superAnimate: function( prop, speed, options, timelineOptions ) {
        	
        	/*var defaults = {
        		
        	};*/
        	
        	//console.log( 'this.selector: ' + this.selector);
        	
        	//var _timelineCount = null;
        	
        	//if ( prop.path ) { console.log( prop.path ); };
        	
        	if ( typeof speed == 'number' ) {
        		speed = { duration: speed };
        	}
        	
        	if ( prop.width && typeof prop.width == 'string' && prop.width.substr( prop.width.length - 1, 1 ) == '%' ) {
        		_percent = parseInt( prop.width.substr( 0, prop.width.length - 1 ) );
        		
        		_newValues = Utils.scaledValues( { percent: _percent, el: this.selector } );
        		
        		prop.width = _newValues.width;
        		prop.height = _newValues.height;
        	} else if ( prop.height && typeof prop.height == 'string' && prop.height.substr( prop.height.length - 1, 1 ) == '%' ) {
        		_percent = parseInt( prop.height.substr( 0, prop.height.length - 1 ) );
        		
        		_newValues = Utils.scaledValues( { percent: _percent, el: this.selector } );
        		
        		prop.width = _newValues.width;
        		prop.height = _newValues.height;
        	}
        	
        	
        	
    		if ( speed.path ) {
    			
    			if ( speed.path.start.x == undefined ) speed.path.start.x = parseInt( $( this.selector ).css( 'left' ) );
    			if ( speed.path.start.y == undefined ) speed.path.start.y = parseInt( $( this.selector ).css( 'top' ) );
    			
    			_obj = $( this.selector );
    			
    			if ( speed.path.end.x == undefined ) {
    				if ( prop.left != undefined ) {
    					
    					if ( typeof prop.left == 'number' ) speed.path.end.x = prop.left;
    					else {
    						
    						_oldLeft = parseInt( _obj.css( 'left' ) );
    						_firstTwo = prop.left.substr( 0, 2 );
							if ( _firstTwo == '+=' ) {
								_newLeft = _oldLeft - parseInt( prop.left.substr( 2, prop.left.length ) );
							} else if ( _firstTwo == '-=' ) {
								_newLeft = _oldLeft + parseInt( prop.left.substr( 2, prop.left.length ) );
							}
							speed.path.end.x = _newLeft;
    						
    					}
    				} else speed.path.end.x = parseInt( $( this.selector ).css( 'left' ) );
    			}
    			if ( speed.path.end.y == undefined ) {
    				if ( prop.top != undefined ) {
    					if ( typeof prop.top == 'number' ) speed.path.end.y = prop.top;
    					else {
    						_oldTop = parseInt( _obj.css( 'top' ) );
    						_firstTwo = prop.top.substr( 0, 2 );
							if ( _firstTwo == '+=' ) {
								_newTop = _oldTop + parseInt( prop.top.substr( 2, prop.top.length ) );
							} else if ( _firstTwo == '-=' ) {
								_newTop = _oldTop - parseInt( prop.top.substr( 2, prop.top.length ) );
							}
							speed.path.end.y = _newTop;
    					}
    				} else speed.path.end.y = parseInt( $( this.selector ).css( 'top' ) );
    			}
    			
    			//console.log( parseInt( $( this.selector ).css( 'left' ).split('px')[0] ) );
    			
    			//speed.path.end.x = speed.path.end.x - parseInt( $( this.selector ).css( 'left' ).split('px')[0] );
    			//speed.path.end.y = speed.path.end.y - parseInt( $( this.selector ).css( 'top' ).split('px')[0] );
    			
    			
    			if ( speed.target ) {
    				switch( speed.target ) {
    					case 'center':
    						_obj = $( this.selector );
			        		if ( !prop.width ) _width = _obj.width();
			        		else _width = prop.width;
			        		
			        		if ( !prop.height ) _height = _obj.height();
			        		else _height = prop.height;
			        		
			        		speed.path.end.x -= ( _width >> 1 );
			        		speed.path.end.y -= ( _height >> 1);
			        		
			        	break;
    				}
    			}
    			
    			
    			//console.log( speed.path );
    			
    			prop.path = new $.path.bezier( speed.path );
    			
    			//console.log( prop.path );
    		}
    		
    		if ( speed.scaleCenter && ( prop.width || prop.height ) ) {
    			
    			//console.log( prop.width );
    			//console.log( prop.height );
    			
        		_obj = $( this.selector );
        		
        		_oldWidth = _obj.width();
        		_oldHeight = _obj.height();
        		_oldLeft = parseInt( _obj.css( 'left' ) );
        		_oldTop = parseInt( _obj.css( 'top' ) );
        		
        		if ( prop.left ) {
        			if ( typeof prop.left != 'string' ) {
        				_oldLeft = prop.left;
        			} else {
        				_firstTwo = prop.left.substr( 0, 2 );
						if ( _firstTwo == '+=' ) {
							_oldLeft = _oldLeft - parseInt( prop.left.substr( 2, prop.left.length ) );
						} else if ( _firstTwo == '-=' ) {
							_oldLeft = _oldLeft + parseInt( prop.left.substr( 2, prop.left.length ) );
						}
        			}
        		}
        		
        		if ( prop.top ) {
        			if ( typeof prop.top != 'string' ) {
        				_oldTop = prop.top;
        			} else {
        				_firstTwo = prop.top.substr( 0, 2 );
						if ( _firstTwo == '+=' ) {
							_oldTop = _oldTop + parseInt( prop.top.substr( 2, prop.top.length ) );
						} else if ( _firstTwo == '-=' ) {
							_oldTop = _oldTop - parseInt( prop.top.substr( 2, prop.top.length ) );
						}
        			}
        		}
        		
        		if ( prop.width != undefined && prop.height != undefined) {
        			_newLeft = _oldLeft + ( ( _oldWidth - prop.width ) >> 1 );
	        		_newTop = _oldTop + ( ( _oldHeight - prop.height ) >> 1 );
        			
        		} else {
        			if ( prop.width != undefined ) {
	        			prop.height = Utils.scaledValues( { el: this.selector, width: prop.width } ).height;
	        			_newLeft = _oldLeft + ( ( _oldWidth - prop.width ) >> 1 );
	        			_newTop = _oldTop + ( ( _oldHeight - prop.height ) >> 1 );
	        		} else if ( prop.height != undefined ) {
	        			prop.width = Utils.scaledValues( { el: this.selector, height: prop.height } ).width;
	        			_newTop = _oldTop + ( ( _oldHeight - prop.height ) >> 1 );
	        			_newLeft = _oldLeft + ( ( _oldWidth - prop.width ) >> 1 );
	        		}
        		}
        		
        		
        		
        		
        		
        		//prop.left = _newLeft;
        		//prop.top = _newTop;
        		
        		if ( prop.left ) {
	        		if ( typeof prop.left != 'string' ) {
						prop.left -= _newLeft;
					} else {
						_firstTwo = prop.left.substr( 0, 2 );
						if ( _firstTwo == '+=' || _firstTwo == '-=' ) {
							prop.left = parseInt( prop.left.substr( 2, prop.left.length - 2 ) ) - ( prop.width >> 1 );
							prop.left = _firstTwo + prop.left;
						}
					}
				} else prop.left = _newLeft;
				
				
				if ( prop.top ) {
					if ( typeof prop.top != 'string' ) {
						prop.top = _newTop;
					} else {
						_firstTwo = prop.top.substr( 0, 2 );
						if ( _firstTwo == '+=' || _firstTwo == '-=' ) {
							prop.top = parseInt( prop.top.substr( 2, prop.top.length - 2 ) ) - ( prop.height >> 1 );
							prop.top = _firstTwo + prop.top;
						}
					}
				} else prop.top = _newTop;
    							
        		
        		
        		//console.log( 'prop.left: ' + prop.left + ', prop.top: ' + prop.top );
        		//console.log( 'prop.width: ' + prop.width + ', prop.height: ' + prop.height );
    		}
    		
    		if ( speed.fullImage ) {
    			
				$( this.selector ).find('img').map(function(){
    				//console.log( );
    				
    				_style = $( this).attr( 'style' );
    				
    				if ( _style == undefined ) {
    					$( this ).attr( 'style' , 'width: 100%; height: 100%;' );
    				} else {
    					$( this ).attr( 'style' ,  _style + ' width: 100%; height: 100%;' );
    				}
    				
              	});
              	
    		}
    		
    		if ( speed.target && !speed.path ) {
    			switch ( speed.target ) {
    				
    				case 'center':
    					if ( prop.width || prop.height ) {
    						
    						if ( prop.left && prop.width) {
    							
    							if ( typeof prop.left != 'string' ) {
    								prop.left -= ( prop.width >> 1 );
    							} else {
    								_firstTwo = prop.left.substr( 0, 2 );
    								if ( _firstTwo == '+=' || _firstTwo == '-=' ) {
    									prop.left = parseInt( prop.left.substr( 2, prop.left.length ) ) - ( prop.width >> 1 );
    									if ( prop.left < 0 ) {
    										prop.left *= -1;
    										if ( _firstTwo == '+=' ) _firstTwo = '-=';
    										else _firstTwo = '+=';
    									}
    									prop.left = _firstTwo + prop.left;
    								}
    							}
    							
    						} else if ( prop.left && !prop.width ){
    							
    							_obj = $( this.selector );
				        		_width = _obj.width();
    							
    							if ( typeof prop.left != 'string' ) {
    								prop.left -= ( _width >> 1 );
    							} else {
    								_firstTwo = prop.left.substr( 0, 2 );
    								if ( _firstTwo == '+=' || _firstTwo == '-=' ) {
    									prop.left = parseInt( prop.left.substr( 2, prop.left.length ) ) - ( _width >> 1 );
    									if ( prop.left < 0 ) {
    										prop.left *= -1;
    										if ( _firstTwo == '+=' ) _firstTwo = '-=';
    										else _firstTwo = '+=';
    									}
    									prop.left = _firstTwo + prop.left;
    								}
    							}
    							
    						}
    						
    						if ( prop.top && prop.height ) {
    							
    							if ( typeof prop.top != 'string' ) {
    								prop.top -= ( prop.height >> 1 );
    							} else {
    								_firstTwo = prop.top.substr( 0, 2 );
    								if ( _firstTwo == '+=' || _firstTwo == '-=' ) {
    									prop.top = parseInt( prop.top.substr( 2, prop.top.length ) ) - ( prop.height >> 1 );
    									if ( prop.top < 0 ) {
    										prop.left *= -1;
    										if ( _firstTwo == '+=' ) _firstTwo = '-=';
    										else _firstTwo = '+=';
    									}
    									prop.top = _firstTwo + prop.top;
    								}
    							}
    							
    						} else if ( prop.top && !prop.height ) {
    							
    							_obj = $( this.selector );
				        		_height = _obj.height();
    							
    							if ( typeof prop.top != 'string' ) {
    								prop.top -= ( _height >> 1 );
    							} else {
    								_firstTwo = prop.top.substr( 0, 2 );
    								if ( _firstTwo == '+=' || _firstTwo == '-=' ) {
    									prop.top = parseInt( prop.top.substr( 2, prop.top.length ) ) - ( _height >> 1 );
    									if ( prop.top < 0 ) {
    										prop.left *= -1;
    										if ( _firstTwo == '+=' ) _firstTwo = '-=';
    										else _firstTwo = '+=';
    									}
    									prop.top = _firstTwo + prop.top;
    								}
    							}
    							
    						}
    						
    						
    						
    					} else {
    						_obj = $( this.selector );
			        		_oldWidth = _obj.width();
			        		_oldHeight = _obj.height();
			        		
			        		if ( prop.left ) {
    							
    							if ( typeof prop.left != 'string' ) {
    								prop.left -= ( _oldWidth >> 1 );
    							} else {
    								_firstTwo = prop.left.substr( 0, 2 );
    								if ( _firstTwo == '+=' || _firstTwo == '-=' ) {
    									prop.left = parseInt( prop.left.substr( 2, prop.left.length ) ) - ( _oldWidth >> 1 );
    									prop.left = _firstTwo + prop.left;
    								}
    							}
    							
    						}
    						
    						if ( prop.top ) {
    							
    							if ( typeof prop.top != 'string' ) {
    								if ( prop.height ) prop.top -= ( prop.height >> 1 );
    							} else {
    								_firstTwo = prop.top.substr( 0, 2 );
    								if ( _firstTwo == '+=' || _firstTwo == '-=' ) {
    									prop.top = parseInt( prop.top.substr( 2, prop.top.length ) ) + ( _oldHeight >> 1 );
    									prop.top = _firstTwo + prop.top;
    								}
    							}
    							
    						}
    					}
    					break;
    				
    			}
    		}
        	
        	
        	
        	var _onCompleteDone = false;
        	var _animationTimeline;
        	var _store = false;
        	var _storeNum = null;
        	
        	if ( options == undefined ) options = [];
        	else {
        		if ( typeof options == 'function' ) {
        			if ( !speed.complete ) speed.complete = options;
        			else {
        				var _oldFunc = speed.complete;
        				speed.complete = function() {
        					_oldFunc();
        					options();
        					
        				}
        			}
        		}
        		
        		for ( var z = options.length; z--; ) {
        			if ( options[z].store ) { 
        				_store = options[z].store;
        				_storeNum = z;
        				//console.log( 'this.selector (store): ' + this.selector);
        			}
        		}
        	}
        	
        	var _newID;
        	
        	if ( _store && _store.storing ) {
        		options.splice( _storeNum, 1 );
        		//_timelineCount = _store.storeCount;
        		
        		_newID = this.selector.toString();
        		
        		_newID = _newID.substr( _newID.length - 6, 6 );
        		//.substr( this.selector.length - 6, this.selector.length);
        		
        		//console.log( _newID );
        		
        		if ( _newID != '-store' ) {
        			_newID = this.selector.toString() + '-store';
        			this.selector = _newID;
        			
        			//console.log( 'this.selector (_newID): ' + this.selector);
        		} else {
        			
        		}
        		
        		/*if ( this.selector.substr( this.selector.length - 6, this.selector.length) != '-store' ) {
        			this.selector = this.selector + '-store';
        			console.log( 'wtf' );
        		}*/
        		
        	} else if ( _store && !_store.storing ) _store = null;
        	
        	var _superPercentToNum = function( percent, speed ) {
				var num;
				
				num = percent / 100;
				num = num * ( speed / 16.666 );
				num = Math.ceil( num );
				//console.log( num );
				return num;
			}
			
        	if ( timelineOptions ) {
        		
        		var timelineComplete;
        		
        		if ( !_store ) {
        			_animationTimeline = timelineOptions.timeline;
	        		timelineComplete = function() {
		        		_animationTimeline.ready();
		        	}
        		}
        		else {
        			//_animationTimeline = _store;
	        		/*timelineComplete = function() {
		        		_animationTimeline.storeReady();
		        	}*/
		        	timelineComplete = function() { _store.storeReady( this.selector, count); _onCompleteDone = true; };
		        }
        		
        		
        		
        		
        		
        		if ( timelineOptions.end === true ) {
        			timelineOptions.onComplete = true;
        		} else if ( typeof timelineOptions.end == 'number' ) {
        			timelineOptions.end = ( timelineOptions.end / speed.duration ) * 100;
        			timelineOptions.onComplete = false;
        		} else if ( typeof timelineOptions.end == 'string' ) {
        			timelineOptions.end = parseInt( timelineOptions.end.split('%')[0] );
        			timelineOptions.onComplete = false;
        		}
        		
        		if ( timelineOptions.onComplete == true ) {
        			if ( speed.complete ) {
	        			var oldComplete = speed.complete;
		        		speed.complete = function() {
		        			timelineComplete();
		        			oldComplete();
		        		}
		        	} else {
		        		speed.complete = timelineComplete;
		        		
		        	}
	        	} else {
	        		options.push( { percent: timelineOptions.end, onPercent: timelineComplete } );
	        	}
	        	
	        	speed.queue = false;
	        	
        	}
        	
        	for ( var i = options.length; i--; ) {
        		options[i].count = _superPercentToNum( options[i].percent , speed.duration );
        		
        	}
        	
        	
        	var count = 0;
        	
        	var checkFunc = function( now, fx ) {
        		if ( !fx ) return;
        		//console.log( fx.elem.id + ' ' + fx.prop + ': ' + now );
        		//console.log( fx.elem );
        		
        		//if ( fx.elem.id  == 'console-store' && fx.prop == 'path' ) console.log(  fx.elem.style[ 'top' ] );
        		
        		//console.log( fx.elem.id );
        		if ( fx.prop == '_superDuper' && _store && !_onCompleteDone ) {
        			_store.ultimateCount++;
        		}
        		
        		if ( _store && fx.prop != '_super'  && fx.prop != '_superDuper') {
        			if ( fx.prop == 'path' ) {
        				_store.storeAnimationValues( fx.elem.id, 'left', fx.elem.style[ 'left' ], count );
        				_store.storeAnimationValues( fx.elem.id, 'top', fx.elem.style[ 'top' ], count );
        			}
        			else _store.storeAnimationValues( fx.elem.id, fx.prop, now, count );
        		}
        		
        		//if ( _store && fx.prop != '_super' &&  _timelineNext ) _store.storeAnimationValues( fx.elem.id, fx.prop, now, count, _timelineCount + count );
        		
        		if ( fx.prop == '_super' ) {
        			if ( _store && _store.animationStored ) {
        				_store.ultimateCount++;
        			}
        			//console.log( now );
        			count++;
        			//console.log( count )
        			for ( var i = options.length; i--; ) {
        				if ( count == options[i].count ) options[i].onPercent();
        			}
        			
        			
        		}
        		
        		
        		
        		
        		
        	}
        	
        	if ( speed.step ) {
        		var oldFunc = speed.step;
        		speed.step = function() {
        			checkFunc();
        			oldFunc();
        		}
        	} else {
        		speed.step = checkFunc;
        		
        	}
        	
        	/*if ( _animationTimeline ) { 
	        	if ( speed.complete ) {
	        		
	        		
	        	} else {
	        		
	        	}
        	}*/
        	
        	prop = $.extend( { _super: 0 }, prop );
        	
        	//var speed = $.extend( options, speed );
        	
        	//if ( _store ) console.log( speed );
        	
        	//console.log( this );
        	
        	_this = this;
        	
        	if ( _store ) {
        		_this = $( this.selector );
        		
        		/*this.context = $( this.selector ).context;
        		this.__proto__ = $( this.selector ).__proto;*/
        	}
        	
        	return this.each( function() {
        		if ( speed.complete ) {
        			if ( speed.delay ) $( _this ).delay( speed.delay ).animate( prop, speed, speed.complete );
        			else $(_this).animate( prop, speed, speed.complete );
        		} else {
        			if ( speed.delay ) $( _this ).delay( speed.delay ).animate( prop, speed );
        			else $(_this).animate( prop, speed );
        		}
        		
        		
        	});
        	
        	
        	
        }
    });
    
    var _e = document.createElement("canvas").width
	 
	 $.fn.cssRotate = function(d) {  
		    return this.css({
		  '-moz-transform':'rotate('+d+'deg)',
		  '-webkit-transform':'rotate('+d+'deg)',
		  '-o-transform':'rotate('+d+'deg)',
		  '-ms-transform':'rotate('+d+'deg)'
		 }).prop("rotate", _e ? d : null)
	 }; 
	 
	 /* Doesn't stick -- reverts once another animation happens
		$.fn.cssRotateY = function(d) {
		    return this.css({
		  '-moz-transform':'rotateY('+d+'deg)',
		  '-webkit-transform':'rotateY('+d+'deg)',
		  '-o-transform':'rotateY('+d+'deg)',
		  '-ms-transform':'rotateY('+d+'deg)'
		 }).prop("rotateY", _e ? d : null)
	 };*/
	 
	 var $_fx_step_default = $.fx.step._default;
	 
	 $.fx.step._default = function (fx) {
		 if(fx.prop != "rotate" ) return $_fx_step_default(fx);
		 if(typeof fx.elem.rotate == "undefined")fx.start = fx.elem.rotate = 0;
		 $(fx.elem).cssRotate(fx.now)
	 };
	 
})(jQuery);


