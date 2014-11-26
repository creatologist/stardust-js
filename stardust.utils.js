/*	
		============================================================================
 		*
		*	StardustJS - Utils
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

var Utils = Utils ? Utils : (function() {

	// ---------------------------------------------------------------------------------------------------------------------------
	
	var clamp = function( val, min, max ) {
		if ( val <= max && val >= min ) return val;
		else return val > max ? max : min;
	};


	// ---------------------------------------------------------------------------------------------------------------------------


	var overload = function( funcs ) {
		var a = [];
		for ( var i = 0, len = arguments.length; i < len; i++ ) {
			a.push( arguments[i] );
		}
		
		return function() {
			var _o = a;
			var _funcs = [];
			var _args = [];
			var _i;
			
			for ( _i = _o.length; _i--; ) {
				if ( _o[_i][0].length == arguments.length ) _funcs.push( _o[_i] );
			}
			
			for ( var _j = 0, _len = arguments.length; _j < _len; _j++ ) {
				_args.push( arguments[_j] );
			}
			
			for ( _i = _funcs.length; _i--; ) {
				if ( is( _args, _funcs[_i][0] ) ) {
					if ( is( _funcs[_i][2] ) ) {
						return _funcs[_i][1].apply( _funcs[_i][2], _args );
					}
					else return _funcs[_i][1].apply( null, _args );
				}
			}
		}
	};


	// ---------------------------------------------------------------------------------------------------------------------------

	var map = function( value, start1, stop1, start2, stop2, limit ) {
		var m = ( value - start1 ) / ( stop1 - start1 );
		var m2 = stop2 - start2;
		
		var m3 = m2 * m;
		
		var result = start2 + m3;
		
		if ( limit ) {
			if ( result > stop2 ) result = stop2;
			else if ( result < start2 ) result = start2;
		};
		
		
		return result;
	};


	// ---------------------------------------------------------------------------------------------------------------------------

	var DPI;

	var calculateDPI = function( val ) {

		//if ( val ) return DPI;

		// Pure JS Version --
		/*var $head = document.head;
			$head.innerHTML += '<style id="' + 'dpi-sniffer-css' + '" type="text/css"></style>';

		var $dpiSnifferCSS = document.getElementById( 'dpi-sniffer-css' );
			$dpiSnifferCSS.innerHTML += '#dpi-sniffer{width: 1px; height: 1px; left: -999px; top: -999px; display: none;}';
			$dpiSnifferCSS.innerHTML += '@media screen and (-webkit-min-device-pixel-ratio: 2) {#dpi-sniffer {width: 2px;height: 2px; display: none;}}';

		var $el = document.createElement( 'div' );
			$el.id = 'dpi-sniffer';

		//document.body.appendChild( $el );

		document.body.innerHTML += '<div id="dpi-sniffer"></div>';

		//console.log( parseInt( window.getComputedStyle( document.getElementById( 'dpi-sniffer' ) ).width ) );
		//sleep( 100 );

		var getDpi = function() {
			DPI = parseInt( window.getComputedStyle( document.getElementById( 'dpi-sniffer' ) ).width );
			if ( DPI < 1 ) DPI = 1;
			//console.log( DPI );
		}

		getDpi();

		//sleep( 100 );

		return DPI;*/

		// Jquery Version

		$( 'head' ).append( '<style id="' + 'dpi-sniffer-css' + '" type="text/css"></style>' );

		var $dpiSnifferCSS = $( '#dpi-sniffer-css' );
			$dpiSnifferCSS.append( '#dpi-sniffer{width: 1px; height: 1px; display: none;}' );
			$dpiSnifferCSS.append( '@media screen and (-webkit-min-device-pixel-ratio: 2) {#dpi-sniffer {width: 2px;height: 2px;}}' );

		$( 'body' ).append( '<div id="dpi-sniffer"></div>' );

		var $dpiSniffer = $( '#dpi-sniffer' );

		DPI = $dpiSniffer.width();

		$dpiSniffer.remove();

		return DPI;
	};

	// ---------------------------------------------------------------------------------------------------------------------------

	var dpi = function( val ) {
		if ( window.jQuery == undefined ) {
			console.log( '[Utils.dpi] jQuery library needed' );
			return val;
		}

		if ( !DPI ) calculateDPI();

		if ( val ) return val * DPI;
		else return DPI;
	};


	// ---------------------------------------------------------------------------------------------------------------------------

	var browserInfo = {
		
		ready			: false,
		
		browser			: {
			
			agent		: null,
			version		: null,
			name		: null,
			os			: null,
			mobile		: false,
			is_mobile	: false
			
		},
		
		get				: function() {
			
			this.browser.agent = navigator.userAgent.toLowerCase();
			
			var osInfo = navigator.appVersion.toLowerCase();
			 
			if ( osInfo.indexOf( 'win' ) != -1 ) this.browser.os = 'windows';
			if ( this.browser.os == null && osInfo.indexOf( 'mac' ) != -1 ) this.browser.os = 'mac';
			
			this.browser.name = this.browser.agent.match(/chrome/gi);
			if ( this.browser.name == null ) this.browser.name = this.browser.agent.match(/safari/gi);
			if ( this.browser.name == null ) this.browser.name = this.browser.agent.match(/firefox/gi);
			if ( this.browser.name == null ) this.browser.name = this.browser.agent.match(/msie/gi);
			
			if ( this.browser.name == null ) return;
			this.browser.name = this.browser.name[ 0 ];
			
			switch( this.browser.name ) {
				case 'chrome':
					if ( this.browser.agent.indexOf( 'chrome/' ) != -1 ) this.browser.version = this.browser.agent.split( 'chrome/')[1].split('.')[0];
					break;
				case 'safari':
					if ( this.browser.agent.indexOf( 'crios/' ) != -1 ) {
						// iPad Chrome App
						this.browser.version = this.browser.agent.split( 'crios/')[1].split('.')[0];
					} else if ( this.browser.agent.indexOf( 'version/' ) != -1 ) {
						this.browser.version = this.browser.agent.split( 'version/')[1].split('.')[0];
					}
					break;
				case 'firefox':
					if ( this.browser.agent.indexOf( 'firefox/' ) != -1 ) this.browser.version = this.browser.agent.split( 'firefox/')[1].split('.')[0];
					break;
				case 'msie':
					if ( this.browser.agent.indexOf( 'msie/' ) != -1 ) this.browser.version = this.browser.agent.split( 'msie/')[1].split('.')[0];
					else if ( this.browser.agent.indexOf( 'msie ' ) != -1 ) this.browser.version = this.browser.agent.split( 'msie ')[1].split('.')[0];
					break;
			}
			
			var platform = navigator.platform.toLowerCase();
			
			if ( this.browser.agent.indexOf( 'iphone' ) >= 0 ) this.browser.mobile = 'iphone';
			else if ( this.browser.agent.indexOf( 'ipad' ) >= 0 ) this.browser.mobile = 'ipad';
			else if ( this.browser.agent.indexOf( 'android' ) >= 0 ) this.browser.mobile = 'android';
			else if ( this.browser.agent.indexOf( 'ipod' ) >= 0 ) this.browser.mobile = 'ipod';
			
			if ( this.browser.mobile ) this.browser.is_mobile = true;
			
			this.ready = true;
			
			return this.browser;
			
		},
		
		version			: function() {
			if ( !this.ready ) return this.get().version;
			else return this.browser.version;
		},
		
		name			: function() {
			if ( !this.ready ) return this.get().name;
			else return this.browser.name;
		},
		
		os				: function() {
			if ( !this.ready ) return this.get().os;
			else return this.browser.os;
		},
		
		mobile			: function() {
			if ( !this.ready ) return this.get().mobile;
			else return this.browser.mobile;
		},
		
		is_mobile		: function() {
			if ( !this.ready ) return this.get().is_mobile;
			else return this.browser.is_mobile;
		},
		
		agent			: function() {
			if ( !this.ready ) return this.get().agent;
			else return this.browser.agent;
		}
		
	};

	browserInfo.get();

	/*function BrowserInfo( o ) {
		for ( key in o ) {
			this[ key ] = o[ key ];
		}
	};*/


	// ---------------------------------------------------------------------------------------------------------------------------

	var orientation = function( originalValue ) {
		if ( window.orientation ) {
			if ( originalValue ) {
				return window.orientation;
			}
			if ( Math.abs( window.orientation ) == 90 ) return 'landscape';
			else return 'portrait';
		} else if ( originalValue ) {
			if ( window.console ) console.log( '[Utils.orientation] not a mobile device' );
		}
		
		if ( window.innerWidth > window.innerHeight ) return 'landscape';
		else return 'portrait';
	};


	// ---------------------------------------------------------------------------------------------------------------------------

	var random = {
		flipCoin : function() {
			if ( Math.random() < .5 ) return true;
			else return false;
		},
		pick : function( array ) {
			var _len = array.length;
			var _chance = 1 / _len;
			var _random = Math.random();
			
			for ( var i = _len, j = 0; i > 0; i--,j++ ) {
				if ( _random >= ( _chance * j ) && _random <= ( _chance * ( j+1) ) ) return array[ i - 1 ];
			}
		}
	};

	// ---------------------------------------------------------------------------------------------------------------------------

	var ratio = function() {
		return window.innerWidth / window.innerHeight;
	};



	// ---------------------------------------------------------------------------------------------------------------------------

	 var is = function( o, type ) {
		if ( Array.isArray( o ) && Array.isArray( type ) ) {
			return areThese( o, type );
		};
		
		try {
			if ( type != undefined ) {
				if ( typeof o == type ) return true;
				else if ( o instanceof type ) return true;
				else if ( typeof o == type.name.toString().toLowerCase() ) return true;
				else if ( type.name.toString() == 'Array' && Array.isArray( o ) ) return true;
				else return false;
			}
			if ( typeof o == 'boolean' ) {
				if ( o === true ) return true;
				else return false;
			}
			if ( o || o != undefined ) return true;
			else return false;
		} catch( e ) {
			return false;
		}
	};

	var areThese = function( vars, types ) {
		var name;

		for ( var i = vars.length; i--; ) {
			name = types[i].name.toString().toLowerCase();
			if ( name === '' ) name = types[ i ];
			if ( !is( vars[i], name ) ) return false;
		}


		return true;
	};


	// ===========================================================================================================================
	// ===========================================================================================================================

	var o = {
		clamp : clamp,
		dpi : dpi,
		calculateDPI : calculateDPI,
		browserInfo : browserInfo.browser,
		orientation : orientation,
		map : map,
		random : random,
		ratio : ratio,
		overload : overload

	};

	o.orientation.toString = function() {
		return orientation();
	};

	o.ratio.toString = function() {
		return ratio();
	};

	o.dpi.toString = function() {
		return dpi();
	};

	return o;

})();