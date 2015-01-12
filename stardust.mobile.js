/*	
		============================================================================
 		*
		*	StardustJS - Mobile
		*
		*	made for PhoneGap
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	https://github.com/creatologist/stardust-js
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

var Mobile = Mobile ? Mobile : (function() {

	var Slides = function Slides( id_, params_ ) {
		this.isolated = false;
		this.userActive = false;

		this.horizontal = true;

		if ( params_ && params_.direction ) {
			if ( params_.direction == 'vertical' ) this.horizontal = false;
			else if ( params_.direction == 'horizontal' ) this.horizontal = true;
		}


		if ( typeof id_ === 'string' ) this.$el = $( id_ );
		else {
			this.$el = id_;
			var style = css( this.$el );
			style.overflow = 'hidden';

			this.$clipper = $("<div>", {});
			//$clipper.css( {width: 100, height: 100, overflow: 'scroll'} );
			this.$clipper.css( style );

			this.$el.after( this.$clipper );

			this.$el.remove();

			var key;
			for ( key in style ) {
				style[ key ] = '';
			}

			 var tags='left|top|margin|margin-left|margin-top|margin-right|margin-bottom'.split('|'), i=0, max=tags.length;
			for(i;i<max;i++) {
			   style[ tags[i] ] = 0;
			}

			style.width = '100%';
			style.height = '100%';

			this.$el.css( style );

			this.$clipper.append( this.$el );

			this.isolated = true;			

			//this.$el.css({});

		}

		this.slidesArr = this.$el.find( 'slide' );
		this.totalSlides = this.slidesArr.length;

		//

		this.width = this.$el.width() || this.$el.actual( 'width', { absolute: true } );
		this.height = this.$el.height() || this.$el.actual( 'height', { absolute: true } );

		if ( this.horizontal ) {
			if ( this.width < 150 ) this.swipeThreshold = this.width * .3;
			else this.swipeThreshold = this.width * .2;
		} else {
			if ( this.height < 150 ) this.swipeThreshold = this.height * .3;
			else this.swipeThreshold = this.height * .1;
		}


		//this.$el.css( { width: this.width * .3, overflow: 'hidden' } );

		this.maxWidth = (this.totalSlides - 1) * this.width;
		this.maxHeight = (this.totalSlides - 1) * this.height;

		//

		this.currSlideIndex = 0;
		this.prevSlideIndex = 0;
		this.scrollX = 0;
		this.scrollY = 0;

		//

		this.paginationSelector = 'pagination';

		this.paginationItemSelector = '.item';
		this.currentClass = 'current';

		this.pagination = false;

		//

		var temp;
		temp = this.$el.attr( 'data-pagination-selector' );
		if ( temp ) this.paginationSelector = temp;

		if ( this.$el.find( this.paginationSelector ).length > 0 ) this.pagination = true;

		if ( this.pagination ) {
			var $pagination = this.$el.find( this.paginationSelector );

			temp = $pagination.attr( 'data-selector' );
			if ( temp ) this.paginationItemSelector = temp;

			temp = $pagination.attr( 'data-current-class' );
			if ( temp ) this.currentClass = temp;

			this.$paginationItemsArr = this.$el.find( this.paginationItemSelector );

			for ( var i = 0, len = this.$paginationItemsArr.length; i < len; i++ ) {
				this.$paginationItemsArr[ i ] = $( this.$paginationItemsArr[ i ] );
			}
		}

		//

		this.touchListener = touchListener;

		this.init();
	};

	Slides.prototype = {
		touch: {
			x: 0,
			y: 0
		},
		init: function() {
			if ( this.totalSlides <= 1 ) return;
			this.slidesArr.remove();
			this.$slidesContainer = $("<div>", {});
			this.$slidesContainer.append( this.slidesArr );
			this.$el.prepend( this.$slidesContainer );

			var slidesContainerStyle = {
				position: 'relative',
				left: 0,
				top: 0
			}

			var w = this.width;
			var h = this.height;

			if ( this.horizontal ) {
				
				$.each( this.slidesArr, function( index, value ) {
					$( value ).css( {
						width: w,
						height: h,
						float: 'left'
					})
				});

				slidesContainerStyle.width = this.width * this.totalSlides;
				slidesContainerStyle.height = this.height;
			} else {
				
				$.each( this.slidesArr, function( index, value ) {
					$( value ).css( {
						width: w,
						height: h,
						float: 'left'
					})
				});

				slidesContainerStyle.width = this.width;
				slidesContainerStyle.height = this.height * this.totalSlides;
			}

			this.$slidesContainer.css( slidesContainerStyle );

			var x1 = 0,
				y1 = 0,
				x2 = this.width,
				y2 = this.height;

			//console.log( 'rect(' + x1 + 'px, ' + y1 + 'px, ' + x2 + 'px, ' + y2 + 'px)' );

			// this.$el.css( {
			// 	clip: 'rect(' + x1 + 'px, ' + y1 + 'px, ' + x2 + 'px, ' + y2 + 'px)'
			// });
			

			//this.$el.css( { overflow: 'visible', width: $( document ).width() } );
			this.$el.css( { overflow: 'visible' } );

			//document.addEventListener( 'touchstart', this._onTouchStart.bind( this ), true);
			//this.touchListener = touchListener;

			document.addEventListener( 'touchstart', this.onTouchStart.bind( this ), true);
			document.addEventListener( 'touchend', this.onTouchEnd.bind( this ), true);
			touchListener.on( 'update', this._onUpdate.bind( this ) );

			//$( document ).on( 'touchlistener', this.test );
			
		},

		_active: false,

		active: function( bool_ ) {
			this._active = bool_;
		},

		test: function( e ) {
			console.log( e.message + Math.random() );
		},

		onTouchStart: function( e ) {
			//TweenMax.set( this.$el, { scale: .9 } );
			if ( !this._active ) return;
			if ( this.isolated ) {
				
				var offset = this.$clipper.offset();
				
				if ( e.pageX > offset.left && e.pageX < offset.left + this.width ) {
					if ( e.pageY > offset.top && e.pageY < offset.top + this.height ) this.userActive = true;
				}
				

				//if ( e.pageY < 300 ) this.userActive = true;

				if ( this.userActive ) e.preventDefault();

			} else {
				e.preventDefault();
			}
			
		},

		onTouchEnd: function( e ) {
			//TweenMax.set( this.$el, { scale: 1 } );
			this.userActive = false;
		},

		_onUpdate: function( e ) {
			if ( !this._active ) return;
			if ( this.isolated && !this.userActive ) return;
			
			//console.log( Math.random() + e.detail.scroll.top );
			//return;
			//console.log( e.touch.dy );
			//console.log( 'updating -- ' + Math.random() );
			//console.log( e.detail.touch.dy );
			//console.log( e.detail.direction.y );
			//e.preventDefault();
			//e = e.detail;

			//console.log( '[' + e.type + '] ' + e.touch.dx );

			if ( this.horizontal ) {
				if ( this.scrollX + e.touch.dx > 0 ) this.$slidesContainer.css( { left: 0 } );
				else if ( this.scrollX + e.touch.dx < -this.maxWidth ) this.$slidesContainer.css( { left: -this.maxWidth } );
				else this.$slidesContainer.css( { left: this.scrollX + e.touch.dx });
			} else {
				if ( this.scrollY + e.touch.dy > 0 ) this.$slidesContainer.css( { top: 0 } );
				else if ( this.scrollY + e.touch.dy < -this.maxHeight ) this.$slidesContainer.css( { top: -this.maxHeight } );
				else this.$slidesContainer.css( { top: this.scrollY + e.touch.dy });
			}
			

			
			if ( e.touchEvent == 'touchend' ) {
				if ( this.horizontal ) {
					if ( Math.abs( e.touch.dx ) > this.swipeThreshold ) {

						if ( e.touch.dx < 0 ) {
							// SWIPE LEFT
							console.log( 'swipe left' );
							this.prevSlideIndex = this.currSlideIndex;

							this.currSlideIndex++;
							if ( this.currSlideIndex > this.totalSlides - 1 ) this.currSlideIndex = this.totalSlides - 1;

							this.updatePagination();
						} else {
							// SWIPE RIGHT
							console.log( 'swipe right' );
							this.prevSlideIndex = this.currSlideIndex;

							this.currSlideIndex--;
							if ( this.currSlideIndex < 0 ) this.currSlideIndex = 0;
							

							this.updatePagination();
						}

						var dist = Math.abs( this.scrollX - ( this.currSlideIndex * -this.width ) );
						dist -= Math.abs( e.touch.dx );

						this.scrollX = this.currSlideIndex * -this.width;
						this._slideToAnimation( this.currSlideIndex * -this.width );
						//this.$slidesContainer.animate( { left: this.currSlideIndex * -this.width }, dist * 2.5, 'easeOutQuad' );
					} else {

						//console.log( 'ummm..	' );
						//this.$slidesContainer.animate( { left: this.currSlideIndex * -this.width }, 400, 'easeOutQuint' );
						//TweenMax.to( this.$slidesContainer, .4, { left: this.currSlideIndex * -this.width } );
						this._slideBackAnimation( this.currSlideIndex * -this.width );
					}
				} else {
					if ( Math.abs( e.touch.dy ) > this.swipeThreshold ) {

						if ( e.touch.dy < 0 ) {
							// SWIPE LEFT
							console.log( 'swipe up' );
							this.prevSlideIndex = this.currSlideIndex;

							this.currSlideIndex++;
							if ( this.currSlideIndex > this.totalSlides - 1 ) this.currSlideIndex = this.totalSlides - 1;

							this.updatePagination();
						} else {
							// SWIPE RIGHT
							console.log( 'swipe down' );
							this.prevSlideIndex = this.currSlideIndex;

							this.currSlideIndex--;
							if ( this.currSlideIndex < 0 ) this.currSlideIndex = 0;
							

							this.updatePagination();
						}

						var dist = Math.abs( this.scrollY - ( this.currSlideIndex * -this.height ) );
						dist -= Math.abs( e.touch.dy );

						this.scrollY = this.currSlideIndex * -this.height;
						this._slideToAnimation( this.currSlideIndex * -this.height );
						//this.$slidesContainer.animate( { left: this.currSlideIndex * -this.width }, dist * 2.5, 'easeOutQuad' );
					} else {

						//console.log( 'ummm..	' );
						//this.$el.animate( { left: this.currSlideIndex * -this.width }, 400, 'easeOutQuint' );
						//TweenMax.to( this.$el, .4, { left: this.currSlideIndex * -this.width } );
						this._slideBackAnimation( this.currSlideIndex * -this.height );
					}
				}
				
			}
		},

		animatePaginationIn: false,
		animatePaginationOut: false,

		updatePagination: function() {
			/*for ( var i = 0, len = this.$paginationItemsArr; i < len; i++ ) {
				this.$paginationItemsArr[ i ].toggleClass( this.currentClass, false );
			}*/
			if ( !this.pagination ) return;

			if ( this.animatePaginationOut ) this.animatePaginationOut( this.$paginationItemsArr[ this.prevSlideIndex ], this.prevSlideIndex );
			else this.$el.find( this.paginationItemSelector ).removeClass( this.currentClass );
			
			if ( this.animatePaginationIn ) this.animatePaginationIn( this.$paginationItemsArr[ this.currSlideIndex ], this.currSlideIndex );
			else this.$paginationItemsArr[ this.currSlideIndex ].toggleClass( this.currentClass, true );
		},

		_slideToAnimation: function( pos_ ) {
			TweenMax.killTweensOf( this.$slidesContainer );
			this.slideToAnimation( pos_ );
		},

		slideToAnimation: function( pos_ ) {
			if ( this.horizontal ) TweenMax.to( this.$slidesContainer, .5, { left: pos_, overwrite: 1 } );
			else TweenMax.to( this.$slidesContainer, .5, { top: pos_, overwrite: 1 } );
		},

		_slideBackAnimation: function( pos_ ) {
			TweenMax.killTweensOf( this.$slidesContainer );
			this.slideBackAnimation( pos_ );
		},

		slideBackAnimation: function( pos_ ) {
			if ( this.horizontal ) TweenMax.to( this.$slidesContainer, .4, { left: pos_ } );
			else TweenMax.to( this.$slidesContainer, .4, { top: pos_ } );
		},

		_to: null,

		_onTouchStart: function( e ) {
			e.preventDefault();
			this.touch.x = e.pageX;
			document.addEventListener( 'touchmove', this._onTouchMove.bind( this ), true);
			//document.addEventListener( 'touchend', this._onTouchEnd.bind( this ), true);
			//$( document ).on( 'touchend', this._onTouchEnd.bind( this ) );
			//$( document ).on( 'touchmove', this._onTouchMove.bind( this ) );

			
		},

		_onTouchMove: function( e ) {
			this._calcDx( e );
			var self = this;

			clearTimeout( this._to );
			
			this._to = setTimeout( function() {
				self._onTouchEnd( e );
				//$( this.slidesArr[ 0 ] ).find( '.fpo-title' ).html( "yay" );
			}.bind( this ), 50 );
		},

		_calcDx: function( e, checkSwipe_ ) {
			//e.preventDefault();
			this.touch.dx = e.changedTouches[ 0 ].pageX - this.touch.x;
			//$( this.slidesArr[ 1 ] ).find( '.fpo-title' ).html( -this.touch.dx );
			//console.log( -this.touch.dx );



			if ( this.scrollX + this.touch.dx > 0 ) this.$el.css( { left: 0 } );
			else if ( this.scrollX + this.touch.dx <  this.maxWidth ) this.$el.css( { left: this.maxWidth } );
			else this.$el.css( { left: this.scrollX + this.touch.dx } );

			if ( checkSwipe_ ) {
				//$( this.slidesArr[ 0 ] ).find( '.fpo-title' ).html( this.touch.dx );
				//return;
				if ( Math.abs( this.touch.dx ) > this.swipeThreshold ) {

					if ( this.touch.dx < 0 ) {
						this.currSlideIndex++;
						if ( this.currSlideIndex > this.totalSlides - 1 ) this.currSlideIndex = this.totalSlides - 1;

					} else {
						this.currSlideIndex--;
						if ( this.currSlideIndex < 0 ) this.currSlideIndex = 0;
						
					}

					var dist = Math.abs( this.scrollX - ( this.currSlideIndex * -this.width ) );
					dist -= Math.abs( this.touch.dx );

					this.scrollX = this.currSlideIndex * -this.width;

					this.$el.animate( { left: this.currSlideIndex * -this.width }, dist * 2.5, 'easeOutQuad' );
				} else {

					this.$el.animate( { left: this.currSlideIndex * -this.width }, 400, 'easeOutQuint' );
				}
			}
		},

		_onTouchEnd: function( e ) {
			this._calcDx( e, true );
			document.removeEventListener( 'touchmove', this._onTouchMove, true);
			document.removeEventListener( 'touchend', this._onTouchEnd, true);
		}

	};
	

	// ---------------------------------------------------------------------------------------------------------------------------

	var View = function View( id_, params_ ) {
		this.id = id_;
		this.$el = $( id_ );
		this.slides = false;

		this.slidesArr = [];
		this.touchAreaArr = [];

		this.params = {
			scrolling: false,
			autoTouchAreas: false
		};

		this.$card = false;
		this.front = true;

		this.flipType = 0;

		if ( this.$el.find( 'card' ).length > 0 ) {
			this.$card = this.$el.find( 'card' );
		}

		var key;
		for ( key in params_ ) {
			this.params[ key ] = params_[ key ];
		}

		this.init();
		//this.setAnimateIn( .4, { alpha: 1 } );
		//this.setAnimateOut( .4, { alpha: 0 } );
		//this.animateInParams.params.onComplete = this.animateInComplete.bind( this );
	};

	View.prototype = {
		controller: null,
		getTouchAreaById: function( id_ ) {
			for ( var i = 0, len = this.touchAreaArr.length; i < len; i++ ) {
				if ( this.touchAreaArr[ i ].id === id_ ) return this.touchAreaArr[ i ];
			}
			return false;
		},
		setScrollbarStyle: function( style_ ) {
			for ( var i = 0, len = this.touchAreaArr.length; i < len; i++ ) {
				if ( this.touchAreaArr[ i ].hasScrollbar() ) {
					this.touchAreaArr[ i ].$scrollbar.css( style_ );
				}
			}
		},
		setScrollbarContainerStyle: function( style_ ) {
			for ( var i = 0, len = this.touchAreaArr.length; i < len; i++ ) {
				if ( this.touchAreaArr[ i ].hasScrollbar() ) {
					this.touchAreaArr[ i ].$scrollbarContainer.css( style_ );
				}
			}
		},
		init: function() {
			if ( this.params.scrolling ) {
				var $el = this.$el;
				this.$el.bind( 'touchstart', function() {
					$el.stop( true );
				});
			}

			if ( this.params.slides ) {
				if ( this.params.slides === 'horizontal' ) this.slides = new Slides( this.id, { direction: 'horizontal' } );
				else this.slides = new Slides( this.id, { direction: 'vertical' } );

				var $el = this.$el;
				var self = this;
				this.$el.bind( 'touchstart', function() {
					//if ( !self.verticalSlides._active ) return;
					//console.log( 'cancel' );
					TweenMax.killTweensOf( $el );
				});
				
			}

			if ( this.$el.find( 'slides' ).length > 0 ) {
				var tempArr = this.$el.find( 'slides' );
				var $slides, direction, temp;

				for ( var i = 0, len = tempArr.length; i < len; i++ ) {
					$slides = $( tempArr[ i ] );
					direction = 'horizontal';
					temp = $slides.attr( 'data-direction' );

					if ( temp && temp == 'vertical'  ) direction = 'vertical';

					if ( direction == 'horizontal' ) this.slidesArr[ i ] = new Slides( $slides, { direction: 'horizontal' } );
					else this.slidesArr[ i ] = new Slides( $slides, { direction: 'vertical' } );
				}
			}

			if ( this.params.autoTouchAreas === true && this.$el.find( 'toucharea' ).length > 0 ) {
				var tempArr = this.$el.find( 'toucharea' );
				var $touchArea;

				for ( var i = 0, len = tempArr.length; i < len; i++ ) {
					$touchArea = $( tempArr[ i ] );
					this.addTouchArea( new TouchArea( $touchArea ) );
				}
			}


			this.hide();
			
		},

		addTouchArea: function( ta_ ) {
			this.touchAreaArr.push( ta_ );
		},

		flip: function() {
			if ( !this.$card ) return;

			this[ 'flip' + this.flipType ]();
		},

		flip0: function() {
			if ( this.front ) {
				var tl = new TimelineMax();
				tl.to( this.$card, .2, { scale: .95  } );
				tl.to( this.$card, .5, { rotationY: 180, left: '-100%', transformOrigin: 'right center' }, '-=.2' );
				tl.to( this.$card, .3, { scale: 1, left:-$( document ).width() }, '-=.1' );
				this.front = false;
			} else {
				var tl = new TimelineMax();
				tl.to( this.$card, .2, { scale: .95  } );
				tl.to( this.$card, .5, { rotationY: 0, left: '0%', transformOrigin: 'right center' }, '-=.2' );
				tl.to( this.$card, .3, { scale: 1, left: 0 }, '-=.1' );
				this.front = true;
			}
			
		},

		flip1: function() {
			if ( this.front ) {
				var tl = new TimelineMax();
				tl.to( this.$card, .2, { scale: .5  } );
				tl.to( this.$card, .5, { rotationY: 180, left: 0, transformOrigin: 'center center' }, '-=.2' );
				tl.to( this.$card, .3, { scale: 1, left: 0 }, '-=.1' );
				this.front = false;
			} else {
				var tl = new TimelineMax();
				tl.to( this.$card, .2, { scale: .5  } );
				tl.to( this.$card, .5, { rotationY: 0, left: 0, transformOrigin: 'center center' }, '-=.2' );
				tl.to( this.$card, .3, { scale: 1, left: 0 }, '-=.1' );
				this.front = true;
			}
		},

		getScrollTop: function() {
			return this.$el.scrollTop();
		},
		getScrollLeft: function() {
			return this.$el.scrollLeft();
		},
		getScrollWidth: function() {
			return this.$el[0].scrollWidth;
		},
		getScrollHeight: function() {
			return this.$el[0].scrollHeight;
		},

		setIndex: function( index_ ) {
			this.index = index_;
		},

		animateInView: null,

		/*animateInParams: {
			duration: .4,
			params: {
				alpha: 1
			}
		},

		animateOutParams: {
			duration: .4,
			params: {
				alpha: 0
			},
			animateInView: false
		},

		setAnimateIn: function( duration_, params_, callback_ ) {
			if ( typeof duration_ == 'function' ) {
				
				this.animateInParams.params.onComplete = function() {
					this.controller.setCurrentView( this );
					callback_();
				}.bind( this );
			} else {
				if ( typeof duration_ == 'number' ) this.animateInParams.duration = duration_;
				//if ( typeof params_ == 'object' ) this.animateInParams.params = params_;
				if ( callback_ && typeof callback_ == 'function' ) {
					
					this.animateInParams.params.onComplete = function() {
						this.controller.setCurrentView( this );
						callback_();
					}.bind( this );
				} else {
					var self = this;

					this.animateInParams.params.onComplete = this.animateInComplete.bind( this );
				}
			}
		},

		setAnimateOut: function( duration_, params_, callback_ ) {
			if ( typeof duration_ == 'function' ) {
				var callback = duration_;
				this.animateOutParams.params.onComplete = function() {
					if ( this.animateOutParams.animateInView ) this.animateOutParams.animateInView.animateIn();
					callback();
				}.bind( this );
			} else {
				//console.log( typeof params_ );
				if ( typeof duration_ == 'number' ) this.animateOutParams.duration = duration_;
				if ( typeof params_ == 'object' ) this.animateOutParams.params = params_;
				if ( typeof callback_ == 'function' ) {
					var callback = callback_;
					this.animateOutParams.params.onComplete = function() {
						if ( this.animateOutParams.animateInView ) this.animateOutParams.animateInView.animateIn();
						callback();
					}.bind( this );
				} else {
					
					this.animateOutParams.params.onComplete = function() {
						if ( this.animateOutParams.animateInView ) this.animateOutParams.animateInView.animateIn();
					}
				}
			}
		},

		animateInComplete: function() {
			//console.log( 'yayyy', true );
			console.log( '>> [' + this.index + '] ' + this.id, true );
			this.controller.setCurrentView( this );
		},
		animateOutComplete: function() {
			if ( this.animateOutParams.animateInView ) this.animateOutParams.animateInView.animateIn();
		},
		animateIn: function( callback_ ) {
			//console.log( 'animIn - ' + Math.random() );
			console.log( 'animIn - ' + this.id, true );
			TweenMax.to( this.$el, this.animateInParams.duration, this.animateInParams.params );
			//TweenMax.to( this.$el, this.animateInParams.duration, { alpha: 1, onComplete: this.animateInComplete.bind( this ) } );
			console.log( 'index - ' + this.index, true );
		},
		animateOut: function( callback_ ) {
			//console.log( 'animOut - ' + Math.random() );
			TweenMax.to( this.$el, this.animateOutParams.duration, this.animateOutParams.params );
			//TweenMax.to( this.$el, this.animateOutParams.duration, this.animateOutParams.params );
		}*/
		_onActive: function() {
			if ( this.slides ) this.slides.active( true );
			else {
				for ( var i = 0; i < this.slidesArr.length; i++ ) {
					this.slidesArr[ i ].active( true );
				}
			}

			this.onActive();
		},
		_onInactive: function() {
			
			this.onInactive();
		},
		onActive: function() {

		},
		onInactive: function() {

		},
		animateInComplete: function() {
			//console.log( 'yayyy', true );
			console.log( 'in complete >> [' + this.index + '] ' + this.id, true );
			//console.log( 'animate in complete' );
			this.controller.setCurrentView( this );
			this.$el.focus();
			this._onActive();
		},
		animateOutComplete: function() {
			console.log( 'OUT COMPLETE' );
			if ( this.animateInView ) this.animateInView.animateIn();
			this.hide();
			this._onInactive();
		},
		onHide: function() {
			TweenMax.to( this.$el, .35, { alpha: 0, onComplete: function() {
				this.animateOutComplete();
			}.bind( this ) } );
		},
		onShow: function() {
			TweenMax.to( this.$el, .35, { alpha: 1, onComplete: function() {
				this.animateInComplete();
			}.bind( this ) } );
		},
		animateIn: function() {
			this.show();
			this.$el.focus();
			this.onShow();
		},
		animateOut: function() {
			if ( this.slides ) this.slides.active( false );
			else {
				for ( var i = 0; i < this.slidesArr.length; i++ ) {
					this.slidesArr[ i ].active( false );
				}
			}

			this.onHide();
		},
		show: function() {
			this.$el.css( 'display', 'block' );
		},
		hide: function() {
			this.$el.css( 'display', 'none' );
		}
	};

	var ViewController = function ViewController() {
		this.viewsArr = [];
		this.currentView = false;
	};

	ViewController.prototype = {
		addView: function( v_ ) {
			v_.setIndex( this.viewsArr.length );
			v_.controller = this;

			this.viewsArr.push( v );

			if ( !this.currentView ) this.currentView = this.viewsArr[ 0 ];
		},
		createView: function( id_, params_ ) {
			var v = new View( id_, params_ );
			v.setIndex( this.viewsArr.length );
			v.controller = this;

			//console.log( v.index );

			this.viewsArr.push( v );

			if ( !this.currentView ) {
				this.currentView = this.viewsArr[ 0 ];
				this.currentView.show();
			}
			return v;
		},
		getCurrentView: function() {
			return this.currentView;
		},
		changeView: function( v_, animateBoth_ ) {
			console.log( this.currentView.index + " -> " + v_.index );
			if ( animateBoth_ === true ) {
				//this.currentView.setAnimateInView( false );
				this.currentView.animateInView = false;

				this.currentView.animateOut();
				console.log( this.currentView.id + " -> " + v_.id );
				v_.animateIn.apply( v_ );
			} else {
				//this.currentView.setAnimateInView( v_ );
				this.currentView.animateInView = v_;
				this.currentView.animateOut();
			}
			


		},
		setCurrentView: function( v_ ) {
			this.currentView = v_;
		}
	};

	var Manager = function Manager() {

		this.viewController = new ViewController();
		this.navArr = [];

		this.init();
	};

	Manager.prototype = {
		viewport: {
			height: 0,
			width: 0
		},
		init: function() {
			this.viewport.height = $( document ).height();
			this.viewport.width = $( document ).width();

			for ( var i = 0, len = this.navArr.length; i < len; i++ ) {
				this.navArr[ i ].bind( this.viewController.currentView );
			}

			/*this.changeView = this.viewController.changeView;
			this.getCurrentView = this.viewController.getCurrentView;
			this.createView = this.viewController.createView;
			this.addView = this.viewController.addView;*/

			this.changeView = this.viewController.changeView.bind( this.viewController );
			this.getCurrentView = this.viewController.getCurrentView.bind( this.viewController );
			this.addView = this.viewController.addView.bind( this.viewController );
			this.createView = this.viewController.createView.bind( this.viewController );
			
		},
		addNav: function( fn_ ) {
			this.navArr.push( fn_ );
		}/*,
		addView: function( v_ ) {
			this.viewController.addView( v_ );
		},
		createView: function( id_, params_ ) {
			return this.viewController.createView( id_, params_ );
		},
		getCurrentView: function() {
			return this.viewController.getCurrentView();
		},
		changeView: function( v_ ) {
			this.viewController.changeView( v_ )
		}*/
	}

	var Nav = function Nav( selector_, params_ ) {
		//if ( !touchListener ) initTouchListener();
		this.$el = $( selector_ );
		this.height = this.$el.height();

		// default
		this.params = {
			position: 'top',
			autoHide: false
		};

		this.active = false;

		var key;
		for ( key in params_ ) {
			this.params[ key ] = params_[ key ];
		};

		if ( this.params.autoHide === true ) {
			//console.log( 'weeee' );
		};

		//touchListener.addEventListener( 'update', this._onUpdate.bind( this ), true );
		touchListener.on( 'update', this._onUpdate.bind( this ) );

		/*$( window ).scroll( function() {
			console.log( 'scrolling' ); 
		})*/
		//document.addEventListener( 'scroll', this._onScroll, true );
		manager.addNav( this );
	};

	Nav.prototype = {
		setActive: function( bool_ ) {
			this.active = bool_;
		},
		_onUpdate: function( e ) {
			if ( !this.active ) return;
			//console.log( Math.random() );
			//console.log( Math.random() + e.detail.scroll.top );
			//return;
			//console.log( e.touch.dy );
			//console.log( 'updating -- ' + Math.random() );
			//console.log( e.detail.touch.dy );
			//console.log( e.detail.direction.y );
			//e = e.detail;

			if ( e.userOnSlide ) return;
			//console.log( 'updating..' + Math.random() );

			if ( this.params.autoHide ) {
				if ( e.direction.y == 'up' ) {
					//console.log( e.scroll.top );
					if ( e.scroll.top < e.scroll.height - this.height - manager.viewport.height) this.hide();
					else this.show();
				} else {
					this.show();
				}
			}

			//console.log( e.direction.y + ': ' + e.scroll.top + ' -- ' + e.scroll.height + ' (' + manager.viewport.height + ')'  );
			
			//console.log( '[updating] ' + e.data.touch.dy );
		},

		bind: function( view_ ) {
			
			this.view = view_;
			//document.getElementById( view_.id ).addEventListener( 'scroll', this._onScroll, true );
			//this.view.$el.on( 'scroll', this._onScroll.bind( this ) );
		},

		_onScroll: function( e ) {
			//console.log( $( document ).scrollTop() );
			//console.log( this.view.id );
			//console.log( this.view.$el.scrollTop() );
		},
		onHide: function(){
			this.$el.hide();
		},
		hidden: false,
		hide: function() {
			if ( this.hidden ) return;
			this.hidden = true;

			this.onHide();
		},
		show: function() {
			if ( !this.hidden ) return;
			this.hidden = false;

			this.onShow();
		},
		onShow: function() {
			this.$el.show();
		}
	};






	// ---------------------------------------------------------------------------------------------------------------------------

	var touchListener = false;

	var TouchListener = function TouchListener() {

		this.init();
	};

	TouchListener.prototype = {
		touch: {
			x: 0,
			y: 0,
			dx: 0,
			dy: 0
		},

		scroll: {
			top: 0,
			left: 0,
			width: 0,
			height: 0,
			startTop: 0,
			startLeft: 0
		},

		direction: {
			x: null,
			y: null
		},

		touching: false,

		el: null,

		init: function() {
			document.addEventListener( 'touchstart', this._onTouchStart.bind( this ), true);
			document.addEventListener( 'touchmove', this._onTouchMove.bind( this ), true);
			document.addEventListener( 'touchend', this._onTouchEnd.bind( this ), true);

			this.el = document.createElement( 'div' );
		},

		addEventListener: function( type_, listener_, useCapture_ ) {
			//this.el.addEventListener( type_, listener_, useCapture_ );
			//this.el.addEventListener( type_, listener_, useCapture_ );
			$( document ).on( 'touchlistener-' + type_, listener_ );
		},

		on: function( type_, listener_ ) {
			$( document ).on( 'touchlistener-' + type_, listener_ );
		},

		off: function( type_, listener_ ) {
			$( document ).off( 'touchlistener-' + type_, listener_ );
		},

		_to: null,

		event: false,

		_emitUpdateEvent: function( touchevent_ ) {
			//if ( this.busy() ) return;
			/*var params = {
				detail: {
					touch: this.touch,
					scroll: this.scroll,
					direction: this.direction,
					type: 'touchmove'
				},
				bubbles: true,
				cancelable: true
			};

			if ( touchEnd_ && touchEnd_ === true ) params.detail.type = 'touchend';
			var event = new CustomEvent( 'update', params );

			this.el.dispatchEvent( event );*/

			var data = {
				type: 'touchlistener-update',
				touch: this.touch,
				scroll: this.scroll,
				direction: this.direction,
				touchEvent: touchevent_,
				userOnSlide: this.userOnSlide
			};

			if ( touchevent_ == 'touchend' ) data.elapsedTime = this.elapsedTime;

			$.event.trigger( data );
		},

		elapsedTime: 0,

		getElapsedTime: function() {
			this.endTime = new Date();

			var delta = this.endTime.getTime() - this.startTime.getTime();
			this.elapsedTime = Math.abs( delta / 1000 );
			return this.elapsedTime;
		},

		userOnSlide: -1,

		checkUserOnSlide: function() {
			this.userOnSlide = false;
			for ( var i = 0, len = this.view.slidesArr.length; i < len; i++ ) {
				if ( this.view.slidesArr[ i ].userActive ) {
					this.userOnSlide = true;
				}
			}
			return this.userOnSlide;
		},

		_calcDelta: function( e, touchEnd ) {
			if ( this.userOnSlide == -1 ) {
				this.checkUserOnSlide();
				this._emitUpdateEvent( 'touchstart' );
			}
			//if ( this.busy() ) return;
			
			//console.log( this.busy() );
			//console.log( Math.random() );

			this.touch.dx = e.changedTouches[ 0 ].pageX - this.touch.x;
			this.touch.dy = e.changedTouches[ 0 ].pageY - this.touch.y;
			this.direction.y = this.touch.dy < 0 ? 'up' : 'down';
			this.direction.x = this.touch.dx > 0 ? 'right' : 'left';

			this.scroll.top = this.view.getScrollTop();
			this.scroll.left = this.view.getScrollLeft();

			this.scroll.width = this.view.getScrollWidth();
			this.scroll.height = this.view.getScrollHeight();
			
			//this.scroll.top = $( document ).scrollTop();
			//this.scroll.height = $( document ).height();

			//console.log( this.direction.y + ': ' + this.touch.dx + ', ' + this.touch.dy );
			//console.log( this.direction.y + ': ' + this.scroll.start + ', ' + this.scroll.top );


			if ( touchEnd === true ) {
				//console.log( 'wtf' );
				this.getElapsedTime()

				this.scroll.dy = this.scroll.startTop - this.scroll.top;
				this.scroll.dx = this.scroll.startLeft - this.scroll.left;
				//console.log( '[' + this.view.id + '] ' + this.scroll.start + ' -- ' + this.scroll.top + ' -- ' + this.scroll.height );
				if ( this.view.params.scrolling && this.elapsedTime < .4 ) {
					var self = this;
					this.view.$el.stop( true ).animate( { scrollTop: this.scroll.top - this.scroll.dy*6 }, { duration: 1500, easing: 'easeOutQuad', step: function( now, fx ) {
						//console.log( Math.random() );
						//console.log( this.name );
						//console.log( now );
						//self.scroll.top = self.view.getScrollTop();
						if ( now <= 0 ) self.scroll.top = 0;
						else self.scroll.top = now;
						if ( !self.isBusy ) self._emitUpdateEvent( 'touchend' );
					}});
				} else {
					//console.log( 'weee' );
					this._emitUpdateEvent( 'touchend' );
				}

				
			} else {
				this._emitUpdateEvent( 'touchmove' );
			}

			/*var event = document.createEvent( 'Event' );
			event.initEvent( 'update', true, true );
			document.dispatchEvent( event );*/
		},

		_onTouchStart: function( e ) {
			//this.touching = true;
			this.startTime = new Date();
			this.elapsedTime = 0;
			this.view = manager.viewController.getCurrentView();

			this.scroll.startTop = this.view.getScrollTop();
			this.scroll.startLeft = this.view.getScrollLeft();

			this.touch.x = e.pageX;
			this.touch.y = e.pageY;


			//document.addEventListener( 'touchmove', this._onTouchMove.bind( this ), true);
			//document.addEventListener( 'touchend', this._onTouchEnd.bind( this ), true);
		},

		_onTouchMove: function( e ) {
			//this.touching = true;
			//if ( this.busy() ) return;
			this._calcDelta( e );
			
			/*var self = this;

			clearTimeout( this._to );
			
			this._to = setTimeout( function() {
				self._onTouchEnd( e );
			}.bind( this ), 50 );*/

			//this.touching = false;
		},

		_onTouchEnd: function( e ) {
			//if ( this.busy() ) return;
			//if ( this.touching ) return;
			this._calcDelta( e, true );
			this.userOnSlide = -1;
			//document.removeEventListener( 'touchmove', this._onTouchMove, true);
			//document.removeEventListener( 'touchend', this._onTouchEnd, true);
			
		}
	}

	var initTouchListener = function() {
		touchListener = new TouchListener();

	};






	// ---------------------------------------------------------------------------------------------------------------------------

	var TouchArea = function TouchArea( el_, params_ ) {
		this.id = false;

		if ( typeof el_ == 'string' ) this.$el = $( el_ );
		else this.$el = el_;

		if ( this.$el.attr( 'id' ) != undefined ) this.id = this.$el.attr( 'id' );



		this.$content = false;

		if ( this.$el.find( 'touchcontent' ) ) this.$content = this.$el.find( 'touchcontent' );

		var temp;

		//

		this.params = {
			scrolling: false
		};

		this.scrollbar = {
			percent: .3,
			width: 0,
			height: 0,
			maxX: 0,
			maxY: 0
		}

		this.$scrollbar = null;
		this.$scrollbarContainer = null;

		this.touch = {
			lastX: 0,
			lastY: 0
		}

		// ----- scrolling

		this.scroll = {
			x: 0,
			y: 0,
			startX: 0,
			startY: 0,
			width: false,
			height: false
		}



		this.width = this.$el.width() || this.$el.actual( 'width' );
		this.height = this.$el.height() || this.$el.actual( 'height' );

		temp = this.$el.attr( 'data-scroll' );
		if ( temp ) if ( temp == 'horizontal' || temp == 'vertical' ) this.params.scrolling = temp;

		if ( this.params.scrolling ) {

			this.scroll.width = this.$el[0].scrollWidth;
			this.scroll.height = this.$el[0].scrollHeight;

			if ( this.scroll.width > this.width ) this.scroll.width -= this.width;
			if ( this.scroll.height > this.height ) this.scroll.height -= this.height;


			this.$scrollingContainer = $("<div>", {});
			this.$scrollingContainer.css( {
				position: 'absolute',
				left: 0,
				top: 0
			});

			

			if ( this.params.scrolling == 'horizontal' ) {
				this.scrollbar.width = this.width * this.scrollbar.percent;
				this.scrollbar.maxX = this.width - this.scrollbar.width;

				this.$scrollbar = $( '<div>', { class: 'ta-scrollbar ta-scrollbar-horz' } );
				this.$scrollbarContainer = $( '<div>', { class: 'ta-scrollbar-container ta-scrollbar-container-horz' } );

				this.$scrollbar.css( {
					width: this.scrollbar.width,
					position: 'relative',
					top: 0,
					left: 0
				});
			} else if ( this.params.scrolling == 'vertical' ) {
				this.scrollbar.height = this.height * this.scrollbar.percent;
				this.scrollbar.maxY = this.height - this.scrollbar.height;

				this.$scrollbar = $( '<div>', { class: 'ta-scrollbar ta-scrollbar-vert' } );
				this.$scrollbarContainer = $( '<div>', { class: 'ta-scrollbar-container ta-scrollbar-container-vert' } );

				this.$scrollbar.css( {
					height: this.scrollbar.height,
					position: 'relative',
					top: 0,
					left: 0
				});
			}

			

			var styles = {
				position: 'absolute'
				//'background-color': 'rgba(0,0,0,.3)'
			};

			if ( this.params.scrolling == 'horizontal' ) {
				styles.bottom = 0;
				styles.left = 0;
				styles.width = this.width;
			} else if ( this.params.scrolling == 'vertical' ) {
				styles.right = 0;
				styles.top = 0;
				styles.height = this.height;
			}

			this.$scrollbarContainer.css( styles );

			var $content = this.$el.contents();
			$content.remove();

			this.$scrollingContainer.append( $content );
			this.$el.append( this.$scrollingContainer );
			this.$scrollbarContainer.append( this.$scrollbar );

			this.$el.append( this.$scrollbarContainer );
			//var w = $content.width() || 300;

			this.$scrollingContainer.css( {
				width: this.scroll.width,
				height: this.scroll.height
			})

			/*if ( this.params.scrolling ) {
				var $scrollingContainer = this.$scrollingContainer;
				this.$scrollingContainer.bind( 'touchstart', function() {
					$scrollingContainer.stop( true );
				});
			}*/

		}

		//

		

		if ( this.horizontal ) {
			if ( this.width < 150 ) this.swipeThreshold = this.width * .3;
			else this.swipeThreshold = this.width * .2;
		} else {
			if ( this.height < 150 ) this.swipeThreshold = this.height * .3;
			else this.swipeThreshold = this.height * .1;
		}

		//

		this._active = true;
		this.userActive = false;

		this.bindEvents();

	};

	TouchArea.prototype = {
		bindEvents: function() {

			document.addEventListener( 'touchstart', this._onTouchStart.bind( this ), true);
			document.addEventListener( 'touchend', this._onTouchEnd.bind( this ), true);
			touchListener.on( 'update', this._onUpdate.bind( this ) );
		},
		hasScrollbar: function() {
			return this.params.scrolling;
		},
		active: function( bool_ ) {
			this._active = bool_;
		},
		on: function( event_, func_ ) {
			switch( event_ ) {
				case 'swipeleft':
					this.onSwipeLeft( func_ );
					break;
				case 'swiperight':
					this.onSwipeRight( func_ );
					break;
				case 'swipeup':
					this.onSwipeUp( func_ );
					break;
				case 'swipedown':
					this.onSwipeDown( func_ );
					break;
				case 'touch':
					this.onTouch( func_ );
					break;
				case 'touchstart':
					this.onTouchStart( func_ );
					break;
				case 'touchmove':
					this.onTouchMove( func_ );
					break;
				case 'touchend':
					this.onTouchEnd( func_ );
					break;
			}
		},
		_onTouch: false,
		onTouch: function( func_ ){
			this._onTouch = func_;
		},
		_onTouchStart: false,
		onTouchStart: function( func_ ){
			this._onTouchStart = func_;
		},
		_onTouchMove: false,
		onTouchMove: function( func_ ){
			this._onTouchMove = func_;
		},
		_onTouchEnd: false,
		onTouchEnd: function( func_ ){
			this._onTouchEnd = func_;
		},
		_onSwipeLeft: false,
		onSwipeLeft: function( func_) {
			this._onSwipeLeft = func_;
			this.initGestures();
		},
		_onSwipeRight: false,
		onSwipeRight: function( func_) {
			this._onSwipeRight = func_;
			this.initGestures();
		},
		_onSwipeUp: false,
		onSwipeUp: function( func_) {
			this._onSwipeUp = func_;
			this.initGestures();
		},
		_onSwipeDown: false,
		onSwipeDown: function( func_) {
			this._onSwipeDown = func_;
			this.initGestures();
		},

		_gestures: false,
		initGestures: function() {
			if ( this._gestures ) return;

			if ( this.width < 150 ) this.swipeThresholdX = this.width * .3;
			else this.swipeThresholdX = this.width * .2;

			if ( this.height < 150 ) this.swipeThresholdY = this.height * .3;
			else this.swipeThresholdY = this.height * .1;

			this._gestures = true;
		},
		_onTouchStart: function( e ) {
			if ( !this._active ) return;
			var offset = this.$el.offset();
			
			if ( e.pageX > offset.left && e.pageX < offset.left + this.width ) {
				if ( e.pageY > offset.top && e.pageY < offset.top + this.height ) this.userActive = true;
			}

			if ( this.userActive ) e.preventDefault();

			if ( this.params.scrolling ) {
				//console.log( 'touchstart' );
				//this.$scrollingContainer.stop( true );

				var pos = this.$scrollingContainer.position();
				this.scroll.x = pos.left;
				this.scroll.y = pos.top;
			} else {

			}

			
		},
		_onTouchEnd: function( e ) {
			this.userActive = false;
		},
		_onUpdate: function( e ) {
			if ( !this._active || !this.userActive ) return;
			//console.log( e.touch.dx  + ' -- ' + (this.scroll.x - e.touch.dx) );
			
			if ( this._onTouch ) this._onTouch( e, this );
			switch ( e.touchEvent ) {
				case 'touchstart':
					//console.log( 'ontouchstart' );
					this.position = this.$el.position();
					if ( this._onTouchStart ) this._onTouchStart( e, this );
					break;
				case 'touchmove':
					//console.log( 'ontouchmove' );
					if ( this._onTouchMove ) this._onTouchMove( e, this );
					break;
				case 'touchend':
					//console.log( 'ontouchend' );
					if ( this._onTouchEnd ) this._onTouchEnd( e, this );
					break;
			}

			if ( this.params.scrolling ) {
				//console.log( this.scroll.x + ' -- ' + (this.scroll.x - e.touch.dx) );
				//console.log( this.width + ' x ' + this.height );
				if ( e.touchEvent == 'touchstart' ) this.$scrollingContainer.stop( true );
				this._updateScrolling( e );
				return;
			} else {
				if ( this._gestures && e.touchEvent == 'touchend' ) {
					var dx = Math.abs( e.touch.dx ),
						dy = Math.abs( e.touch.dy );

					if ( dx > dy ) {
						if ( dx > this.swipeThresholdX ) {
							if ( e.touch.dx < 0 ) {
								if ( this._onSwipeLeft ) this._onSwipeLeft( this, e );
							} else {
								if ( this._onSwipeRight ) this._onSwipeRight( this, e );
							}
						}
					} else {
						if ( dy > this.swipeThresholdY ) {
							if ( e.touch.dy < 0 ) {
								if ( this._onSwipeUp ) this._onSwipeUp( this, e );
							} else {
								if ( this._onSwipeDown ) this._onSwipeDown( this, e );
							}
						}
					}
				}
			}
			
		},
		_updateScrollbarX: function( x_ ) {
			this.$scrollbar.css( {
				left: Utils.map( -x_, 0, this.scroll.width, 0, this.scrollbar.maxX )
			})
		},
		_updateScrollbarY: function( y_ ) {
			this.$scrollbar.css( {
				top: Utils.map( -y_, 0, this.scroll.height, 0, this.scrollbar.maxY )
			})
		},
		_updateScrolling: function( e ) {

			//console.log( e.touchEvent + ' - ' + Math.random() );

			var newScrollX = this.scroll.x + e.touch.dx;
			var newScrollY = this.scroll.y + e.touch.dy;

			if ( newScrollX > 0 ) newScrollX = 0;
			else if ( newScrollX < -this.scroll.width ) newScrollX = -this.scroll.width;

			if ( newScrollY > 0 ) newScrollY = 0;
			else if ( newScrollY < -this.scroll.height ) newScrollY = -this.scroll.height;

			var dx = Math.abs( e.touch.dx ),
				dy = Math.abs( e.touch.dy );

			if ( this.params.scrolling == 'horizontal' ) {
				if ( e.touchEvent == 'touchend' ) console.log( 'elapsedTime: ' + e.elapsedTime );

				if ( e.touchEvent == 'touchend' && e.elapsedTime < 0.4 ) {
					//console.log( e.touch.dx + ' -- ' + this.touch.lastX );
					
					newScrollX += (e.touch.dx*3);
					if ( newScrollX < -this.scroll.width ) newScrollX = -this.scroll.width;
					else if ( newScrollX > 0 ) newScrollX = 0;

					var self = this;
					this.$scrollingContainer.animate( { left: newScrollX }, { duration: Utils.map( dx, 20, this.width * .75, 1300, 800 ), easing: 'easeOutQuad', step: function( now, fx ) {
						self._updateScrollbarX( now );
					} } );
				} else {
					this.touch.lastX = e.touch.dx;
					this.$scrollingContainer.css( {
						left: newScrollX
					});
					this._updateScrollbarX( newScrollX );
				}
				

				//console.log( newScrollX + ' >> ' + -this.scroll.width );
			} else if ( this.params.scrolling == 'vertical' ) {
				if ( e.touchEvent == 'touchend' && e.elapsedTime < 0.4 ) {
					newScrollY += (e.touch.dy*4);
					if ( newScrollY < -this.scroll.height ) newScrollY = -this.scroll.height;
					else if ( newScrollY > 0 ) newScrollY = 0;
					var self = this;
					this.$scrollingContainer.animate( { top: newScrollY }, { duration: Utils.map( dy, 20, this.height * .75, 1300, 800 ), easing: 'easeOutQuad', step: function( now, fx ) {
						self._updateScrollbarY( now );
					} } );
				} else {
					this.touch.lastX = e.touch.dy;
					this.$scrollingContainer.css( {
						top: newScrollY
					});
					this._updateScrollbarY( newScrollY );
				}
				

				//console.log( newScrollY + ' >> ' + -this.scroll.height );
			}

			
			
		}
	};













	// ---------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------
	// ---------------------------------------------------------------------------------------------------------------------------


	var _console = false;

	var Console = function Console() {
		$( 'body' ).append( "<console id='console-module' style='z-index: 999; overflow: scroll'>CONSOLE</console>" );

		this.$el = $( '#console-module' );
		var $el = this.$el;

		var oldLog = console.log;

		console.log = function( args_, list_ ) {
			oldLog( args_ );

			if ( typeof args_ == 'object' ) args_ = '{object}';
			if ( typeof args_ == 'string' || typeof args_ == 'number' || typeof args_ == 'boolean' ) {
				if ( list_ === false ) {
					$el.html( args_ );
				} else {
					$el.html( $el.html() + '<br />' + args_ );
					$el.scrollTop( $el[0].scrollHeight );
				}
				
			}
		};
	};

	Console.prototype = {
		hide: function() {
			this.$el.css( 'display', 'none' )
		},
		show: function() {
			this.$el.css( 'display', 'block' );
		}
	}

	var initConsole = function( show_ ) {
		if ( !_console ) _console = new Console();

		if ( show_ === false ) _console.hide();
		else if ( show_ === true ) _console.show();

		return _console;
	}

	// ---------------------------------------------------------------------------------------------------------------------------

	var init = function() {
		initTouchListener();

		document.createElement( 'app' );
		document.createElement( 'view' );
		document.createElement( 'views' );

		document.createElement( 'pagination' );
		document.createElement( 'console' );
		document.createElement( 'clipper' );

		document.createElement( 'slide' );
		document.createElement( 'flag' );
		document.createElement( 'slides' );
		document.createElement( 'card' );
		document.createElement( 'back' );
		document.createElement( 'front' );

		//document.createElement( 'viewport' );

		document.createElement( 'toucharea' );
		document.createElement( 'touchcontent' );

		manager = new Manager();

	}

	var manager = false;
	var viewController = false;
	


	// ===========================================================================================================================
	// ===========================================================================================================================


	var o = {
		Nav: Nav,
		console: initConsole,
		manager: function() {
			return manager;
		},
		controller: function() {
			return manager;
		}
	};

	manager.toString = function() {
		return manager;
	}

	init();

	return o;

})();


