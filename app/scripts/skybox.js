var skybox;

function initSkybox () {
	var opts = {
		folder: assetsPath + 'skybox/',
		skyboxName: 'comawhite',
		filetype: '.jpg',
		size: 30000
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

function animateSkybox () {
	skybox.rotation.y += de2ra(0.004);
}
