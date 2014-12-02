#StardustJS
Slowly building up this library with stuff I find useful. Maybe you'll find it useful too! :)


### Trig
```javascript
Trig.
	toRadians( deg );
	toDegrees( rad );

	pythag( pointA, pointB ); // get hypotenuse of right angle
	hypotenuse( pointA, pointB ); // same as pythag

	xFromAngleHypotenuse( angle, hyp );
	yFromAngleOpposite( angle, opp );
	xyFromAngleHypotenuse( angle, hyp );

	degreesRadiusToPosition( degrees, radius );

	angle( pointA, pointB );
	distance( pointA, pointB );

	angleDistance( pointA, pointB );

Trig.Point [object]
	distance( pointB );
	distanceX( pointB );
	distanceY( pointB );
	angle( pointB );
	angleDistance( pointB );
	set( x, y );
```


### Utils
```javascript
Utils.
	clamp( val, min, max );
	map( value, currStart, currEnd, newStart, newEnd, limit ); // map one set of numbers to another

	dpi; // get screen dpi -- needs jQuery library
	dpi( val ); // get pixel value relative to dpi

	browserInfo; // get [object] agent, version, name, os, mobile, is_mobile
	orientation; // get screen orientation - 'portrait' vs 'landscape'
	ratio; // get window ratio

	random.flipCoin(); // true or false
	random.pick( array ); // get random array item

	overload( funcs ); // overload functions - like in C++
	namespace( giver, inheritor ); // inherit functions + objects from giver - like "use namespace" in C++

```

### Utils.overload() - Overloading Functions (like in C++)
```javascript
var Particles = [];

var Particle = function( x, y ) {
	this.x = x ? x : 0;
	this.y = y ? y : 0;
}

// arguments: Particle
var func1 = function( p ) {
	// add particle
	Particles.push[ p ];
};

// arguments: Number, Number
var func2 = function( x, y ) {
	// create and add particle
	Particles.push[ new Particle( x, y ) ];
};

// create overloaded function
var addParticle = Utils.overload(
	[ [ Particle ], func1 ],
	[ [ Number, Number ], func2 ]
);

// create particle
var p = new Particle( 50, 50 );

// create and/or add particles via overloaded function
addParticle( 100, 100 );
addParticle( p );
```

### Utils.namespace() - Use Namespace (like in C++)
```javascript
var APP = (function() {
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

	// =================================================================
	var o = {
		init: init
	};
	
	// use namespace - this adds namespaceManager for private / public use
	// to utilize in your own objects you need to add property "namespace" = variable name
	Utils.namespace( Utils, o );
	Utils.namespace( Shapes, o );
	Utils.namespace( Trig, o );

	return o;
})();
```

### Shapes
```javascript
Shapes.
// returns array of {x: xpos, y: ypos}
// for shape arg you can pass an enum value (number) or string value (lowercase)
	getPath( shape, xtraArgs ); 

	circleResolution; // get circleResolution -- default value = 36
	circleResolution( numVertices ); // set resolution / smoothness of circle

	defaultRadius; // get defaultRadius
	defaultRadius( radius ); // set defaultRadius

// Shapes ENUMS - stored in window / global scope - please comment out if you want
// Shapes.storeEnums( window );
Shapes. // getPath() additional arguments - ALL optional - defaultRadius is 50
	CIRCLE; // radius, origin, alignment, points
	TRIANGLE; // radius, origin, alignment
	SQUARE; // radius, origin, alignment
	RECTANGLE; // width, height, origin, alignment
	PENTAGON; // radius, origin, alignment
	HEXAGON; // radius, origin, alignment
	HEPTAGON; // radius, origin, alignment
	OCTAGON; // radius, origin, alignment
	NONAGON; // radius, origin, alignment
	DECAGON; // radius, origin, alignment
```

### Align (included in Shapes)
```javascript
// Align ENUMS - stored in window / global scope - please comment out if you want
// Align.storeEnums( window );
Align.
	CENTER;
	TOP_LEFT;
	TOP;
	TOP_RIGHT;
	RIGHT;
	BOTTOM_RIGHT;
	BOTTOM;
	BOTTOM_LEFT;
	LEFT;

```

### Social
```javascript
Social.
	Twitter.share( params );

	Facebook.share( params );
	Facebook.feed( params );

	Pinterest.share( params );

```
