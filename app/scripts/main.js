var camera, scene, renderer, controls, loader, ray, sunLight;
var user;
var time = Date.now();
var models = {};
var objects = [];
var assetsPath = 'assets/';
var animals = {birds: []};
var birdsRotation = 1;

var userHeight = 50;


function createScene() {

	scene = new THREE.Scene();

	// setup camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 30000);

	// setup lights
	sunLight = new THREE.DirectionalLight(0xffffff, 1);
	sunLight.position.set(0, 1000, 0);
	scene.add(sunLight);

	// setup controls
	controls = new THREE.PointerLockControls(camera);
	user = controls.getObject();
	user.position.y = 105;
	user.position.z = 1000;
	scene.add(user);

	// setup raycasters to check collisions
	rayZ = new THREE.Raycaster();
    rayZ.ray.direction.set(0, 0, 1);

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
	addWater();
	initHeightMap(function () {
		loadAssets();
		loadBirds();
		animate();
	});
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame(animate);

    // Check collisions
    // reset
    controls.collisionOnZ = false;
    controls.collisionOnX = false;

    // on z axis
    rayZ.ray.origin.copy(controls.getObject().position);
    rayZ.ray.origin.z -= 20;
    var intersectionsZ = rayZ.intersectObjects(objects);
    if (intersectionsZ.length > 0) {
        var distance = intersectionsZ[0].distance;
        if (distance > 0 && distance < 10) {
            controls.collisionOnZ = true;
        }
    }

	var positionY = grosseBidouille[Math.floor(512 * (user.position.x + terrainSize / 2) / terrainSize)][Math.floor(512 * (user.position.z + terrainSize / 2) / terrainSize)];
	user.position.y += (positionY + userHeight - user.position.y) * 0.05;

	var delta = Date.now() - time;
	controls.update(delta);

	animateSkybox();
	animateWater();
	animateBirds(delta);

	renderer.render(scene, camera);

	time = Date.now();

}


/*
**	START SCENE CREATION
*/
onDOMLoaded(function () {
	createScene();
});














function loadAssets() {
	this.loader.load(assetsPath + 'tree.js', geometryLoaded('tree', addRandomTrees));

	models.grass = {
		materials: [
			new THREE.SpriteMaterial({
				color: 0xFFFFFF,
				useScreenCoordinates:false,
				map: THREE.ImageUtils.loadTexture(assetsPath + 'grass.png', new THREE.UVMapping())
			}),
			new THREE.SpriteMaterial({
				color: 0xFFFFFF,
				useScreenCoordinates:false,
				map: THREE.ImageUtils.loadTexture(assetsPath + 'grass2.png', new THREE.UVMapping(), addRandomGrass)
			})
		]
	};

	this.loader.load(assetsPath + 'rock.js', geometryLoaded('rock', addRandomRocks));

}

function loadBirds() {
	this.loader.load(assetsPath + 'animals/flamingo.js', birdLoaded());
	this.loader.load(assetsPath + 'animals/parrot.js', birdLoaded());
	this.loader.load(assetsPath + 'animals/stork.js', birdLoaded());
}

/**
*	Callback when a geometry is loaded.
*/
function geometryLoaded (key, next) {
	return function (geometry, materials) {
		models[key] = {
			geometry: geometry,
			materials: new THREE.MeshLambertMaterial(
				{
					transparent: true,
					lights:true,
					map: THREE.ImageUtils.loadTexture(assetsPath + key + '.png', new THREE.UVMapping())
				})
		};
		next();
	};
}

function birdLoaded() {
	return function(geometry, materials) {
		models.bird = { geometry: geometry, materials: materials};
		addBirds();
	}
}

