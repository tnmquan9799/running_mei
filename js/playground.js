var playground = function() {
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(45, innerWidth/innerHeight, 1, 100);
    var renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener("resize", function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.UpdateProjectionMatrix();
    });

    document.addEventListener("keydown", enterStartScreen); 
    function enterStartScreen() {
        var KeyID = event.keyCode;
        if (KeyID == 8) {
            window.location.replace("./startscreen.html");
        }
    }    

    scene.background = new THREE.Color(0xfafafa);
    renderer.setSize(innerWidth, innerHeight);
    cam.position.x = -16;
    cam.position.y = 11;
    cam.position.z = -8;
    document.body.appendChild(renderer.domElement);
    let clock = new THREE.Clock();
    let mixerBook;
    var camPosition = new THREE.Vector3();

    var directionalLight = new THREE.DirectionalLight({color: 0xFFFFFFF, intensity: 100});
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(ambientLight);
    scene.updateMatrixWorld(true);

    let controls = new THREE.PointerLockControls(cam, renderer.domElement);

    // let btn1 = document.querySelector("#button1");
    // btn1.addEventListener('click', () => {
    //     controls.lock();
    // });

    let keyboard = [];
    addEventListener('keydown', (e) => {
        keyboard[e.key] = true;
    });
    addEventListener('keyup', (e) => {
        keyboard[e.key] = false;
    });

    function process_keyboard() {
        let SPEED = 0.15;
        if (keyboard['p']) {
            controls.lock();
        }
        if (keyboard['w']) {
            controls.moveForward(SPEED);
            console.log("AAAAAAAAAAAAAA");
        }
        if (keyboard['s']) {
            controls.moveForward(-SPEED);
        } 
        if(keyboard['d']) {
            controls.moveRight(SPEED);
        }
        if(keyboard['a']) {
            controls.moveRight(-SPEED);
        }
    };
    var load_model_book = function() {
        var gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load("./data/models/medieval_fantasy_book/scene.gltf", (gltf) => {
            book = gltf.scene;
            book.scale.setScalar(1);
            book.rotation.y = MY_LIBS.degToRad(0);
            book.position.x = 2;
            // book.rotation.y = MY_LIBS.degToRad(0);
            scene.add(book);
            mixerBook = new THREE.AnimationMixer(book);
            gltf.animations.forEach((clip) => {
                mixerBook.clipAction(clip).play();
            })
        });
    };

    var drawScene = function() {
        requestAnimationFrame(drawScene);
        renderer.render(scene, cam);
        process_keyboard();
        const delta = clock.getDelta();
        mixerBook.update(delta);
        camPosition.setFromMatrixPosition((controls.getObject()).matrixWorld);
        console.log("Position: " + camPosition.x + ", " + camPosition.y + ", " + camPosition.z);
    };
    load_model_book();
    drawScene();
}