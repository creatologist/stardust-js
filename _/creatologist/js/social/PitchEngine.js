/*	
		============================================================================
 		*
		*	_.Social.PitchEngine
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	PitchEngine.com feed scraper.
 		* 	Their API / dev page wasn't working so I decided to make this.
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

//------------------------------------------------------------------- _.Social.PitchEngine

var _ = _ ? _ : {};
_.Social = _.Social ? _.Social : {};

if ( !_.Social.PitchEngine ) {
	
	_.Social.PitchEngine = function( feedName, options ) {
		
		this.feed_name = feedName;
		this.is_ready = false;
		
		this.on_complete = null;
		this.on_error = null;
		
		this.articles = [];
		
		this.init( options );
		
		return this;
	}
	
	_.Social.PitchEngine.prototype.init = function( options ) {
		if ( typeof options == 'function' ) {
			this.on_complete = options;
		} else if ( typeof options == 'object' ) {
			if ( options.complete != undefined ) this.on_complete = options.complete;
			if ( options.error != undefined ) this.on_error = options.error;
		}
		
		if ( !__.$( '_.Social.PitchEngine', { success: function() { this._getFeed(); } } ) ) return;
		
		return this;
	}
	
	_.Social.PitchEngine.prototype._getFeed = function() {		
		$.get( 'http://pitchengine.com/Feed/?br=' + this.feed_name , $.proxy( function(data) {
			
			var _articles = [];
			var _data = $( data ).find( 'article' );
			
			$.each( _data, function( key, val ) {
				var _a = $( val );
				var _article = {};
						
				_article.title 	= _a.find( 'h1 a' ).html();
				_article.link 	= 'http://pitchengine.com' + _a.find( 'h1 a' ).attr( 'href' );
				_article.blurb 	= _a.find( 'h2' ).html();
				_article.date 	= _a.find( 'time' ).html();
				
				//if ( window.console ) console.log(_a.find( '.pitch-main' )[0].innerHTML.indexOf( '</h2>' ) );
				
				var _s = _a.find( '.pitch-main' )[0].innerHTML;
				var _t;
				
				if ( _s.indexOf( '<strong>' ) != -1 ) _t = _s.substr( _s.indexOf( '<strong>' ), _s.length );
				else _s.substr( _s.indexOf( '</h2>' ) + 5, _s.length );
				
				_article.content = _t;	
				
				_articles.push( _article );
				
			} );
			
			this.articles = _articles;
			if ( this.on_complete ) this.on_complete( this.articles );
			
		}, this ) ).error( $.proxy( function() {
			if ( window.console ) console.log( '_.Social.PitchEngine !! couldn\'t get feed for ( ' + this.feed_name + ' )' );
			if ( this.on_error ) this.on_error();
		} , this ) );
	}
}