function addBirds() {


	// Colorize the birds
	if ( models.bird.geometry.morphColors && models.bird.geometry.morphColors.length ) {
		var colorMap = models.bird.geometry.morphColors[ 0 ];
		for ( var i = 0; i < colorMap.colors.length; i ++ ) {
			models.bird.geometry.faces[ i ].color = colorMap.colors[ i ];
		}
	}


	models.bird.geometry.computeMorphNormals();

	for (var i = 0; i < 25; i++) {
		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff,
			shininess: 20, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors,
			shading: THREE.SmoothShading } );
		var bird = new THREE.MorphAnimMesh( models.bird.geometry, material );

		bird.duration = 5000;

		bird.scale.set( Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5 );

		// var bird = new THREE.Mesh(models.bird.geometry, new THREE.MeshFaceMaterial(models.bird.materials));
		bird.position = {
			x: (Math.random() * 200 - 100) * terrainSize / 100,
			y: 400 + Math.random() * 300,
            z: (Math.random() * 200 - 100) * terrainSize / 100
		}
		animals.birds.push( bird );
		scene.add( bird );
	}
}

function animateBirds(delta) {
	if (animals.birds && animals.birds !== []) {
		birdsRotation += 5;
		for (var i in animals.birds) {
			var bird = animals.birds[i];
			if (bird.position.z >= terrainSize) {
				bird.position.z = -terrainSize;
			} else {
				bird.position.z += 10 + Math.random() * 5 -2; // Speed
				bird.position.y += Math.random() * 2 - 1; // Height
			}
			bird.updateAnimation(10 * delta);
		}
	}
}


function addRandomGrass () {
	for (var i = 0; i < 5000; i++) {
		var xPosition = Math.random() * 512;
		var zPosition = Math.random() * 512;
		var yPosition = grosseBidouille[Math.floor(xPosition)][Math.floor(zPosition)];

		if (yPosition > 70 && yPosition < 100) {
			// add grass
			var spriteMaterial = models.grass.materials[parseInt(Math.random() * models.grass.materials.length)];
			var grass = new THREE.Sprite(spriteMaterial);
			grass.position = {
				x: xPosition * terrainSize / 512 - terrainSize / 2,
				y: yPosition + 5,
				z: zPosition * terrainSize / 512 - terrainSize / 2
			}
			var randomScale = 13 + Math.random() * 2;
			grass.scale.set(randomScale, randomScale, randomScale)
			scene.add(grass);
		}
	}
}

function addRandomRocks () {
	for (var i = 0; i < 500; i++) {
		var xPosition = Math.random() * 512;
		var zPosition = Math.random() * 512;
		var yPosition = grosseBidouille[Math.floor(xPosition)][Math.floor(zPosition)];

		if (yPosition > 80 && yPosition < 100) {
			// add rock
			var rock = new THREE.Mesh(models.rock.geometry, models.rock.materials);
			rock.position = {
				x: xPosition * terrainSize / 512 - terrainSize / 2,
				y: yPosition - 10,
				z: zPosition * terrainSize / 512 - terrainSize / 2
			}
			var randomScale = 12 + Math.random() * 6;
			rock.scale.set(randomScale, randomScale, randomScale);
			rock.rotation.y = 2 * Math.PI * Math.random();
			scene.add(rock);
		}
	}
}


function addRandomTrees () {
	for (var i = 0; i < 400; i++) {
		var xPosition = Math.random() * 512;
		var zPosition = Math.random() * 512;
		var yPosition = grosseBidouille[Math.floor(xPosition)][Math.floor(zPosition)];

		if (yPosition > 85 && yPosition < 110) {
			// add tree
			var tree = new THREE.Mesh(models.tree.geometry, models.tree.materials);
			tree.position = {
				x: xPosition * terrainSize / 512 - terrainSize / 2,
				y: yPosition - 10,
				z: zPosition * terrainSize / 512 - terrainSize / 2
			}
			var randomScale = 3.5 + Math.random() * 1;
			tree.scale.set(randomScale, randomScale, randomScale);
			tree.rotation.y = 2 * Math.PI * Math.random();
			scene.add(tree);
			objects.push(tree);
		}
	}
}
