<?php

/*
 		============================================================================
		*
		*   author          >>  Christopher Miles
		*   site            >>  www.ChristopherMil.es
		*
		============================================================================
*/

class Browser {
	public $name		= null;
	public $version		= null;
	public $os			= null;
	public $is_mobile 	= 0;
	public $mobile		= 0;
}

class BrowserInfo
{
	public $user_agent				= null;
	public $browser					= null;
	
	private $ready					= false;
	
	public function get() {
		$this->browser = new Browser();
		$this->user_agent = strtolower( $_SERVER['HTTP_USER_AGENT'] );
		
		if ( strpos( $this->user_agent, 'win' ) != null ) {
			$this->browser->os = 'pc';
		} else if ( strpos( $this->user_agent, 'mac' ) != null ) {
			$this->browser->os = 'mac';
		}
		
		function findVersion( $_name, $_s ) {
			if ( strpos( $_s, 'version/' ) != null ) {
				list( $a, $b ) = preg_split( '/version\//', $_s );
				list( $c ) = preg_split( '/\./', $b );
				return $c;
			} else if ( strpos( $_s, $_name.'/' ) != null ) {
				list( $a, $b ) = preg_split( '/'.$_name.'\//', $_s );
				list( $c ) = preg_split( '/\./', $b );
				return $c;
			} else if ( strpos( $_s, $_name ) != null ) {
				list( $a, $b ) = preg_split( '/'.$_name.'/', $_s );
				list( $c ) = preg_split( '/\./', $b );
				return $c;
			}
		}
		
		if ( strpos( $this->user_agent, 'msie' ) != null ) {
			$this->browser->name = 'msie';
			$this->browser->version = findVersion( 'msie', $this->user_agent );
		} else if ( strpos( $this->user_agent, 'chrome' ) != null ) {
			$this->browser->name = 'chrome';
			$this->browser->version = findVersion( 'chrome', $this->user_agent );
		} else if ( strpos( $this->user_agent, 'safari' ) != null ) {
			$this->browser->name = 'safari';
			$this->browser->version = findVersion( 'safari', $this->user_agent );
		} else if ( strpos( $this->user_agent, 'firefox' ) != null ) {
			$this->browser->name = 'firefox';
			$this->browser->version = findVersion( 'firefox', $this->user_agent );
		}
		
		if ( strpos( $this->user_agent, 'iphone' ) != null ) {
			$this->browser->mobile = 'iphone';
			$this->browser->is_mobile = 1;
		} else if ( strpos( $this->user_agent, 'ipad' ) != null ) {
			$this->browser->mobile = 'ipad';
			$this->browser->is_mobile = 1;
		} else if ( strpos( $this->user_agent, 'android' ) != null ) {
			$this->browser->mobile = 'android';
			$this->browser->is_mobile = 1;
		} else if ( strpos( $this->user_agent, 'ipod' ) != null ) {
			$this->browser->mobile = 'ipad';
			$this->browser->is_mobile = 1;
		}
		
		$this->ready = true;
		
		return $this->browser;
	}
	
	public function version() {
		if ( !$this->ready ) $this->get();
		return $this->browser->version;
	}
	
	public function name() {
		if ( !$this->ready ) $this->get();
		return $this->browser->name;
	}
	
	public function os() {
		if ( !$this->ready ) $this->get();
		return $this->browser->os;
	}
	
	public function is_mobile() {
		if ( !$this->ready ) $this->get();
		return $this->browser->is_mobile;
	}
	
	public function mobile() {
		if ( !$this->ready ) $this->get();
		return $this->browser->mobile;
	}
	
	public function user_agent() {
		if ( !$this->ready ) $this->get();
		return $this->user_agent;
	}
	
	public function browser() {
		if ( !$this->ready ) $this->get();
		return $this->browser;
	}
	
}

?>