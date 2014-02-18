var SeaSound = function ( soundFilePath, radius, volume ) {

	var audio = document.createElement( 'audio' );

	var source = document.createElement( 'source' );
	source.src = soundFilePath + '.mp3';
	audio.appendChild(source);

	source = document.createElement( 'source' );
	source.src = soundFilePath + '.ogg';
	audio.appendChild(source);

	audio.loop = true;
	audio.addEventListener('ended', function () {
	    this.currentTime = 0;
	    this.play();
	}, false);

	this.play = function () {
		audio.play();
	}

	var centerPoint = new THREE.Particle();
	centerPoint.position.y = 0;
	scene.add(centerPoint);

	this.update = function ( camera ) {

		var distance = centerPoint.position.distanceTo( camera.position );

		if ( distance <= radius ) {

			audio.volume = Math.max(0, volume * distance / radius);

		} else {

			audio.volume = 0;

		}

	}

}