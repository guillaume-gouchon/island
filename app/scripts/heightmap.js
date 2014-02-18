var terrainSize = 5120;
var landGeometry;

 var grosseBidouille = null;


function initHeightMap (callback) {

	// magnitude of normal displacement
	var bumpScale = 300.0;

	// heightmap image
	var bumpTexture = new THREE.ImageUtils.loadTexture(assetsPath  + 'heightmap.png');
	bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 

	var customUniforms = {
		bumpScale: 		{ type: "f", value: bumpScale },
		bumpTexture:	{ type: "t", value: bumpTexture }
	};

	// setup heigthmap textures
	var textures = [
		{ name: 'sand', params: [0.001, 0.20, 0.16, 0.35, '10.0'] },
		// { name: 'gravelDark', params: [0.19, 0.27, 0.28, 0.31, '10.0'] },
		{ name: 'mossDense', params: [0.14, 0.42, 0.41, 0.43, '20.0'] },
		{ name: 'mossMedium', params: [0.41, 0.43, 0.42, 0.55, '20.0'] },
		// { name: 'mossSparse', params: [0.01, 0.03, 0.03, 0.25, '10.0'] },
		{ name: 'rockMossy', params: [0.42, 0.65, 0, 0, '10.0'] },
		// { name: 'rock', params: [0.50, 0.65, 0, 0, '10.0'] }
	];
	for (var i = 0; i < textures.length; i++) {
		var texture = new THREE.ImageUtils.loadTexture(assetsPath  + 'textures/' + textures[i].name + '.png');
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		customUniforms[textures[i].name + 'Texture'] = { type: "t", value: texture };
	}
	var heightmapShaders = new HeightmapShaders(textures);

	// update fragment shaders with textures
	var attributes = {
		needsUpdate: true
	};


	// create custom material from the shader code above
	// that is within specially labelled script tags
	var customMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: 		customUniforms,
		attributes:     attributes,
		vertexShader:   heightmapShaders.vertexShader,
		fragmentShader: heightmapShaders.fragmentShader,
	}   
	);

	landGeometry = new THREE.CubeGeometry(terrainSize, terrainSize, 10, 255, 255);
	landGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(- Math.PI / 2));
	landGeometry.dynamic = true;

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
	    	var heightValue = Math.pow(pix[pixIndex] / 255.0, 1.2) * bumpScale;
	    	vertices[i].y = heightValue;
	    }

	    grosseBidouille = [];
	    for (var x = 0; x < 512; x++) {
	    	grosseBidouille[x] = [];
	    	for (var z = 0; z < 512; z++) {
	    		var pixIndex = (Math.floor(x) + Math.floor(z) * img.width) * 4;
	    		var heightValue = Math.pow(pix[pixIndex] / 255.0, 1.2) * bumpScale;
		    	grosseBidouille[x][z] = heightValue;
	    	}
	    }

		landGeometry.verticesNeedUpdate = true;
		landGeometry.computeTangents();
	    landGeometry.computeFaceNormals();
	    landGeometry.computeVertexNormals();    
    	landGeometry.computeCentroids();

		var planeSurface = new THREE.Mesh(landGeometry, customMaterial);
		scene.add(planeSurface);
		objects.push(planeSurface);

		callback();
	};

}
