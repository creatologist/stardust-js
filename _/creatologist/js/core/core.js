/*	
		============================================================================
 		*
		*	_ < Core >
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

//------------------------------------------------------------------- _ < Core >

var _ = _ ? _ : {};
var __ = __ ? __ : {};

__.$ = function( whosChecking, options ) {
	if ( window.$ == undefined ) {
		__.max_check_$ = 5;
		if ( window.console ) console.log( whosChecking + ' !! needs a jQuery library' );
		if ( window.console ) console.log( whosChecking + ' !! attempting to import jQuery library ( creatologist/js/libs/jquery/jquery-1.7.2.min.js )..' );
		
		var script = document.createElement( 'script' );
		script.src = 'creatologist/js/libs/jquery/jquery-1.7.2.min.js';
		document.head.appendChild( script );
		
		setTimeout( function() { __.check_$( whosChecking, options ); }, 1 );
	} else {
		if ( options != undefined && options.success ) options.success();
		return true;
	}
}

__.max_check_$ = 5;

__.check_$ = function( whosChecking, options ) {
	if ( window.$ == undefined ) {
		if ( __.max_check <= 0 ) {
			if ( window.console ) console.log( whosChecking + ' !! import of jQuery library FAIL' );
			if ( options != undefined && options.fail ) options.fail();
			return;
		}
		setTimeout( function() { __.max_check_$--; __.check_$( whosChecking, options ); }, 100 );
	} else {
		if ( window.console ) console.log( whosChecking + ' !! import of jQuery library SUCCESS' );
		if ( options != undefined && options.success ) options.success();
	}
}

__.check_$ui = function( whosChecking, options ) {
	if ( window.jQuery.ui == undefined ) {
		if ( __.max_check <= 0 ) {
			if ( window.console ) console.log( whosChecking + ' !! import of jQuery UI library FAIL' );
			if ( options != undefined && options.fail ) options.fail();
			return;
		}
		setTimeout( function() { __.max_check_$--; __.check_$ui( whosChecking, options ); }, 100 );
	} else {
		if ( window.console ) console.log( whosChecking + ' !! import of jQuery UI library SUCCESS' );
		if ( options != undefined && options.success ) options.success();
	}
}

__.$ui = function( whosChecking, options ) {
	if ( window.jQuery.ui == undefined ) {
		__.max_check_$ = 5;
		if ( window.console ) console.log( whosChecking + ' !! needs a jQuery UI library' );
		if ( window.console ) console.log( whosChecking + ' !! attempting to import jQuery UI library ( creatologist/js/libs/jquery/jquery-ui-1.9.2.custom.min.js )..' );
		
		var script = document.createElement( 'script' );
		script.src = 'creatologist/js/libs/jquery/jquery-ui-1.9.2.custom.min.js';
		document.head.appendChild( script );
		
		setTimeout( function() { __.check_$ui( whosChecking, options ); }, 1 );
	} else {
		if ( options != undefined && options.success ) options.success();
		return true;
	}
}

__.temp = {};

_.is = function( o, type ) {
	if ( Array.isArray( o ) && Array.isArray( type ) ) {
		return _.areThese( o, type );
	};
	try {
		if ( type != undefined ) {
			if ( typeof o == type ) return true;
			else if ( typeof o == type.name.toString().toLowerCase() ) return true;
			else if ( type.name.toString() == 'Array' && Array.isArray( o ) ) return true;
			else if ( type == '_' ) return true;
			else return false;
		}
		if ( typeof o == 'boolean' ) {
			if ( o === true ) return true;
			else return false;
		}
		if ( o || o != undefined ) return true;
		else return false;
	} catch( e ) {
		return false;
	}
}

_.areThese = function( vars, types ) {
	var name;
	for ( var i = vars.length; i--; ) {
		if ( types[i] == _ ) name = '_';
		else name = types[i].name.toString().toLowerCase();
		if ( !_.is( vars[i], name ) ) return false;
	}
	return true;
}

_.overload = function( funcs ) {
	var a = [];
	for ( var i = arguments.length; i--; ) {
		a.push( arguments[i] );
	}
	
	return function() {
		var _o = a;
		var _funcs = [];
		var _args = [];
		var _i;
		
		for ( _i = _o.length; _i--; ) {
			if ( _o[_i][0].length == arguments.length ) _funcs.push( _o[_i] );
		}
		
		for ( var _j = 0, _len = arguments.length; _j < _len; _j++ ) {
			_args.push( arguments[_j] );
		}
		
		for ( _i = _funcs.length; _i--; ) {
			if ( _.is( _args, _funcs[_i][0] ) ) {
				if ( _.is( _funcs[_i][2] ) ) {
					return _funcs[_i][1].apply( _funcs[_i][2], _args );
				}
				else return _funcs[_i][1].apply( null, _args );
			}
		}
	}
}

_.class = function( parentClass, chained ) {
	//if ( chained == undefined ) __.parentClass = parentClass;
	if ( chained == undefined ) window[ parentClass()._class + '__' ] = parentClass;
	return { extends: function( childClass, childArguments ) {
		var parentName = parentClass()._class;
		//__.parentClass = parentClass;
		var i;
		if ( Array.isArray( childArguments ) ) i = childClass.apply( null, childArguments );
		else i = childClass.apply( null, [ childArguments ] );
		var j = parentClass(parentClass.arguments);
		if ( j.override ) {
			for ( var key in j.override ) {
				i[key] = j.override[key];
			}
			if ( i.override ) {
				for ( var key in i.override ) {
					if ( j.override[key] == undefined ) {
						j.override[key] = i.override[key]; 
					}
				}
			}
		}
		
		for ( var key in j ) {
			if ( typeof j[key] != 'function' ) {
				i[key] = j[key];
			}
		}
		
		window[parentClass()._class] = function() {
			return $.extend( i, window[ parentClass()._class + '__' ].apply( null, arguments ) );
		};
		
		return { extends: _.class( window[ parentClass()._class ], true ).extends };
	}};
}

_.delay = function( time ) {
	var time = _.is( time, 'number' ) ? time : 1;
	if ( time > 250 ) time = 250;
	var t = Number( new Date() ) + time;
	while ( Number( new Date() ) < t ) {};
}


_.isThis = function( o, type ) {
	try {
		if ( type != undefined ) {
			if ( typeof o == type ) return { and: _.isThis, ok: true };
			else return { and: _.itIsnt, ok: false };
		}
		if ( typeof o == 'boolean' ) {
			if ( o === true ) return { and: _.isThis, ok: true };
			else return { and: _.itIsnt, ok: false };
		}
		if ( o || o != undefined ) return { and: _.isThis, ok: true };
		else return { and: _.itIsnt, ok: false };	
	} catch( e ) {
		return { and: _.itIsnt, ok: false };
	}
}

_.itIsnt = function( o, type ) {
	return { and: _.itIsnt, ok: false };
}