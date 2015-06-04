/*	
		============================================================================
 		*
		*	Utils.Social.Flickr
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

//------------------------------------------------------------------- Utils.Social.Flickr

var _ = _ ? _ : {};
_.Social = _.Social ? _.Social : {};

if ( !_.Social.Flickr ) {
	
	_.Social.Flickr = function() {
		
		this._apiKey = null;
		this._apiSecret = null;
		this.have_api_credentials = false;		
	}
	
	_.Social.Flickr.prototype.hello = function() {
		console.log( 'HELLO FLICKR! -- ' + this._apiKey );
	}
	
	_.Social.Flickr.prototype.apiInfo = function( apiKey, apiSecret ) {
		this._apiKey = apiKey;
		this._apiSecret = apiSecret;
	}

}