function init() {
    var scene = new THREE.Scene();
    var enableFog = false;
    var gui = new dat.GUI();

    if (enableFog) {
        scene.fog = new THREE.FogExp2(0xffffff, 0.2);
    }

    var box = getBox(1, 1, 1);
    var plane = getPlane(20);
    var pointLight = getPointLight(1);
    var sphere = getSphere(0.05);
    var boxGrid = getBoxGrid(10, 1.5);

    plane.name = 'plane-1';

    box.position.y = box.geometry.parameters.height / 2;
    plane.rotation.x = Math.PI / 2;
    pointLight.position.y = 2;

 
    scene.add(plane);
    pointLight.add(sphere);
    scene.add(pointLight);
    scene.add(boxGrid);

    gui.add(pointLight, 'intensity', 0, 10);
    gui.add(pointLight.position, 'y', 0, 5);

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

function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);
    
    light.castShadow = true;

    return light;
}

function update(renderer, scene, camera, controls) {
    renderer.render(scene, camera);

    controls.update();

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

function getSphere(size){
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({
        color: 'rgb(255, 255, 255)'
    });
    var mesh = new THREE.Mesh(
        geometry, material);
    return mesh;
}

function getBoxGrid(amount, seperationMultiplier){
    var group = new THREE.Group();

    for (var i = 0; i < amount; i++){
        var obj = getBox(1, 1, 1);
        obj.position.x = i * seperationMultiplier;
        obj.position.y = obj.geometry.parameters.height / 2;
        group.add(obj);
        for (var j = 0; j < amount; j++){
            var obj = getBox(1, 1, 1);
            obj.position.x = i * seperationMultiplier;
            obj.position.y = obj.geometry.parameters.height / 2;
            obj.position.z = j * seperationMultiplier;
            group.add(obj);
        }
    }

    group.position.x = -(seperationMultiplier * (amount - 1)) / 2;
    group.position.z = -(seperationMultiplier * (amount - 1)) / 2;

    return group;

}

init();
