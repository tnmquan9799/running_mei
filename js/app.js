var app = function() {
    // init scene, camera, objects and renderer
    var scene, camera, renderer;
    const clock = new THREE.Clock();
    let mixerBook, mixerMei;
    const A_key = 65, D_key = 68;
    var position = new THREE.Vector3();
    var create_crate = function() {
        // texture
        var crate_texture = new THREE.TextureLoader().load("./data/textures/crate/crate0_diffuse.png");
        var bump_map_texture = new THREE.TextureLoader().load("./data/textures/crate/crate0_bump.png");
        var normal_map_texture = new THREE.TextureLoader().load("./data/textures/crate/crate0_normal.png");

        // geometry
        const geometryCube = new THREE.CubeGeometry(1, 1, 1);

        // material
        const material = new THREE.MeshPhongMaterial({map: crate_texture, bumpMap: bump_map_texture, normalMap: normal_map_texture});

        // object
        cube = new THREE.Mesh(geometryCube, material);
        cube.position.z = 2;

        scene.add(cube);
    };
    var create_skybox = function() {
        // geometry
        const geometryBox = new THREE.BoxGeometry(100, 100, 100);

        // texture
        var front_texture = new THREE.TextureLoader().load("./data/textures/skybox/arid2_ft.jpg");
        var back_texture = new THREE.TextureLoader().load("./data/textures/skybox/arid2_bk.jpg");
        var up_texture = new THREE.TextureLoader().load("./data/textures/skybox/arid2_up.jpg");
        var down_texture = new THREE.TextureLoader().load("./data/textures/skybox/arid2_dn.jpg");
        var right_texture = new THREE.TextureLoader().load("./data/textures/skybox/arid2_rt.jpg");
        var left_texture = new THREE.TextureLoader().load("./data/textures/skybox/arid2_lf.jpg");

        // add textures to material arrays
        var materials= [];
        materials.push(new THREE.MeshBasicMaterial({map: front_texture}));
        materials.push(new THREE.MeshBasicMaterial({map: back_texture}));
        materials.push(new THREE.MeshBasicMaterial({map: up_texture}));
        materials.push(new THREE.MeshBasicMaterial({map: down_texture}));
        materials.push(new THREE.MeshBasicMaterial({map: right_texture}));
        materials.push(new THREE.MeshBasicMaterial({map: left_texture}));
        
        for (var i=0; i<6; i++) {
            materials[i].side = THREE.BackSide;
        }

        skybox = new THREE.Mesh(geometryBox, materials);
        scene.add(skybox);
    };
    var create_ground = function() {
        // geometry
        const geometryPlane = new THREE.PlaneGeometry(1000, 1000, 50, 50);

        // texture
        var grass_texture = new THREE.TextureLoader().load("./data/textures/grass/Green-Grass-Ground-Texture-DIFFUSE.jpg");
        var normal_texture = new THREE.TextureLoader().load("./data/textures/grass/Green-Grass-Ground-Texture-NORMAL.jpg");
        var disp_texture = new THREE.TextureLoader().load("./data/textures/grass/Green-Grass-Ground-Texture-DISP.jpg");
        var specular_texture = new THREE.TextureLoader().load("./data/textures/grass/Green-Grass-Ground-Texture-SPECULAR.jpg");

        // material
        var material  = new THREE.MeshPhongMaterial({map: grass_texture,
                                                    normalMap: normal_texture,
                                                    displacementMap: disp_texture,
                                                    specularMap: specular_texture,
                                                    specular: 0xffffff,
                                                    shininess: 20});

        ground = new THREE.Mesh(geometryPlane, material);
        ground.position.z = -15;
        ground.position.y = -10;
        ground.rotation.x = -Math.PI/2;
        scene.add(ground);
    };
    var create_envSphere = function() {
        // geometry
        const geometrySphere = new THREE.SphereGeometry(5, 32, 32);

        // texture
        var loader = new THREE.CubeTextureLoader();
        loader.setPath("./data/textures/skybox/");
        var texture_cube = loader.load([
            'arid2_ft.jpg', 'arid2_bk.jpg', 'arid2_up.jpg', 'arid2_dn.jpg', 'arid2_rt.jpg', 'arid2_lf.jpg'
        ]);
        // material
        var material  = new THREE.MeshBasicMaterial({color: 0xffffff, envMap: texture_cube});

        sphere = new THREE.Mesh(geometrySphere, material);
        sphere.position.z = -15;
        sphere.position.x = -10;
        
        scene.add(sphere);
    };
    var load_model_book = function() {
        var gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load("./data/models/medieval_fantasy_book/scene.gltf", (gltf) => {
            book = gltf.scene;
            book.scale.setScalar(0.7);
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
            mei.scale.setScalar(0.07);
            mei.position.x = 0;
            mei.rotation.y = MY_LIBS.degToRad(0);
            mei.position.z = 5;
            scene.add(mei);
            mixerMei = new THREE.AnimationMixer(mei);
            gltf.animations.forEach((clip) => {
                mixerMei.clipAction(clip).play();
            })
        });
    };
    var onKeyDown = function(e) {
        console.log("The current key: " + e.keyCode);
        switch(e.keyCode) {
            case A_key:
                mei.position.x += -0.5;
                break;
            case D_key:
                mei.position.x += 0.5;
            default:
                console.log("The current key: " + e.keyCode);
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

        // create_crate();
        // create_skybox();
        // create_ground();
        // create_envSphere();
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
        position.getPositionFromMatrix(mei.matrixWorld);
        console.log("Position: " + position.x + ", " + position.y + ", " + position.z);
        renderer.render(scene, camera);
    };
    init_app();
    mainLoop();
}