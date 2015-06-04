/*	
		============================================================================
 		*
		*	_.random
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	Oh so random!
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

//------------------------------------------------------------------- _.random

var _ = _ ? _ : {};

if ( !_.random ) {
	_.random = {};
	
	_.random.flipCoin = function() {
		if ( Math.random() < .5 ) return true;
		else return false;
	}
	
	_.random.pick = function( array ) {
		var _len = array.length;
		var _chance = 1 / _len;
		var _random = Math.random();
		
		for ( var i = _len, j = 0; i > 0; i--,j++ ) {
			if ( _random >= ( _chance * j ) && _random <= ( _chance * ( j+1) ) ) return array[ i - 1 ];
		}
	}

}