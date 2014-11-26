#StardustJS
Slowly building up this library with stuff I find useful. Maybe you'll find it useful too! :)


### Trig
```javascript
Trig.toRadians( deg );
Trig.toDegrees( rad );

Trig.pythag( pointA, pointB ); // get hypotenuse of right angle
Trig.hypotenuse( pointA, pointB ); // same as pythag

Trig.xFromAngleHypotenuse( angle, hyp );
Trig.yFromAngleOpposite( angle, opp );
Trig.xyFromAngleHypotenuse( angle, hyp );

Trig.degreesRadiusToPosition( degrees, radius );

Trig.angle( pointA, pointB );
Trig.distance( pointA, pointB );

Trig.angleDistance( pointA, pointB );

Trig.Point [object]
	Point.distance( pointB );
	Point.distanceX( pointB );
	Point.distanceY( pointB );
	Point.angle( pointB );
	Point.angleDistance( pointB );
	Point.set( x, y );
```


### Utils
```javascript
Utils.clamp( val, min, max );
Utils.map( value, start1, stop1, start2, stop2, limit ); // map one set of numbers to another

Utils.dpi; // get screen dpi
Utils.dpi( val ); // calculate pixel value relative to dpi

Utils.browserInfo; // return [object] agent, version, name, os, mobile, is_mobile
Utils.orientation; // return screen orientation - 'portrait' vs 'landscape'
Utils.ratio; // return window ratio

Utils.random.flipCoin(); // true or false
Utils.random.pick( array ); // returns random array item

Utils.overload( funcs ); // overload functions

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


### Social
```javascript
Social.Twitter.share( params );

Social.Facebook.share( params );
Social.Facebook.feed( params );

Social.Pinterest.share( params );

```
