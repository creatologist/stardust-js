/*	
		============================================================================
 		*
		*	StardustJS - Shapes
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

var Align = Align ? Align : (function() {

	var positions = [
		'center',
		'top_left',
		'top',
		'top_right',
		'right',
		'bottom_right',
		'bottom',
		'bottom_left',
		'left'
	]


	// ---------------------------------------------------------------------------------------------------------------------------
	
	var storeEnums = function( el ) {
		if ( typeof el !== 'object' ) return;

		for ( var i = positions.length; i--; ) {
			el[ positions[ i ].toUpperCase() ] = i;
		}
	}


	// ===========================================================================================================================
	// ===========================================================================================================================

	var o = {
		storeEnums: storeEnums
	}

	storeEnums( o );
	storeEnums( window );

	return o;

})();

var Shapes = Shapes ? Shapes : (function() {

	var shapes = [
		'circle',
		'triangle',
		'square',
		'rectangle',
		'pentagon',
		'hexagon',
		'heptagon',
		'octagon',
		'nonagon',
		'decagon'
	]

	var _ = {};

	var point = function( x, y, origin ) {
		return { x: origin ? x + origin.x : x, y: origin ? y + origin.y : y };
	};

	var align = function( point, alignment, radiusX, radiusY ) {
		switch( alignment ) {
			case Align.CENTER:
				
				break;
			case Align.LEFT:
				point.x += radiusX;
				break;
			case Align.RIGHT:
				point.x -= radiusX;
				break;
			case Align.TOP_LEFT:
				point.x += radiusX;
				point.y += radiusY;
				break;
			case Align.TOP_RIGHT:
				point.x -= radiusX;
				point.y -= radiusY;
				break;
			case Align.TOP:
				point.y += radiusY;
				break;
			case Align.BOTTOM:
				point.y -= radiusY;
				break;
			case Align.BOTTOM_LEFT:
				point.x += radiusX;
				point.y -= radiusY;
				break;
			case Align.BOTTOM_RIGHT:
				point.x -= radiusX;
				point.y -= radiusY;
				break;
		}

		return point;
	};


	// ---------------------------------------------------------------------------------------------------------------------------
	
	var storeEnums = function( el ) {
		if ( typeof el !== 'object' ) return;

		for ( var i = shapes.length; i--; ) {
			el[ shapes[ i ].toUpperCase() ] = i;
		}
	}

	// ---------------------------------------------------------------------------------------------------------------------------

	var circleResolution = function( val ) {
		circleResolution.toString = function() { 
			return val;
		}
	};

	circleResolution( 36 );


	// ---------------------------------------------------------------------------------------------------------------------------

	var getPath = function( shape ) {

		if ( typeof shape === 'number' ) shape = shapes[ shape ];

		var args = Array.prototype.slice.call( arguments );
			args.shift();

		return _[ shape.toLowerCase() ].apply( this||window, args );

	};

	// ---------------------------------------------------------------------------------------------------------------------------

	var rectangle = function( width, height, origin, alignment ) {
		width		= width ? width : 50;
		height 		= height ? height : 50;
		origin 		= origin ? origin : { x: 0, y: 0 };
		alignment 	= alignment ? alignment : Align.CENTER;

		var half_w = width >> 1,
			half_h = height >> 1;

		var path = [];

		path[ 0 ] = point( -half_w, -half_h, origin );
		path[ 1 ] = point( half_w, -half_h, origin );
		path[ 2 ] = point( half_w, half_h, origin );
		path[ 3 ] = point( -half_w, half_h, origin );

		if ( alignment !== Align.CENTER ) {
			path[ 0 ] = align( path[ 0 ], alignment, half_w, half_h );
			path[ 1 ] = align( path[ 1 ], alignment, half_w, half_h );
			path[ 2 ] = align( path[ 2 ], alignment, half_w, half_h );
			path[ 3 ] = align( path[ 3 ], alignment, half_w, half_h );
		}

		return path;
	};

	var square = function( radius, origin, alignment ) {
		return rectangle( radius, radius, origin, alignment );
	};


	// ---------------------------------------------------------------------------------------------------------------------------

	var circle = function( radius, origin, alignment, points ) {
		radius 		= radius ? radius : 50;
		origin 		= origin ? origin : { x: 0, y: 0 };
		alignment 	= alignment ? alignment : Align.CENTER;
		points 		= points ? points : circleResolution;

		var path = [];

		var inc = 360 / points;

		var point;

		for ( var i = 0; i < points; i++ ) {
			point = Trig.degreesRadiusToPosition( i * inc, radius );
			point.x += origin.x;
			point.y += origin.y;
			if ( alignment !== Align.CENTER ) point = align( point, alignment, radius, radius );
			path.push( point );
		}

		return path;
	};

	var triangle = function( radius, origin, alignment ) {
		return circle( radius, origin, alignment, 3 );
	};

	var pentagon = function( radius, origin, alignment ) {
		return circle( radius, origin, alignment, 5 );
	};

	var hexagon = function( radius, origin, alignment ) {
		return circle( radius, origin, alignment, 6 );
	};

	var heptagon = function( radius, origin, alignment ) {
		return circle( radius, origin, alignment, 7 );
	};

	var octagon = function( radius, origin, alignment ) {
		return circle( radius, origin, alignment, 8 );
	};

	var nonagon = function( radius, origin, alignment ) {
		return circle( radius, origin, alignment, 9 );
	};

	var decagon = function( radius, origin, alignment ) {
		return circle( radius, origin, alignment, 10 );
	};


	// ===========================================================================================================================
	// ===========================================================================================================================

	var o = {
		storeEnums: storeEnums,
		getPath : getPath,
		circleResolution : circleResolution
	}

	storeEnums( o );
	storeEnums( window );

	_ = {
		circle: circle,
		triangle: triangle,
		pentagon: pentagon,
		hexagon: hexagon,
		heptagon: heptagon,
		octagon: octagon,
		nonagon: nonagon,
		decagon: decagon,

		rectangle: rectangle,
		square: square
	}

	return o;

})();