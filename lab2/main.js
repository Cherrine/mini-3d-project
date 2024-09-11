function init() {
    var scene = new THREE.Scene();
    var enableFog = false;
    var gui = new dat.GUI();

    if (enableFog) {
        scene.fog = new THREE.FogExp2(0xffffff, 0.2);
    }

    var plane = getPlane(20);
    var spotLight = getSpotLight(1); // Using SpotLight
    var sphere = getSphere(0.05);
    var boxGrid = getBoxGrid(10, 1.5);

    plane.name = 'plane-1';

    
    plane.rotation.x = Math.PI / 2;
    spotLight.position.set(0, 4, 0); // Set spotLight position
    spotLight.intensity = 2;

    scene.add(plane);
    spotLight.add(sphere);
    scene.add(spotLight);
    scene.add(boxGrid);

    gui.add(spotLight, 'intensity', 0, 10);
    gui.add(spotLight.position, 'x', 0, 20);
    gui.add(spotLight.position, 'y', 0, 20);
    gui.add(spotLight.position, 'z', 0, 20);
    gui.add(spotLight, 'penumbra', 0, 1);

    var camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set(1, 2, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120, 120, 120)')
    document.getElementById("webgl").appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, controls);
}

function getBox(width, height, depth) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)'
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    return mesh;
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)',
        side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    return mesh;
}

function getSpotLight(intensity) { // Adjusted to only use SpotLight
    var light = new THREE.SpotLight(0xffffff, intensity);
    light.castShadow = true;
    light.angle = Math.PI / 6;
    light.penumbra = 0.5;
    light.decay = 2;
    light.distance = 200;
    return light;
}

function update(renderer, scene, camera, controls) {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

function getSphere(size) {
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({
        color: 'rgb(255, 255, 255)'
    });
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function getBoxGrid(amount, separationMultiplier) {
    var group = new THREE.Group();
    for (var i = 0; i < amount; i++) {
        for (var j = 0; j < amount; j++) {
            var obj = getBox(1, 1, 1);
            obj.position.x = i * separationMultiplier;
            obj.position.y = obj.geometry.parameters.height / 2;
            obj.position.z = j * separationMultiplier;
            group.add(obj);
        }
    }
    group.position.x = -(separationMultiplier * (amount - 1)) / 2;
    group.position.z = -(separationMultiplier * (amount - 1)) / 2;
    return group;
}

init();