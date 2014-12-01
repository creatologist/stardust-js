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
	map( value, start1, stop1, start2, stop2, limit ); // map one set of numbers to another

	dpi; // get screen dpi
	dpi( val ); // get pixel value relative to dpi

	browserInfo; // get [object] agent, version, name, os, mobile, is_mobile
	orientation; // get screen orientation - 'portrait' vs 'landscape'
	ratio; // get window ratio

	random.flipCoin(); // true or false
	random.pick( array ); // get random array item

	overload( funcs ); // overload functions

```

### Utils.overload() - Overloading Functions
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

### Shapes (+Align)
```javascript
PLEASE READ:
// alignment is CENTER only - going to add alignment logic in later :)

// returns array of {x: xpos, y: ypos}
// for shape arg you can pass an enum value (number) or string value (lowercase)
Shapes.getPath( shape, props ); 

// set resolution of a circle (how many vertices) - default value = 36
Shapes.circleResolution( numPoints );

// save ENUMS in object (CIRCLE, TRIANGLE, SQUARE, etc.)
// in case you don't want to keep typeing out Shapes.CIRCLE, Shapes.TRIANGLE, etc
Shapes.storeEnums( window );

// Shapes ENUMS
Shapes. // getPath() props - ALL optional - default radius is 50
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

// save ENUMS in object (CENTER, TOP_LEFT, TOP, etc.)
// in case you don't want to keep typeing out Align.CENTER, Align.TOP_LEFT, etc
Align.storeEnums( window );

// Align ENUMS
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
