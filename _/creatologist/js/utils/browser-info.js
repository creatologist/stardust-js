/*	
		============================================================================
 		*
		*	_.Utils.browserInfo
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	Sniffing made easy.
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

//------------------------------------------------------------------- _.Utils.browserInfo

var _ = _ ? _ : {};
_.Utils = _.Utils ? _.Utils : {};

if ( !_.Utils.browserInfo ) {

	_.Utils.browserInfo = {
		
		ready			: false,
		
		browser			: {
			
			agent		: null,
			version		: null,
			name		: null,
			os			: null,
			mobile		: false,
			is_mobile	: false
			
		},
		
		get				: function() {
			
			this.browser.agent = navigator.userAgent.toLowerCase();
			
			var osInfo = navigator.appVersion.toLowerCase();
			 
			if ( osInfo.indexOf( 'win' ) != -1 ) this.browser.os = 'windows';
			if ( this.browser.os == null && osInfo.indexOf( 'mac' ) != -1 ) this.browser.os = 'mac';
			
			this.browser.name = this.browser.agent.match(/chrome/gi);
			if ( this.browser.name == null ) this.browser.name = this.browser.agent.match(/safari/gi);
			if ( this.browser.name == null ) this.browser.name = this.browser.agent.match(/firefox/gi);
			if ( this.browser.name == null ) this.browser.name = this.browser.agent.match(/msie/gi);
			
			if ( this.browser.name == null ) return;
			this.browser.name = this.browser.name[ 0 ];
			
			switch( this.browser.name ) {
				case 'chrome':
					if ( this.browser.agent.indexOf( 'chrome/' ) != -1 ) this.browser.version = this.browser.agent.split( 'chrome/')[1].split('.')[0];
					break;
				case 'safari':
					if ( this.browser.agent.indexOf( 'crios/' ) != -1 ) {
						// iPad Chrome App
						this.browser.version = this.browser.agent.split( 'crios/')[1].split('.')[0];
					} else if ( this.browser.agent.indexOf( 'version/' ) != -1 ) {
						this.browser.version = this.browser.agent.split( 'version/')[1].split('.')[0];
					}
					break;
				case 'firefox':
					if ( this.browser.agent.indexOf( 'firefox/' ) != -1 ) this.browser.version = this.browser.agent.split( 'firefox/')[1].split('.')[0];
					break;
				case 'msie':
					if ( this.browser.agent.indexOf( 'msie/' ) != -1 ) this.browser.version = this.browser.agent.split( 'msie/')[1].split('.')[0];
					else if ( this.browser.agent.indexOf( 'msie ' ) != -1 ) this.browser.version = this.browser.agent.split( 'msie ')[1].split('.')[0];
					break;
			}
			
			var platform = navigator.platform.toLowerCase();
			
			if ( this.browser.agent.indexOf( 'iphone' ) >= 0 ) this.browser.mobile = 'iphone';
			else if ( this.browser.agent.indexOf( 'ipad' ) >= 0 ) this.browser.mobile = 'ipad';
			else if ( this.browser.agent.indexOf( 'android' ) >= 0 ) this.browser.mobile = 'android';
			else if ( this.browser.agent.indexOf( 'ipod' ) >= 0 ) this.browser.mobile = 'ipod';
			
			if ( this.browser.mobile ) this.browser.is_mobile = true;
			
			this.ready = true;
			
			return this.browser;
			
		},
		
		version			: function() {
			if ( !this.ready ) return this.get().version;
			else return this.browser.version;
		},
		
		name			: function() {
			if ( !this.ready ) return this.get().name;
			else return this.browser.name;
		},
		
		os				: function() {
			if ( !this.ready ) return this.get().os;
			else return this.browser.os;
		},
		
		mobile			: function() {
			if ( !this.ready ) return this.get().mobile;
			else return this.browser.mobile;
		},
		
		is_mobile		: function() {
			if ( !this.ready ) return this.get().is_mobile;
			else return this.browser.is_mobile;
		},
		
		agent			: function() {
			if ( !this.ready ) return this.get().agent;
			else return this.browser.agent;
		}
		
	}

}