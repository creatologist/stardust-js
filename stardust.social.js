/*	
		============================================================================
 		*
		*	StardustJS - Social
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

var Social = (function() {

	// ---------------------------------------------------------------------------------------------------------------------------

	var Twitter = (function() {

		var share = function share( params ) {
			if ( !params || !params.text ) return '-- need text';

			//var url = 'https://twitter.com/share?';
			var url = 'https://twitter.com/intent/tweet?';
			
			url += 'text=' + escape( params.text );

			//console.log( escape( params.text ) );
			
			if ( params.url ) url += '&url=' + params.url;
			if ( params.via ) url += '&via=' + params.via;
			if ( params.hashtags ) url += '&hashtags=' + params.hashtags + ',';
			
			var left,
				top,
				centerWindow = false;

			if ( window.screen ) {
				if ( window.screen.availHeight && window.screen.availWidth ) {
					centerWindow = true;
					left = window.screen.availWidth >> 1;
					left -= 650 >> 1;
					top = window.screen.availHeight >> 1;
					top -= 350 >> 1;
					top -= 60;
				}
			}

			if ( centerWindow ) window.open( url, '_blank', 'width=650,height=400,left=' + left +',top=' + top );
			else window.open( url, '_blank', 'width=650,height=350' );
			
		};

		return {

			share : share
			
		};

	})();


	// ---------------------------------------------------------------------------------------------------------------------------
	
	var Instagram = (function() {

		var connectCallback 	= null,

			client_id			= null,
			access_token 		= null,
			redirect_uri		= null;

		var connect = function connect( clientID, redirectURI, callback, scopes ) {

			if ( !clientID ) return '[!] need clientID';
			if ( !redirectURI ) return '[!] need redirectURI';

			if ( callback ) connectCallback = callback;

			client_id = clientID;
			redirect_uri = redirectURI;

			var url = 'https://api.instagram.com/oauth/authorize/?client_id=';
				url += clientID;
				url += '&redirect_uri=';
				url += redirectURI;
				url += '&response_type=token';

			if ( scopes ) url += '&scope=' + scopes;

			instaWindow = window.open( url, 'instaWindow', 'width=780,height=550' );

		};

		var saveToken = function saveToken( res ) {
			var index = res.indexOf( 'token=' );
			if ( index === -1 ) return '-- no token found';
			access_token = res.substr( index + 6, res.length );

			if ( connectCallback ) connectCallback();
		};

		var api = function api( request, callback, requestExtra ) {
			if ( !callback ) return '[!] need callback';

			var url;

			// for full path api calls and/or pagination
			if ( request.indexOf( 'api.instagram.com' ) != -1 ) {
				url = request;
			}

			// for api calls
			else {
				if ( !access_token ) return '[!] need accessToken >> connect()';
				url = 'https://api.instagram.com/' + _apiVersion + '/';
				url += request;
				url += '?access_token=' + access_token;
			}

			var type 		= 'GET',
				data 		= {},
				dataType	= 'jsonp';

			if ( typeof requestExtra == 'object' ) {
				if ( requestExtra.count ) url += '&count=' + requestExtra.count;
			} else {
				if ( requestExtra === 'POST' ) {
					type = 'POST';

					var index = url.indexOf( '?access' );

					if ( index !== -1 ) {
						url = url.substr( 0, index );
					}
				}
			}

			if ( type === 'GET' ) {
				$.ajax({
		            type 		: type,
		            dataType	: 'jsonp',
		            cache		: false,
		            url			: url,
		            success		: function( data ) {
		                callback( true, data );
		            },
		            error	 	: function() {
		            	callback( false );
		            }
		        });
			} else {

				$.ajax({
		            type 		: type,
		            data 		: 'access_token=' + access_token +'&method=delete',
		            dataType	: 'json',
		            cache		: false,
		            url			: url,
		            complete 	: function() {
		            	callback( true );
		            }
		        });
			}

			

		};

		var info = function info( callback, requestExtra ) {
			api( 'users/self', callback, requestExtra );
		};

		var feed = function like( callback, requestExtra ) {
			api( 'users/self/feed', callback, requestExtra );
		};

		var recent = function recent( callback, requestExtra ) {
			api( 'users/self/media/recent', callback, requestExtra );
		};

		var liked = function recent( callback, requestExtra ) {
			api( 'users/self/media/liked', callback, requestExtra );
		};

		var like = function like( mediaID, callback ) {
			api( 'media/' + mediaID + '/likes', callback, 'POST' );
		};

		var _apiVersion = 'v1';

		var apiVersion = function apiVersion( s ) {
			if ( s ) _apiVersion = s;
			else return _apiVersion;
		}

		return {
			connect : connect,
			saveToken : saveToken,
			apiVersion : apiVersion,

			api : api,

			info : info,
			feed : feed,
			recent : recent,
			liked : liked,

			like : like
			
			
		};

	})();



	// ---------------------------------------------------------------------------------------------------------------------------

	var Facebook = (function() {

		var share = function share( params ) {
			if ( !params.url ) return '-- needs url';
			
			var url = 'https://www.facebook.com/sharer/sharer.php?';
			
			url += 'u=' + params.url;
			
			var left,
				top,
				centerWindow = true;

			if ( window.screen ) {
				if ( window.screen.availHeight && window.screen.availWidth ) {
					centerWindow = true;
					left = window.screen.availWidth >> 1;
					left -= 650 >> 1;
					top = window.screen.availHeight >> 1;
					top -= 400 >> 1;
					top -= 60;
				}
			}

			if ( centerWindow ) window.open( url, '_blank', 'width=650,height=400,left=' + left +',top=' + top );
			else window.open( url, '_blank', 'width=650,height=400' );
		};

		var feed = function feed( params ) {

			if ( !params ) return '-- need params';
			if ( !params.app_id ) return '-- need app_id';

			var url = 'https://www.facebook.com/dialog/feed?display=popup';

			if ( params.app_id ) url += '&app_id=' + params.app_id;
			if ( params.caption ) url += '&caption=' + escape( params.caption );
			/*if ( params.link ) {
				url += '&link=' + params.link;
				url += '&redirect_uri=' + params.link;
			} else if ( params.redirect_uri ) {
				url += '&link=' + params.redirect_uri;
				url += '&redirect_uri=' + params.redirect_uri;
			}*/

			if ( params.link ) url += '&link=' + params.link;
			if ( params.redirect_uri ) url += '&redirect_uri=' + params.redirect_uri;
			if ( params.source ) url += '&source=' + params.source;
			if ( params.name ) url += '&name=' + params.name;
			if ( params.picture ) url += '&picture=' + params.picture;
			if ( params.description ) url += '&description=' + escape( params.description );

			var left,
				top,
				centerWindow = false;

			if ( window.screen ) {
				if ( window.screen.availHeight && window.screen.availWidth ) {
					centerWindow = true;
					left = window.screen.availWidth >> 1;
					left -= 650 >> 1;
					top = window.screen.availHeight >> 1;
					top -= 400 >> 1;
					top -= 60;
				}
			}

			if ( centerWindow ) window.open( url, '_blank', 'width=650,height=400,left=' + left +',top=' + top );
			else window.open( url, '_blank', 'width=650,height=400' );
		};

		var connect = function connect( appID, redirectURI, options ) {

			var url = 'https://www.facebook.com/v2.0/dialog/oauth?app_id=';
				url += appID;
				url += '&redirect_uri=';
				url += redirectURI;

			if ( options ) {
				var o = options;

				if ( o.display ) url += '&display=' + 'o.display';
				if ( o.scope ) url += '&scope=' + 'o.scope';
				if ( o.state ) url += '&state=' + 'o.state';
				if ( o.response_type ) url += '&response_type=' + 'o.response_type';
			}

			window.open( url, '_self' );
		};

		var mod = function mod( fb ) {
			
		};

		return {
			share : share,
			feed : feed,
			connect : connect
		};

	})();

	// ---------------------------------------------------------------------------------------------------------------------------

	var Pinterest = (function() {

		var share = function share( params ) {
			if ( !params.url ) return '-- needs url';
			
			var url = 'http://www.pinterest.com/pin/create/button/?';
			
			url += 'url=' + params.url;
				
			if ( params.media ) url += '&media=' + params.media;
			else if ( params.imageURL ) url += '&media=' + params.imageURL;
			
			if ( params.description ) url += '&description=' + params.description;
			
			var left,
				top,
				centerWindow = true;

			if ( window.screen ) {
				if ( window.screen.availHeight && window.screen.availWidth ) {
					centerWindow = true;
					left = window.screen.availWidth >> 1;
					left -= 650 >> 1;
					top = window.screen.availHeight >> 1;
					top -= 400 >> 1;
					top -= 60;
				}
			}

			if ( centerWindow ) window.open( url, '_blank', 'width=650,height=400,left=' + left +',top=' + top );
			else window.open( url, '_blank', 'width=650,height=400' );
		};

		return {
			share : share
		};

	})();



	

	// ===========================================================================================================================
	// ===========================================================================================================================

	var o = {
		Twitter : Twitter,
		Instagram : Instagram,
		Facebook : Facebook,
		Pinterest : Pinterest
	};

	return o;

})();