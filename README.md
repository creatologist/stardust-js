#StardustJS
Slowly building up this library with stuff I find useful. Maybe you'll find it useful too! :)


### Trig
```javascript
Trig.toRadians( deg );
Trig.toDegrees( rad );

Trig.pothag( a, b );

Trig.xFromAngleHypotenuse( angle, h );
Trig.yFromAngleOpposite( angle, o );
Trig.xyFromAngleHypotenuse( angle, h );

Trig.degreesRadiusToPosition( degrees, radius );

Trig.angle( a, b );
Trig.distance( a, b );

Trig.angleDistance( a, b );

Trig.Point [object]
```


### Utils
```javascript
Utils.clamp( val, min, max );
Utils.map( value, start1, stop1, start2, stop2, limit );

Utils.dpi(); // get screen dpi
Utils.dpi( val ); // calculate pixel value relative to dpi

Utils.browserInfo; // get agent, version, name, os, mobile, is_mobile
Utils.browserInfo();

Utils.orientation; // get screen orientation
Utils.orientation();

Utils.random.flipCoin(); // true or false
Utils.random.pick( array ); // returns picked array item

Utils.ratio(); // window ratio

Utils.overload( funcs ); // overload functions

```


### Social
```javascript
Social.Twitter.share( params );

Social.Facebook.share( params );
Social.Facebook.feed( params );

Social.Pinterest.share( params );

```
