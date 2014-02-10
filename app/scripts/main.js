var camera, scene, renderer;
var geometry, material, mesh;
var controls, time = Date.now();
var skybox;
var ray;

var assetsPath = 'images/'

function requestFullscreen () {
	var element = document.body;

	var fullscreenchange = function ( event ) {
		if ( document.fullscreenElement === element || document.mozFullscreenElement === element 
			|| document.mozFullScreenElement === element ) {
			document.removeEventListener( 'fullscreenchange', fullscreenchange );
			document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
			element.requestPointerLock();
		}
	}

	document.addEventListener( 'fullscreenchange', fullscreenchange, false );
	document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

	element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
	element.requestFullscreen();
}

function initBrowser () {
	var blocker = document.getElementById( 'blocker' );

	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	if ( havePointerLock ) {

		var element = document.body;

		var pointerlockchange = function ( event ) {

			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

				controls.enabled = true;

				blocker.style.display = 'none';

			} else {

				controls.enabled = false;

				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';

			}

		}

		var pointerlockerror = function ( event ) {
			console.log("Error while locking pointer")
		}

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		blocker.addEventListener( 'click', function ( event ) {

			blocker.style.display = 'none';

			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

			if ( /Firefox/i.test( navigator.userAgent ) ) {

				requestFullscreen();
				element.requestPointerLock();

			} else {

				element.requestPointerLock();

			}

		}, false );

	} else {

		blocker.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

	}
}


function initScene() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.y = 80;

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

	addSkybox();

	initHeightMap();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function loop() {

	requestAnimationFrame( loop );

	// controls.isOnObject( false );

	// ray.ray.origin.copy( controls.getObject().position );
	// ray.ray.origin.y -= 10;

	// var intersections = ray.intersectObjects( objects );

	// if ( intersections.length > 0 ) {

	// 	var distance = intersections[ 0 ].distance;

	// 	if ( distance > 0 && distance < 10 ) {

	// 		controls.isOnObject( true );

	// 	}

	// }

	controls.update( Date.now() - time );

	renderer.render( scene, camera );

	time = Date.now();

	// rotate sky
	skybox.rotation.y+= de2ra(0.002);
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
	var bumpScale = 200.0;

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

	var landGeometry = new THREE.PlaneGeometry( 2000, 2000, 50, 50);
	landGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	landGeometry.computeFaceNormals();
    landGeometry.computeVertexNormals();
    landGeometry.computeTangents();
    var planeSurface = new THREE.Mesh(landGeometry, customMaterial);
	scene.add( planeSurface );
}



initBrowser();
initScene();
loop();