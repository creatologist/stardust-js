/*	
		============================================================================
 		*
		*	_.CSS3.translate3d
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	Only works in Webkit browsers for now
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

//------------------------------------------------------------------- _.CSS3.translate3d

var _ = _ ? _ : {};
_.CSS3 = _.CSS3 ? _.CSS3 : { stylesID	: 'creatologist-css3',  };

if ( !_.CSS3.translate3d ) {
	
	_.CSS3.translate3d = {
		animID			: 'creatologist-anim-t3d-',
		ready			: false,
	};
	
	_.CSS3.translate3d.get = function( el ) {
		var results = $( el ).css('-webkit-transform').match(/matrix(?:(3d)\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))(?:, (\d+)), \d+\)|\(\d+(?:, \d+)*(?:, (\d+))(?:, (\d+))\))/)
		var r;
		if(!results) {
			if ( $( el ).attr( 'style') != undefined && $( el ).attr( 'style').indexOf( 'translate3d(' ) != -1 ) {
				r = $( el ).attr( 'style' ).split( 'translate3d(' )[1].split( ',' );
				r = [ parseInt( r[0]), parseInt( r[1]), parseInt( r[2].split( ')' )[0] ) ];
				return { x: r[0], y: r[1], z: r[2] };
			} else return { x: 0, y: 0, z: 0 };
		}
		
		if(results[1] == '3d') {
			r = results.slice(2,5);
			return { x: r[0], y: r[1], z: r[2] };
		}
		
		results.push(0);
		r = results.slice(5, 8);
		return { x: r[0], y: r[1], z: r[2] }; 
	};
	
	_.CSS3.translate3d.set = function( el, options ) {
		if ( !this.ready ) {
			__.$( '_.CSS3', { success: function() {
				if ( $( '#' + _.CSS3.stylesID ).length == 0 ) $( 'head' ).append( '<style id="' + _.CSS3.stylesID + '" type="text/css"></style>' );
				_.CSS3.translate3d.ready = true;
				_.CSS3.translate3d._set( el, options );
			} } );
		} else {
			this._set( el, options );
		}
	}
	
	_.CSS3.translate3d._set = function( el, options ) {
		if ( !_.is( options, 'object' ) ) {
				if ( window.console ) console.log( '_.CSS3.translate3d !! options not valid' );
				return;
			}
			
			var _t3d = this.get( el );
			
			options.x = options.x != undefined ? options.x : _t3d.x;
			options.y = options.y != undefined ? options.y : _t3d.y;
			options.z = options.z != undefined ? options.z : _t3d.z;
			
			var custom = false;
			
			var css = { '-webkit-animation-fill-mode': 'forwards' };
			
			options.startX = options.startX != undefined ? options.startX : _t3d.x;
			options.startY = options.startY != undefined ? options.startY : _t3d.y;
			options.startZ = options.startZ != undefined ? options.startZ : _t3d.z;
			
			options.duration = options.duration != undefined ? ( options.duration * .001 ) : 1;
			options.easing = options.easing != undefined ? options.easing : 'linear';
			
			if ( options.easing == 'ease-out-back' ) {
				options.easing = 'ease-out';
				custom = 'ease-out-back';
			}
			
			var aniID = this.animID + Number( new Date() );
			
			css = $.extend( { '-webkit-animation-duration' : options.duration + 's' }, css );
			css = $.extend( { '-webkit-animation-timing-function' : options.easing }, css );
			css = $.extend( { '-webkit-animation-name' : aniID }, css );
			
			var animation = '@-webkit-keyframes ' + aniID + ' {';
			
			if ( custom && custom == 'ease-out-back' ) {
				
				var easeOutBack = function( which ) {
					switch ( which ) {
						case 'x':
							return options.x + ( ( options.x - options.startX ) * .15 );
							break;
						case 'y':
							return options.y + ( ( options.y - options.startY ) * .15 );
							break;
						case 'z':
							return options.z + ( ( options.z - options.startZ ) * .15 );
							break;
					}
				}
				
				animation += '0% { -webkit-transform: translate3d( ' + options.startX + 'px,' + options.startY + 'px,' + options.startZ + 'px ); }';
				animation += '60% { -webkit-transform: translate3d( ' + easeOutBack('x') + 'px,' + easeOutBack('y') + 'px,' + easeOutBack('z') + 'px ); }';
				animation += '100% { -webkit-transform: translate3d( ' + options.x + 'px,' + options.y + 'px,' + options.z + 'px ); }';
			} else {
				animation += '0% { -webkit-transform: translate3d( ' + options.startX + 'px,' + options.startY + 'px,' + options.startZ + 'px ); }';
				animation += '100% { -webkit-transform: translate3d( ' + options.x + 'px,' + options.y + 'px,' + options.z + 'px ); }';
			}
			
			animation += '}';
			
			$( '#' + _.CSS3.stylesID ).append( animation );
			$( el ).css( css );
			
			
			$( el ).animate( { fake: 0 }, { duration: options.duration, complete: function() {
				$( this ).css( '-webkit-transform', 'translate3d( ' + options.x + 'px,' + options.y + 'px,' + options.z + 'px )' );
				if ( options.complete != undefined ) options.complete();
			}});
	}

}