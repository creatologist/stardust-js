var touchlistener = false;

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
		if ( document.addEventListener ) {
			document.addEventListener( 'touchstart', this._onTouchStart.bind( this ), true);
			document.addEventListener( 'touchmove', this._onTouchMove.bind( this ), true);
			document.addEventListener( 'touchend', this._onTouchEnd.bind( this ), true);
		}

		this.body = $( 'body' )[0];
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

		if ( touchevent_ == 'touchend' ) {
			data.elapsedTime = this.elapsedTime;
			data.clicked = false;
			//console.log( this.touch, this.elapsedTime );
			//if ( Math.abs( this.touch.dx ) < 3 && Math.abs( this.touch.dy ) < 3 ) data.clicked = true;
			if ( this.touch.dx === 0 && this.touch.dy === 0 ) data.clicked = true;
		}

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

	_calcDelta: function( e, touchEnd ) {
		//if ( this.busy() ) return;
		
		//console.log( this.busy() );
		//console.log( Math.random() );

		//console.log( e.changedTouches );

		this.touch.dx = e.changedTouches[ 0 ].pageX - this.touch.x;
		this.touch.dy = e.changedTouches[ 0 ].pageY - this.touch.y;
		this.direction.y = this.touch.dy < 0 ? 'up' : 'down';
		this.direction.x = this.touch.dx > 0 ? 'right' : 'left';

		//console.log( this.touch.dx );

		this.scroll.top = this.body.scrollTop;
		this.scroll.left = this.body.scrollLeft;

		this.scroll.width = this.body.scrollWidth;
		this.scroll.height = this.body.scrollHeight;
		
		
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
			/*if ( this.view.params.scrolling && this.elapsedTime < .4 ) {
				var self = this;
				var newScrollTop = this.scroll.top - this.scroll.dy*6;

				if ( newScrollTop <= 0 ) newScrollTop = 0;

				this.view.$content.stop( true ).animate( { top: this.scroll.top - this.touch.dy*6 }, { duration: 1500, easing: 'easeOutQuad', step: function( now, fx ) {
					//console.log( Math.random() );
					//console.log( this.name );
					//console.log( now );
					//self.scroll.top = self.view.getScrollTop();
					if ( now <= 0 ) self.scroll.top = 0;
					else self.scroll.top = now;
					if ( !self.isBusy ) self._emitUpdateEvent( 'touchscroll' );
				}});
				this._emitUpdateEvent( 'touchend' );
			} else {
				//console.log( 'weee' );
				this._emitUpdateEvent( 'touchend' );
			}*/



			this._emitUpdateEvent( 'touchend' );

			
		} else if ( touchEnd === 'start' ) {
			this._emitUpdateEvent( 'touchstart' );
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

		this.scroll.startTop = this.body.scrollTop;
		this.scroll.startLeft = this.body.scrollLeft;

		//console.log( e );
		//console.log( e.pageX );
		this.touch.x = e.pageX || e.touches[0].pageX;
		this.touch.y = e.pageY || e.touches[0].pageY;

		this._calcDelta( e, 'start' );

		//console.log( this.touch.x, this.touch.y );

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

$( document ).ready(function() {
	touchlistener = new TouchListener();
});