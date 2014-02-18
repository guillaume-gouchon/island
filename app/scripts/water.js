var water;

function addWater () {

	var waterNormals = new THREE.ImageUtils.loadTexture( assetsPath + 'waternormals.jpg' );
	waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 

	water = new THREE.Water(renderer, camera, scene, {
		textureWidth: 512, 
		textureHeight: 512,
		waterNormals: waterNormals,
		alpha: 	1.0,
		sunDirection: sunLight.position.normalize(),
		sunColor: 0xffffff,
		waterColor: 0x001e0f,
		distortionScale: 50.0,
	});


	var mirrorMesh = new THREE.Mesh(new THREE.PlaneGeometry(terrainSize * 5, terrainSize * 5, 50, 50), water.material);	
	mirrorMesh.add(water);
	mirrorMesh.position.y = 25;
	mirrorMesh.rotation.x = - Math.PI * 0.5;
	scene.add(mirrorMesh);

	water.sound = new SeaSound(assetsPath + 'sounds/ocean', terrainSize / 4, 0.1);
	water.sound.play();
}

function animateWater () {
	water.material.uniforms.time.value += 1.0 / 60.0;
	water.render();
	water.sound.update(controls.getObject());
}
