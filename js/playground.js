var playground = function () {

    document.addEventListener("keydown", backToIndex);
    document.addEventListener("keydown",replay);
    function replay(event){
        var x = event.which || event.keyCode;
        if (x == 13) {
            location.replace("./gameScreen.html");
        }
    };

    function backToIndex(event) {
        var x = event.which || event.keyCode;
        if (x == 8) {
            location.replace("./index.html");
        }
    };

    window.addEventListener("resize", function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
    });

    const objects = [];
    let scene, renderer;
    let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
    let controls = new THREE.PointerLockControls(camera, document.body);
    let raycaster;

    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new THREE.Audio(listener);

    let mixerBook;
    let clock = new THREE.Clock();

    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let canJump = false;

    let prevTime = performance.now();
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const color = new THREE.Color();

    const endgameContainer = document.getElementById("endgame-container");
    const endgame = document.getElementById("endgame");
    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    init();
    animate();

    // INIT
    function init() {
        scene = new THREE.Scene();
        var directionalLight = new THREE.DirectionalLight({ color: 0xFFFFFFF, intensity: 100 });
        directionalLight.position.set(0, 1, 0);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
        scene.add(ambientLight);

        controls = new THREE.PointerLockControls(camera, document.body);
        scene.updateMatrixWorld(true);

        function load_model_book() {
            var gltfLoader = new THREE.GLTFLoader();
            gltfLoader.load("./data/models/medieval_fantasy_book/scene.gltf", (gltf) => {
                book = gltf.scene;
                book.scale.setScalar(20);
                book.rotation.y = MY_LIBS.degToRad(0);
                scene.add(book);
                mixerBook = new THREE.AnimationMixer(book);
                gltf.animations.forEach((clip) => {
                    mixerBook.clipAction(clip).play();
                })
            });
        };

        load_model_book();

        instructions.addEventListener('click', function () {
            controls.lock();
        }, false);

        controls.addEventListener('lock', function () {
            instructions.style.display = 'none';
            blocker.style.display = 'none';
        });

        controls.addEventListener('unlock', function () {
            instructions.style.display = '';
            blocker.style.display = 'block';
        });

        // SOUND
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('./data/audio/forest.ogg', function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);
            sound.play();
        });

        const onKeyDown = function (event) {

            switch (event.keyCode) {
                case 38: // up
                case 87: // w
                    moveForward = true;
                    break;

                case 37: // left
                case 65: // a
                    moveLeft = true;
                    break;

                case 40: // down
                case 83: // s
                    moveBackward = true;
                    break;

                case 39: // right
                case 68: // d
                    moveRight = true;
                    break;

                case 32: // space
                    if (canJump === true) velocity.y += 350;
                    canJump = false;
                    break;
            }
        };

        const onKeyUp = function (event) {

            switch (event.keyCode) {

                case 38: // up
                case 87: // w
                    moveForward = false;
                    break;

                case 37: // left
                case 65: // a
                    moveLeft = false;
                    break;

                case 40: // down
                case 83: // s
                    moveBackward = false;
                    break;

                case 39: // right
                case 68: // d
                    moveRight = false;
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);

        raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

        // objects

        const boxGeometry = new THREE.BoxBufferGeometry(20, 5, 40).toNonIndexed();

        position = boxGeometry.attributes.position;
        const colorsBox = [];

        for (let i = 0, l = position.count; i < l; i++) {

            color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
            colorsBox.push(color.r, color.g, color.b);

        }
        boxGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsBox, 3));

        for (let i = 0; i < 300; i++) {
            const boxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, flatShading: true, vertexColors: true });
            boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.x = Math.floor(Math.random() * 20 - 10) * 100;
            box.position.y = Math.floor(Math.random() * 20) * 20 + 20;
            box.position.z = Math.floor(Math.random() * 20 - 10) * 100;

            scene.add(box);
            objects.push(box);
        }

        scene.background = new THREE.TextureLoader().load("./data/background/sky.jpg");
        camera.position.set(0, 5, 0);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(innerWidth, innerHeight);
        document.body.appendChild(renderer.domElement);

    }

    //ANIMATE
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        mixerBook.update(delta);
        const time = performance.now();

        if (controls.isLocked === true) {
            raycaster.ray.origin.copy(controls.getObject().position);
            raycaster.ray.origin.y -= 10;
            const intersections = raycaster.intersectObjects(objects);
            const onObject = intersections.length > 0;
            const delta = (time - prevTime) / 1000;
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            velocity.y -= 9.8 * 100.0 * delta/1.5; // 100.0 = mass
            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            if (moveForward || moveBackward) velocity.z -= direction.z * 2000.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 2000.0 * delta;
            if (onObject === true) {
                velocity.y = Math.max(0, velocity.y);
                canJump = true;
            }
            controls.moveRight(- velocity.x * delta);
            controls.moveForward(- velocity.z * delta);
            controls.getObject().position.y += (velocity.y * delta);
            if (controls.getObject().position.y < 10) {
                velocity.y = 0;
                controls.getObject().position.y = 10;
                canJump = true;
            }

            //EndGame
            if (controls.getObject().position.y > 700) {
                endgameContainer.style.display = 'block';
                endgame.style.display = 'block';
                controls.unlock();
                blocker.innerHTML = '';
            }
        }
        prevTime = time;
        renderer.render(scene, camera);
    }
}