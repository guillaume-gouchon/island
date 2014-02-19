var SeaSound = function ( soundFilePath, radius, volume ) {

	var audio1 = createAudioElement();
	var audio2 = createAudioElement();
	
	audio1.addEventListener('timeupdate', function () {
		var remain = this.duration - this.currentTime;
		console.log(remain)
        if (remain <= 0.35){
            audio2.currentTime = 0;
		    audio2.play();
        }
	}, false);

	audio2.addEventListener('timeupdate', function () {
		var remain = this.duration - this.currentTime;
        if (remain <= 0.35){
            audio1.currentTime = 0;
		    audio1.play();
        }
	}, false);

	this.play = function () {
		audio1.play();
	}

	var centerPoint = new THREE.Particle();
	centerPoint.position.y = 0;
	scene.add(centerPoint);

	this.update = function ( camera ) {

		// increase volume the more we are closer to the sea
		var distance = centerPoint.position.distanceTo( camera.position );
		if ( distance <= radius ) {
			audio1.volume = Math.max(0, volume * distance / radius);
			audio2.volume = Math.max(0, volume * distance / radius);
		} else {
			audio1.volume = 0;
			audio2.volume = 0;
		}

	}

	function createAudioElement() {
		var audio = document.createElement('audio');
		audio.preload = true;

		var source = document.createElement( 'source' );
		source.src = soundFilePath + '.mp3';
		audio.appendChild(source);

		source = document.createElement( 'source' );
		source.src = soundFilePath + '.ogg';
		audio.appendChild(source);

		return audio;
	}

}