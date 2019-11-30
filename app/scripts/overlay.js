
/**
*	CLICK TO START
*/
var clickZone = document.getElementById('clickZone');

function start () {
	// hide blocker
	var blocker = document.getElementById('blocker');
	blocker.classList.add('hidden');
	requestFullscreen();
	requestPointerLock();
}


/**
*	FULLSCREEN
*/
function requestFullscreen () {
	var element = document.body;

	var fullscreenchange = function ( event ) {
		if ( !(document.fullscreenElement === element || document.mozFullscreenElement === element ||
					document.mozFullScreenElement === element || document.webkitFullscreenElement === element ||
					document.webkitfullscreenElement === element)) {
			// Exiting fullscreen mode: overlay the instruction screen and disable mouse control
			var blocker = document.getElementById('blocker');
			blocker.classList.remove('hidden');
			controls.enabled = false;
		} else {
			// Entering fullscreen mode: enable the mouse control
			controls.enabled = true;
		}
	}

	document.addEventListener( 'fullscreenchange', fullscreenchange, false );
	document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
	document.addEventListener( 'webkitfullscreenchange', fullscreenchange, false );

	// Ask the browser for fullscreen mode
	if (element.requestFullscreen) {
		// W3C standard
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) {
		// Firefox 10+, Firefox for Android
		element.mozRequestFullScreen();
	} else if (element.msRequestFullscreen) {
		// IE 11+
		element.msRequestFullscreen();
	} else if (element.webkitRequestFullscreen) {
		if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
			// Safari 6+
			element.webkitRequestFullscreen();
		} else {
			// Chrome 20+, Opera 15+, Chrome for Android, Opera Mobile 16+
			element.webkitRequestFullscreen(element.ALLOW_KEYBOARD_INPUT);
		}
	} else if (element.webkitRequestFullScreen) {
		if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
			// Safari 5.1+
			element.webkitRequestFullScreen();
		} else {
			// Chrome 15+
			element.webkitRequestFullScreen(element.ALLOW_KEYBOARD_INPUT);
		}
	}

}


/**
*	POINTER LOCK
*/
function requestPointerLock () {
	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document
							|| 'webkitPointerLockElement' in document;
	if (havePointerLock) {
		var element = document.body;

		var pointerlockchange = function (event) {
			if ( document.pointerLockElement === element || document.mozPointerLockElement === element
				|| document.webkitPointerLockElement === element ) {
				// controls.enabled = true;
			} else {
				// controls.enabled = false;
			}
		}

		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		element.requestPointerLock();
	}
}

/**
*	WEBGL ERROR
*/
function isWebGLEnabled() {
	try {
		return !! window.WebGLRenderingContext && !! document.createElement('canvas').getContext('experimental-webgl');
	} catch(e) {
		return false;
	}
}


/**
*   REMOVE WAIT SPINNER
*/
// document.getElementById('spinner').classList.add('hidden');
// document.getElementById('blocker').classList.remove('hidden');


/**
*	CHECK IF WEBGL IS ENABLED
*/
if (isWebGLEnabled()) {
	clickZone.addEventListener('click', start, false);
} else {
	document.getElementById('webGLError').classList.remove('hide');
	var instructions = document.getElementById('instructions');
	instructions.style.opacity = 0.1;
}
