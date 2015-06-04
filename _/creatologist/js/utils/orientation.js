/*	
		============================================================================
 		*
		*	_.orientation
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	Take it easy.
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

//------------------------------------------------------------------- _.orientation

var _ = _ ? _ : {};

if ( !_.orientation ) {
	_.orientation = {};

	_.orientation.get = function( mobileValue ) {
		if ( window.orientation ) {
			if ( mobileValue ) {
				return window.orientation;
			}
			if ( Math.abs( window.orientation ) == 90 ) return 'landscape';
			else return 'portrait';
		} else if ( mobileValue ) {
			if ( window.console ) console.log( 'Utils.orientation !! not a mobile device' );
		}
		
		if ( window.innerWidth > window.innerHeight ) return 'landscape';
		else return 'portrait';
	}
}
