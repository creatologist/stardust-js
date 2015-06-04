/*	
		============================================================================
 		*
		*	_.Social.facebook
		*   _.Social.pinterest
		*   _.Social.twitter
		*   _.Social.email
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	Easy social(izing)
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

//------------------------------------------------------------------- _.Social

var _ = _ ? _ : {};
_.Social = _.Social ? _.Social : {};

//------------------------------------------------------------------- _.Social.facebook

if ( !_.Social.facebook ) {
	
	_.Social.facebook = {
	
		//------------------------------------------- PUBLIC
		
		share : function( params ) {
			
			if ( !params.url ) {
				this._say( 'needs url' );
				return;
			}
			
			var url = 'https://www.facebook.com/sharer/sharer.php?';
			
			url += 'u=' + params.url;
			
			window.open( url, '_blank' );
		},
		
		//------------------------------------------- PRIVATE
		
		_say : function( msg ) {
			
			if ( console && console.log ) console.log( '[facebook]' + msg );
			
		}
		
	};
	
}

//------------------------------------------------------------------- _.Social.twitter

if ( !_.Social.twitter ) {
	
	_.Social.twitter = {
	
		//------------------------------------------- PUBLIC
		
		share : function( params ) {
			
			if ( !params.text ) {
				this._say( 'needs text' );
				return;
			}
			
			var url = 'https://twitter.com/intent/tweet?';
			
			params.text = params.text.split( ' ' ).join( '+' );
			
			url += 'text=' + params.text;
			
			if ( params.url ) url += '&url=' + params.url;
			if ( params.via ) url += '&via=' + params.via;
			if ( params.hashtags ) url += '&hashtags=' + params.hashtags + ',';
			
			window.open( url, '_blank' );
		},
		
		//------------------------------------------- PRIVATE
		
		_say : function( msg ) {
			
			if ( console && console.log ) console.log( '[twitter]' + msg );
			
		}
		
		
	};
	
}


//------------------------------------------------------------------- _.Social.pinterest

if ( !_.Social.pinterest ) {
	
	_.Social.pinterest = {
	
		//------------------------------------------- PUBLIC
		
		share : function( params ) {
			
			if ( !params.url ) {
				this._say( 'needs url' );
				return;
			} else if ( !params.media && !params.imageURL ) {
				this._say( 'needs media -or- imageURL' );
				return;
			}
			
			var url = 'http://www.pinterest.com/pin/create/button/?';
			
			url += 'url=' + params.url;
			
			if ( params.media ) url += '&media=' + params.media;
			else if ( params.imageURL ) url += '&media=' + params.imageURL;
			
			if ( params.description ) url += '&description=' + params.description;
			
			window.open( url, '_blank' );
		},
		
		//------------------------------------------- PRIVATE
		
		_say : function( msg ) {
			
			if ( console && console.log ) console.log( '[pinterest]' + msg );
			
		}
		
	};
	
}

//------------------------------------------------------------------- _.Social.email

if ( !_.Social.email ) {
	
	_.Social.email = {
	
		//------------------------------------------- PUBLIC
		
		send : function( params ) {
			
			if ( !params.email ) {
				this._say( 'needs email address' );
				return;
			}
			
			var url = 'mailto:' + params.email;
			
			if ( params.subject ) url += '?subject=' + params.subject;
			if ( params.subject && params.body ) url += '&body=' + params.body;
			else if ( params.body ) url+= '?body=' + params.body;
			
			window.open( url, '_top' );
		},
		
		//------------------------------------------- PRIVATE
		
		_say : function( msg ) {
			
			if ( console && console.log ) console.log( '[email]' + msg );
			
		}
		
	};
	
}
