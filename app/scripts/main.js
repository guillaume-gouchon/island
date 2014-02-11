var camera, scene, renderer, controls, loader, ray;
var time = Date.now();
var models = {};
var objects = [];
var assetsPath = 'assets/';


function createScene() {

	scene = new THREE.Scene();

	// setup camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 20000);
	camera.position.y = 300;

	// setup lights
	var light = new THREE.DirectionalLight(0xffffff, 1.5);
	light.position.set(1, 1, 1);
	scene.add(light);

	var light = new THREE.DirectionalLight(0xffffff, 0.75);
	light.position.set(-1, - 0.5, -1);
	scene.add(light);

	// setup controls
	controls = new THREE.PointerLockControls(camera);
	controls.enabled = true;
	scene.add(controls.getObject());

	// setup main raycaster
	ray = new THREE.Raycaster();
	ray.ray.direction.set(0, -1, 0);

	// setup renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xffffff);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize', onWindowResize, false);

	// setup models loader
	loader = new THREE.JSONLoader();

	// add elements
	initSkybox();
	initHeightMap();
	loadAssets();
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame(animate);

	controls.isOnObject(false);

	ray.ray.origin.copy( controls.getObject().position );
	ray.ray.origin.y -= 10;

	var intersections = ray.intersectObjects( objects );

	if ( intersections.length > 0 ) {

		var distance = intersections[ 0 ].distance;

		if ( distance > 0 && distance < 10 ) {

			controls.isOnObject( true );

		}

	}

	controls.update(Date.now() - time);

	renderer.render(scene, camera);

	time = Date.now();

	rotateSkybox();
}


/*
**	START SCENE CREATION
*/
// document.addEventListener('onDOMLoaded', function () {
	createScene();
	animate();
// });



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
