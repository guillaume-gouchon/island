
/**
*	CLICK TO START
*/
var clickZone = document.getElementById('clickZone');

function start () {
	clickZone.removeEventListener('click', start);

	// hide blocker, then remove it
	var blocker = document.getElementById('blocker');
	blocker.classList.add('hidden');
	setTimeout(function () {
		document.body.removeChild(blocker);

		// request browser's fullscreen and pointer lock
		requestFullscreen();
		requestPointerLock();
	}, 500);

}


/**
*	FULLSCREEN
*/
function requestFullscreen () {
	var element = document.body;

	var fullscreenchange = function ( event ) {
		if ( document.fullscreenElement === element || document.mozFullscreenElement === element 
			|| document.mozFullScreenElement === element ) {
			document.removeEventListener( 'fullscreenchange', fullscreenchange );
			document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
		}
	}

	document.addEventListener( 'fullscreenchange', fullscreenchange, false );
	document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

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
			element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else if (element.webkitRequestFullScreen) {
		if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
			// Safari 5.1+
			element.webkitRequestFullScreen();
		} else {
			// Chrome 15+
			element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
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
*	CREDITS
*/
var credits = document.getElementById('credits');
var creditsLink = credits.getElementsByClassName('link')[0];

function showCredits () {
	credits.getElementsByClassName('content')[0].classList.remove('hidden');
	credits.removeEventListener('click', showCredits);
}

creditsLink.addEventListener('click', showCredits, false);


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
*	CHECK IF WEBGL IS ENABLED
*/
if (isWebGLEnabled()) {
	clickZone.addEventListener('click', start, false);
} else {
	document.getElementById('webGLError').classList.remove('hide');
	var instructions = document.getElementById('instructions');
	instructions.style.opacity = 0.1;
}
