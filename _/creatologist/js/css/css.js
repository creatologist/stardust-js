/*	
		============================================================================
 		*
		*	_.CSS
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	easy CSS string creator
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

//------------------------------------------------------------------- _.CSS

var _ = _ ? _ : {};
_.CSS = _.CSS ? _.CSS : {};

_.CSS._get = function() {
	var _css = this.el + ' {';
	for ( key in this.styles ) {
		_css += ' ' + key + ': ' + this.styles[key] + ';';
	}
	_css += ' }; ';
	return _css;
}

_.CSS._addObject = function( styles, selfRef ) {
	for ( var key in styles ) { selfRef.styles[ key ] = styles[ key ]; }
	return selfRef;
}

_.CSS._addAny = function( arg1, arg2, selfRef ) {
	selfRef.styles[ arg1 ] = arg2;
	return selfRef;
}

_.CSS.create = function( el, styles ) {
	var o = {};
	o.el = el;
	o.styles = _.is( styles, 'object' ) ? styles : {};
	o.add = _.overload(
		[ [ Object ], function( o ) { return _.CSS._addObject( o, this ); }, o ],
		[ [ _, _ ], function( a, b ) { return _.CSS._addAny( a, b, this ); }, o ]
	);
	o.get = _.CSS._get;
	return o;
};