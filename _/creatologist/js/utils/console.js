/*	
		============================================================================
 		*
		*	_.console
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	Override console.log() for debugging.
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

//------------------------------------------------------------------- _.console

var _ = _ ? _ : {};

if ( !_.console ) {

	_.console = {
		stylesID : 'creatologist-console'
	};
	
	_.console.log = function( a ) {
		$( _.console._ ).html( $( _.console._ ).html() + a + '<br />' );
		$( _.console._ ).scrollTop( $( _.console._ )[0].scrollHeight );
	}
	
	_.console.is_visible = true;
	
	_.console.hide = function( ) {
		$( _.console.__ ).hide();
		_.console.is_visible = false;
	}
	
	_.console.show = function( ) {
		$( _.console.__ ).show();
		_.console.is_visible = true;
	}
	
	_.console.toggleVisibility = function( ) {
		if ( _.console.is_visible ) _.console.hide();
		else _.console.show();
	}
	
	_.console.create = function( o ) {
		if ( _.is( o, 'object' ) && _.is( o.draggable ) ) {
			__.$( '_.console', { success: function() { 
				__.$ui( '_.console', { success: function() {
					_.console._create( o );	
				}});
			} } );
		} else {
			__.$( '_.console', { success: function() { _.console._create( o ); } } );
		}
		
	}
	
	_.console._create = function( o ) {
		var _width = 600, _height = 120, _draggable = false, _theme = 'light', _fontSize = 14;
		
		var _draggable = false;
		
		if ( _.is( o, 'object' ) ) {
			if ( o.width ) _width = o.width;
			if ( o.height ) _height = o.height;
			if ( o.draggable == true ) _draggable = true;
			if ( o.theme ) _theme = o.theme;
			if ( o.fontSize ) _fontSize = o.fontSize;
		}
		
		jQuery('<div/>', {
		    id: 'utils-console_',
		    style: 'position: fixed; z-index: 999; width: ' + _width + 'px; height: ' + _height + 'px; bottom: 0px; left: 50%; margin-left: ' + -_width*.5 + 'px; margin-right: -15px;'
		}).appendTo('body');
		
		var _bg = 'white', _color = 'black';
		
		if ( _theme == 'dark' ) {
			_bg = 'black';
			_color = 'white';
		}
		
		jQuery('<div/>', {
		    id: 'utils-console-bg',
		    style: 'position: absolute; top: 0px; left: 0px; width: inherit; height: inherit; background-color: ' + _bg + '; opacity: 0.6; filter:alpha(opacity=60);'
		}).appendTo('#utils-console_');
		
		jQuery('<div/>', {
		    id: 'utils-console-bar',
		    style: 'position: absolute; top: -27px; color:' + _color + ';font-size: 14px; padding: 6px; left: 0px; width: ' + ( _width - 12 ) + 'px; height: ' + ( 26 - 12 ) + 'px; background-color: ' + _bg + '; opacity: 0.6; filter:alpha(opacity=60);'
		}).html( '_.console' ).appendTo('#utils-console_');
		
		var _style = 'position: absolute; font-size: ' + _fontSize + 'px; line-height: ' + (_fontSize + 5) + 'px; overflow: auto; color: ' + _color + '; z-index: 1; width: ' + ( _width - 10 );
		_style += 'px; height: ' + ( _height - 10 ) + 'px; top: 5px; left: 5px;'
		
		jQuery('<div/>', {
		    id: 'utils-console',
		    style: _style
		}).appendTo('#utils-console_');
		
		this._ = $( '#utils-console' );
		this.__ = $( '#utils-console_' );
		
		if ( _draggable ) {
			this.__.draggable( { handle: '#utils-console-bar' });
			$( 'head' ).append( '<style id="' + this.stylesID + '" type="text/css"></style>' );
			$( '#' + this.stylesID ).append( '#utils-console-bar:hover { cursor: move; }' );
		}
		
		if ( window.console ) {
			console.log = this.log;
			console.error = this.log;
		}
	}
}