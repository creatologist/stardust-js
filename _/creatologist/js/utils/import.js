/*	
		============================================================================
 		*
		*	_.import
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	Just stick it in there!
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

//------------------------------------------------------------------- _.import

var _ = _ ? _ : {};
var __ = __ ? __ : {};

if ( !_.import ) {
	
	_.import = function( path, options ) {
		if ( path.indexOf( '.js' ) != -1 ) __.import.script( path, options );
		else if ( path.indexOf( '.css' ) != -1 ) __.import.stylesheet( path, options );
	};
	
	__.import = {};
	
	__.import.script = function( path, options ) {
		if ( _.is( options ) && _.is( options.preload ) ) {
			__.import.preload( path, options, 'script' );
			return;
		}
		var _s = document.createElement( 'script' );
		_s.src = path;
		document.head.appendChild( _s );
		if ( _.is( options ) && _.is( options.success ) ) options.success();
	}
	
	__.import.preload = function( path, options, type ) {
		 __.$( '_.import', { success: function() { __.import._preload( path, options, type ); } } );
	}
	
	__.import._preload = function( path, options, type ) {
		$.get( path, function() {
			if ( _.is( options ) && _.is( options.success ) ) {
	    		if ( type == 'script' ) __.import.script( path, { success: options.success } );
				else if ( type == 'stylesheet' ) __.import.stylesheet( path, { success: options.success } );
	    	} else {
	    		if ( type == 'script' ) __.import.script( path );
				else if ( type == 'stylesheet' ) __.import.stylesheet( path );
	    	}
		}).error( function() {
			if ( _.is( options ) && _.is( options.fail ) ) options.fail();
		});
	}
	
	__.import.stylesheet = function( path, options ) {
		if ( _.is( options ) && _.is( options.preload ) ) {
			__.import.preload( path, options, 'stylesheet' );
			return;
		}
		var _css = document.createElement( 'link' );
		_css.rel = 'stylesheet';
		_css.href = path;
		document.head.appendChild( _css );
		if ( _.is( options ) && _.is( options.success ) ) options.success();
	}

}