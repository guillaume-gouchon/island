/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	// var isOnObject = false;

    // check collisions
    this.collisionOnZ = false;

	var canJump = false;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var movementSpeed = 0.1;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 10;
				canJump = false;
				break;

            case 16: // shift
                movementSpeed = 0.3;
                break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

            case 16: // shift
                movementSpeed = 0.1;
                break;
		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	// this.isOnObject = function ( boolean ) {

	// 	isOnObject = boolean;
	// 	canJump = boolean;

	// };

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

	var t = 0;

	this.update = function ( delta ) {
		t += 0.15;

		if ( scope.enabled === false ) return;

		delta *= 0.1;

		velocity.x += (-velocity.x) * 0.1 * delta;
		velocity.z += (-velocity.z) * 0.1 * delta;

		if (moveForward) velocity.z -= movementSpeed * delta;
		if (moveBackward) velocity.z += movementSpeed * delta;

		if (moveLeft) velocity.x -= movementSpeed * delta;
		if (moveRight) velocity.x += movementSpeed * delta;

		if (moveForward || moveBackward || moveLeft || moveRight) {
			if (moveForward || moveBackward) {
				// rotate camera when walking
				yawObject.rotation.z += 0.0003 * Math.cos(t * 2 / 3);
			}
			// udpate camera height when walking
			yawObject.position.y += 0.18 * Math.cos(t);
		}

        // No move if against object
        if (this.collisionOnZ === true) {
            velocity.z = Math.max(0, velocity.z);
        }

		yawObject.translateX( velocity.x );
		yawObject.translateZ( velocity.z );

	};

};
