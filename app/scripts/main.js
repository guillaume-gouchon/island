var camera, scene, renderer, controls, loader, ray, sunLight;
var time = Date.now();
var models = {};
var objects = [];
var assetsPath = 'assets/';


function createScene() {

	scene = new THREE.Scene();

	// setup camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 30000);

	// setup lights
	sunLight = new THREE.DirectionalLight(0xffff55, 1);
	sunLight.position.set(-1, 0.4, -1);
	scene.add(sunLight);

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

	// setup resize window callback
	window.addEventListener('resize', onWindowResize, false);

	// setup models loader
	loader = new THREE.JSONLoader();

	// add elements
	initSkybox();
	initHeightMap();
	addWater();
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

	animateSkybox();
	animateWater();

	renderer.render(scene, camera);

	time = Date.now();

}


/*
**	START SCENE CREATION
*/
onDOMLoaded(function () {
	createScene();
	animate();
});














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
