var terrainSize = 7000;

function initHeightMap () {

	var bumpTexture = new THREE.ImageUtils.loadTexture( assetsPath + 'heightmap.png' );
	bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
	// magnitude of normal displacement
	var bumpScale = 500.0;

	var sandyTexture = new THREE.ImageUtils.loadTexture( assetsPath + 'soil_gravel.png' );
	sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping; 
	
	var grassTexture = new THREE.ImageUtils.loadTexture( assetsPath + 'moss_gravel_dense.png' );
	grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; 

	var rockyTexture = new THREE.ImageUtils.loadTexture( assetsPath + 'rock_rough_mossy.png' );
	rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping; 

	var customUniforms = {
		bumpScale: 		{ type: "f", value: bumpScale },
		bumpTexture:	{ type: "t", value: bumpTexture },
		sandyTexture:	{ type: "t", value: sandyTexture },
		grassTexture:	{ type: "t", value: grassTexture },
		rockyTexture:	{ type: "t", value: rockyTexture },
	};

	// create custom material from the shader code above
	// that is within specially labelled script tags
	var customMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: customUniforms,
		vertexShader:   document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
	}   
	);

	var landGeometry = new THREE.PlaneGeometry(terrainSize, terrainSize, 256, 256);
	landGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	landGeometry.computeFaceNormals();
	landGeometry.computeVertexNormals();
	landGeometry.computeTangents();

	var planeSurface = new THREE.Mesh(landGeometry, customMaterial);
	scene.add(planeSurface);

}
