var app = function() {
    // init scene, camera, objects and renderer
    var scene, camera, renderer;
    const clock = new THREE.Clock();
    let mixerBook, mixerMei;
    const A_key = 65, D_key = 68;
    var position = new THREE.Vector3();
    var load_model_book = function() {
        var gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load("./data/models/medieval_fantasy_book/scene.gltf", (gltf) => {
            book = gltf.scene;
            book.scale.setScalar(0.6);
            book.position.x = 2;
            book.rotation.y = MY_LIBS.degToRad(0);
            scene.add(book);
            mixerBook = new THREE.AnimationMixer(book);
            gltf.animations.forEach((clip) => {
                mixerBook.clipAction(clip).play();
            })
        });
    };
    var load_model_mei = function() {
        var gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load("./data/models/mei/scene.gltf", (gltf) => {
            mei = gltf.scene;
            mei.scale.setScalar(0.06);
            mei.position.x = 0;
            mei.rotation.y = MY_LIBS.degToRad(180);
            mei.position.z = 5;
            scene.add(mei);
            mixerMei = new THREE.AnimationMixer(mei);
            gltf.animations.forEach((clip) => {
                mixerMei.clipAction(clip).play();
            })
        });
    };
    var onKeyDown = function(e) {
        // console.log("The current key: " + e.keyCode);
        switch(e.keyCode) {
            case A_key:
                mei.position.x += -0.5;
                break;
            case D_key:
                mei.position.x += 0.5;
            default:
                // console.log("The current key: " + e.keyCode);    
        }
    };
    var init_app = function() {

        // 1. Create the scene
        scene = new THREE.Scene();
        scene.background = new THREE.TextureLoader().load("./data/background/sky2.jpg");

        // 2. Create and locate the camera
        var fieldOfViewY = 60, aspectRatio = window.innerWidth / window.innerHeight, near = 0.1, far = 100.0;
        camera = new THREE.PerspectiveCamera(fieldOfViewY, aspectRatio, near, far);
        camera.position.y = 10;
        camera.position.z = 50;

        // 3. Create and locate the objects on the scene

        // light
        const ambientLight = new THREE.AmbientLight(0xffffff,0.2);		
		const pointLight = new THREE.PointLight(0xffffff,1);
		pointLight.position.set(0, 100, 0);
		// add three directional lights
		const keyLight = new THREE.DirectionalLight(0xffffff, 1);
		keyLight.position.set(100,0,-100);
		const fillLight = new THREE.DirectionalLight(0xffffff, 1);
		fillLight.position.set(150,0,100);
		const backLight = new THREE.DirectionalLight(0xffffff, 1);
		backLight.position.set(-150,0,100);

        scene.add(ambientLight);
        scene.add(pointLight);
        scene.add(keyLight);    
        scene.add(fillLight);
        scene.add(backLight);

        load_model_book();
        load_model_mei();

        scene.updateMatrixWorld(true);
        // 4. Create the renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        // document.addEventListener("keydown", onKeyDown, false);
    };
    // main animation loop - calls every 50-60ms
    var mainLoop = function() {
        requestAnimationFrame(mainLoop);
        const delta = clock.getDelta();
        mixerBook.update(delta);
        mixerMei.update(delta);
        // mei.rotation.y += 0.01
        // position.getPositionFromMatrix(mei.matrixWorld);
        // console.log("Position: " + position.x + ", " + position.y + ", " + position.z);
        renderer.render(scene, camera);
    };
    init_app();
    mainLoop();
}