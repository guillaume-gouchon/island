var camera, scene, renderer;
var geometry, material, mesh, loader;
var controls, time = Date.now();
var skybox;
var ray;
var models = {};
var objects = [];
var assetsPath = 'assets/';


function initScene() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
	// camera.position.y = 500;

	scene = new THREE.Scene();
	// scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

	var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
	light.position.set( -1, - 0.5, -1 );
	scene.add( light );

	controls = new THREE.PointerLockControls( camera );
	
	var user = controls.getObject();
	scene.add( controls.getObject() );


	ray = new THREE.Raycaster();
	ray.ray.direction.set( 0, -1, 0 );

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	loader = new THREE.JSONLoader();

	addSkybox();

	initHeightMap();
	initSkyboxHeightMap();

	loadAssets();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

	controls.isOnObject( false );

	ray.ray.origin.copy( controls.getObject().position );
	ray.ray.origin.y -= 10;

	var intersections = ray.intersectObjects( objects );

	if ( intersections.length > 0 ) {

		var distance = intersections[ 0 ].distance;

		if ( distance > 0 && distance < 10 ) {

			controls.isOnObject( true );

		}

	}

	controls.update( Date.now() - time );

	renderer.render( scene, camera );

	time = Date.now();

	// rotate sky
	skybox.rotation.y+= de2ra(0.005);
}


function addSkybox() {
	var opts = {
		folder: assetsPath,
		skyboxName: 'comawhite',
		filetype: '.jpg',
		size: 10000
	};

	var urls = [];
	['x','y','z'].forEach(function(axis){
		urls.push(opts.folder + opts.skyboxName + '_' + axis + 'pos' + opts.filetype);
		urls.push(opts.folder + opts.skyboxName + '_' + axis + 'neg' + opts.filetype);
	});

	var materialArray = [];
	for (var i in urls) {
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture(urls[i], new THREE.UVMapping(), function () {}),
			side: THREE.BackSide
		}));
	}
	var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
	var skyGeometry = new THREE.CubeGeometry(opts.size, opts.size, opts.size);    
	skybox = new THREE.Mesh(skyGeometry, skyMaterial);
	scene.add(skybox);
}


/**
*	Converts degree to radians.
*/
function de2ra (degree) {
	return degree * (Math.PI / 180);
}



function initHeightMap () {
	var bumpTexture = new THREE.ImageUtils.loadTexture( assetsPath + 'heightmap.png' );
	bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
	// magnitude of normal displacement
	var bumpScale = 300.0;

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
	//   that is within specially labelled script tags
	var customMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: customUniforms,
		vertexShader:   document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
	}   
	);

	var landGeometry = new THREE.PlaneGeometry( 5000, 5000, 256, 256);
	landGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	landGeometry.computeFaceNormals();
	landGeometry.computeVertexNormals();
	landGeometry.computeTangents();
	var planeSurface = new THREE.Mesh(landGeometry, customMaterial);
	scene.add( planeSurface );
}

function initSkyboxHeightMap () {
	var bumpTexture = new THREE.ImageUtils.loadTexture( assetsPath + 'skybox_heightmap.png' );
	bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
	// magnitude of normal displacement
	var bumpScale = 4000.0;

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
	//   that is within specially labelled script tags
	var customMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: customUniforms,
		vertexShader:   document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
	}   
	);

	var landGeometry = new THREE.PlaneGeometry( 10000, 10000, 256, 256);
	landGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	var skyboxMountains = new THREE.Mesh(landGeometry, customMaterial);
	skyboxMountains.position.y = -2000;
	scene.add( skyboxMountains );
}


function loadAssets() {
	this.loader.load(assetsPath + 'cedar.js', geometryLoaded());
}


/**
*	Callback when a geometry is loaded.
*/
function geometryLoaded () {
	return function (geometry, materials) {
		models.swamptree = { geometry: geometry, materials: materials };
		addRandomTrees();
	};
}

function addRandomTrees () {
	for (var i = 0; i < 1; i++) {
		var tree = new THREE.Mesh(models.swamptree.geometry, new THREE.MeshFaceMaterial(models.swamptree.materials));
		tree.position = {
			x: 0,
			y: 500,
			z: 0
		}
		scene.add(tree);
	}
}



// initBrowser();
initScene();
animate();