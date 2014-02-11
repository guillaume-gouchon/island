var terrainSize = 5120;

function initHeightMap () {

	var bumpTexture = new THREE.ImageUtils.loadTexture( assetsPath  + 'heightmap.png' );
	bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
	// magnitude of normal displacement
	var bumpScale = 500.0;

	var sandyTexture = new THREE.ImageUtils.loadTexture( assetsPath  + 'textures/soil_gravel.png' );
	sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping; 
	
	var grassTexture = new THREE.ImageUtils.loadTexture( assetsPath  + 'textures/moss_gravel_dense.png' );
	grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; 

	var rockyTexture = new THREE.ImageUtils.loadTexture( assetsPath  + 'textures/rock_rough_mossy.png' );
	rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping; 

	var customUniforms = {
		bumpScale: 		{ type: "f", value: bumpScale },
		bumpTexture:	{ type: "t", value: bumpTexture },
		sandyTexture:	{ type: "t", value: sandyTexture },
		grassTexture:	{ type: "t", value: grassTexture },
		rockyTexture:	{ type: "t", value: rockyTexture },
	};

	attributes = {
		needsUpdate: true
	};

	// create custom material from the shader code above
	// that is within specially labelled script tags
	var customMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: 		customUniforms,
		attributes:     attributes,
		vertexShader:   document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
	}   
	);

	landGeometry = new THREE.PlaneGeometry(terrainSize, terrainSize, 256, 256);
	landGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	landGeometry.dynamic = true;
	landGeometry.verticesNeedUpdate = true;
	landGeometry.elementsNeedUpdate = true;
	landGeometry.uvsNeedUpdate = true;
	landGeometry.normalsNeedUpdate = true;


	var img = new Image(); 
	img.src = assetsPath + "heightmap.png";
	img.onload = function () {

		// get image values
	    var canvas = document.createElement('canvas');
	    canvas.id = 'heightDataCanvas';
	    canvas.width = img.width;
	    canvas.height = img.height;
	    var context = canvas.getContext('2d');
	    var size = img.width * img.height; 
	    context.drawImage(img, 0, 0);
	    var imgd = context.getImageData(0, 0, img.width, img.height);
	    var pix = imgd.data;

	    // update land geometry vertices according to heightmap
	    var vertices = landGeometry.vertices;
	    var minX = - terrainSize / 2,
	    	maxX = - minX,
	    	minY = - terrainSize / 2,
	    	maxY = - minY;
	    for (var i in vertices) {
	    	var x = (vertices[i].x - minX) / (maxX - minX) * img.width,
	    	z = (vertices[i].z - minY) / (maxY - minY) * img.height;
	    	var pixIndex = (Math.floor(x) + Math.floor(z) * img.width) * 4;
	    	vertices[i].y = pix[pixIndex] / 255.0 * bumpScale;
	    }

	    console.log(landGeometry.faces[41000].normal)
	    landGeometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 1));

		landGeometry.computeFaceNormals();
		landGeometry.computeVertexNormals();
		console.log(landGeometry.faces[41000].normal)

		var planeSurface = new THREE.Mesh(landGeometry,  new THREE.MeshNormalMaterial());
		scene.add(planeSurface);
		objects.push(planeSurface);
	};

}
