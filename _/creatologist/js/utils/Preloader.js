/*	
		============================================================================
 		*
		*	_.Preloader
 		*
 		*===========================================================================
		*---------------------------------------------------------------------------
 		*
 		*	Utilizing PreloadJS library.
 		*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

//------------------------------------------------------------------- _.Preloader

var _ = _ ? _ : {};

if ( !_.Preloader ) {

	_.Preloader = {
		
		p : null,
		manifest : null,
		_manifest : null,
		
		init : function() {
			
			if ( !createjs ) {
				console.log( 'Utils.preloader !! needs CreateJS library' );
				return;
			}
			
			this.p = new createjs.PreloadJS();
			//this.p.onComplete = this.handle.complete;
			//this.p.onProgress = this.handle.progress;
			//this.p.onFileLoad = this.handle.fileLoad;
			//this.p.onFileProgress = this.handle.fileProgress;
			
			var manifest = [];
			//manifest.push( { src: this.set.path + this.set.photos[ this.set.totalPhotos - 1 ].src } );
			this.loadManifest( manifest );
		},
		
		handle : {
		
			complete : function ( event ) {
				if ( window.console ) console.log( event );
			},
			
			progress : function ( event ) {
				//console.log( 'overall progress: ' + event.loaded );
				//console.log( event.loaded );
				//if ( event.loaded >= .75 ) PhotoFolio.thumbs.show();
			},
			
			fileLoad : function ( event ) {
				//console.log( event.src );
				if ( window.console ) console.log( event.id );
			},
			
			fileProgress : function ( event ) {
				if ( window.console ) console.log( event );
			}
		},
		
		loadFile : function( src ) {
			
			this.p.loadFile( src );
			
		},
		
		loadManifest : function( manifest ) {
			
			this.manifest = manifest;
			this.p.loadManifest( manifest );
			
		},
		
		clear : function( ) {
			
			this.p.close();
			
		}
			
	}

}