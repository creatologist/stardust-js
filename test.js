/*	
		============================================================================
 		*
		*	StardustJS - Test
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



var Test = Test ? Test : (function() {

	// ---------------------------------------------------------------------------------------------------------------------------
	
	var init = function() {

		// instead of Utils.random.flipCoin();
        var bool = random.flipCoin();

        // instead of Utils.map();
        var val = map( .2, 0, 1, 200, 800 );

        // instead of Shapes.getPath( CIRCLE, 100 );
        var path = getPath( CIRCLE, 100 );

        // instead of Trig.Point
        var p = new Point( 100, 100 );

		console.log( bool );
		console.log( val );
		console.log( path );
		console.log( p );

		// remove all namespaces
		namespaceManager.removeAll();
		// namespaceManager.remove( Utils );
		// namespaceManager.remove( Shapes );
		// namespaceManager.remove( Trig );

	};

	// ===========================================================================================================================
	// ===========================================================================================================================

	var o = {
		init : init
	};

	// use namespace - this adds namespaceManager for private / public use
	Utils.namespace( Utils, o );
	Utils.namespace( Shapes, o );
	Utils.namespace( Trig, o );

	return o;

})();