/*! Copyright 2012, Ben Lin (http://dreamerslab.com/)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 1.0.16
 *
 * Requires: jQuery >= 1.2.3
 */
(function(a){a.fn.addBack=a.fn.addBack||a.fn.andSelf;
a.fn.extend({actual:function(b,l){if(!this[b]){throw'$.actual => The jQuery method "'+b+'" you called does not exist';}var f={absolute:false,clone:false,includeMargin:false};
var i=a.extend(f,l);var e=this.eq(0);var h,j;if(i.clone===true){h=function(){var m="position: absolute !important; top: -1000 !important; ";e=e.clone().attr("style",m).appendTo("body");
};j=function(){e.remove();};}else{var g=[];var d="";var c;h=function(){c=e.parents().addBack().filter(":hidden");d+="visibility: hidden !important; display: block !important; ";
if(i.absolute===true){d+="position: absolute !important; ";}c.each(function(){var m=a(this);var n=m.attr("style");g.push(n);m.attr("style",n?n+";"+d:d);
});};j=function(){c.each(function(m){var o=a(this);var n=g[m];if(n===undefined){o.removeAttr("style");}else{o.attr("style",n);}});};}h();var k=/(outer)/.test(b)?e[b](i.includeMargin):e[b]();
j();return k;}});})(jQuery);

/* from http://sevennet.org/2014/12/05/how-to-can-jquery-get-all-css-styles-associated-with-an-element/ */
function css(a) { var sheets = document.styleSheets, o = {}; for (var i in sheets) { var rules = sheets[i].rules || sheets[i].cssRules; for (var r in rules) { if (a.is(rules[r].selectorText)) { o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style'))); } } } return o; } function css2json(css) { var s = {}; if (!css) return s; if (css instanceof CSSStyleDeclaration) { for (var i in css) { if ((css[i]).toLowerCase) { s[(css[i]).toLowerCase()] = (css[css[i]]); } } } else if (typeof css == "string") { css = css.split("; "); for (var i in css) { var l = css[i].split(": "); s[l[0].toLowerCase()] = (l[1]); } } return s; } 



