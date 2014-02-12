var Sound = function ( soundFilePath, radius, volume ) {

	var audio = document.createElement( 'audio' );

	var source = document.createElement( 'source' );
	source.src = soundFilePath + '.mp3';

	audio.appendChild(source);

	source = document.createElement( 'source' );
	source.src = soundFilePath + '.ogg';

	audio.appendChild(source);

	this.play = function () {
		console.log(audio.src)
		audio.play();
	}

	var centerPoint = new THREE.Particle();
	centerPoint.position.y = 300;
	scene.add(centerPoint);

	this.update = function ( camera ) {

		var distance = centerPoint.position.distanceTo( camera.position );

		if ( distance <= radius ) {

			audio.volume = Math.max(0, volume * distance / radius - 0.2);

		} else {

			audio.volume = 0;

		}

	}

}