/*	
		============================================================================
 		*
		*	StardustJS - Trig
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

var Trig = (function() {

	window.Math = window.Math != undefined ? window.Math : {};

	Math.sq = function( n ) {
		return n*n;
	};

	// ---------------------------------------------------------------------------------------------------------------------------
	
	var toRadians = function toRadians( degrees ) {
		return degrees * (Math.PI / 180);
	};

	//

	var toDegrees = function toDegrees( radians ) {
		return radians * (180 / Math.PI);
	};

	// ---------------------------------------------------------------------------------------------------------------------------

	var pythag = function pythag( a, b ) {
		var a2 = Math.sq( a );
		var b2 = Math.sq( b );
		var c2 = a2 + b2;
		return Math.sqrt( c2 );
	};


	// ---------------------------------------------------------------------------------------------------------------------------

	var xFromAngleHypotenuse = function xFromAngleHypotenuse( angle, h ) {
		return h * Math.cos( Trig.toRadians( angle ) );
	};

	//
	
	var yFromAngleOpposite = function yFromAngleOpposite( angle, o ) {
		return o * Math.tan( Trig.toRadians( angle ) );
	};

	//
	
	var xyFromAngleHypotenuse = function xyFromAngleHypotenuse( angle, h ) {
		var o = {};
		o.x = Trig.xFromAngleHypotenuse( angle, h );
		o.y = Trig.yFromAngleOpposite( angle, o.x );
		return o;
	};


	// ---------------------------------------------------------------------------------------------------------------------------

	var degreesRadiusToPosition = function degreesRadiusToPosition( degrees, radius ) {
		var o = {};
		o.x = Math.cos( toRadians( degrees ) ) * radius;
		o.y = Math.sin( toRadians( degrees ) ) * radius;
		return o;
	};


	// ---------------------------------------------------------------------------------------------------------------------------

	var sssAngleA = function sssAngleA( a, b, c, degrees ) {
		var angle = ((b*b) + (c*c) - (a*a)) / (2 * b * c );
		angle = Math.acos( angle );
		if ( degrees ) angle = toDegrees( angle );
		return angle;
	};


	// ---------------------------------------------------------------------------------------------------------------------------

	var angle = function angle( a, b, distance ) {
		var _a = a.x - b.x,
			_b = a.y - b.y;

		var _c = Math.sqrt( _a*_a + _b*_b );
		var _angle = sssAngleA( _a, _b, _c, true );

		if (a.x > b.x) _angle += 90;
		else {
			_angle -= 180;
			_angle = Math.abs(_angle);
			_angle += 270;
			if (_angle == 360) _angle = 0;
			else if (_angle > 360) _angle -= 360;
		}
		if ( distance ) {
			return { angle: _angle, distance: _c };
		} else return _angle;
	};


	// ---------------------------------------------------------------------------------------------------------------------------

	var distance = function distance( a, b ) {
		var _a = a.x - b.x,
			_b = a.y - b.y;

		return Math.sqrt( _a*_a + _b*_b );
	};


	// ---------------------------------------------------------------------------------------------------------------------------

	var angleDistance = function( a, b ) {
		return angle( a, b, true );
	};


	// ---------------------------------------------------------------------------------------------------------------------------


	var Point = function( x, y ) {
		this.x = x ? x : 0;
		this.y = y ? y : 0;
	};

	Point.prototype = {
		distance : function( point ) {
			return Trig.distance( this, point );
		},
		
		distanceX : function( point ) {
			return point.x - this.x;
		},
		
		distanceY : function( point ) {
			return point.y - this.y;
		},
		
		angle : function( point ) {
			return Trig.angle( this, point );
		},

		angleDistance : function( point ) {
			Trig.angleDistance( this, point );
		},
		
		set : function( x, y ) {
			this.x = x ? x : this.x;
			this.y = y ? y : this.y;
		}
		
	};


	// ===========================================================================================================================
	// ===========================================================================================================================


	return {
		toRadians : toRadians,
		toDegrees : toDegrees,

		pythag : pythag,
		hypotenuse : hypotenuse,

		xFromAngleHypotenuse : xFromAngleHypotenuse,
		yFromAngleOpposite : yFromAngleOpposite,
		xyFromAngleHypotenuse : xyFromAngleHypotenuse,

		degreesRadiusToPosition : degreesRadiusToPosition,

		angle : angle,
		distance : distance,

		angleDistance : angleDistance,

		Point : Point
	};

})();