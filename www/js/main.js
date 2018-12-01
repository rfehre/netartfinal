



const socket = io()
socket.emit('apiReq', 'https://api.propublica.org/congress/v1/115/senate/members.json')
socket.on('apiRes', function(json) {
    const congressMem = json.results[0].congress;
    console.log(json);
    console.log(congressMem);

    var camera, scene, renderer, mesh, material, controls;
    init();
    animate();
    addCubes();
    render();


    function addCubes() {
    		var xDistance = 10;
        var zDistance = 10;
        var geometry = new THREE.SphereGeometry(2,50,50);
        var material = new THREE.MeshBasicMaterial({color:0x0000ff});

        //initial offset so does not start in middle.
        var xOffset = -50;
        var zOffset = -50;

        for(var i = 0; i < Math.sqrt(congressMem); i++){
            for(var j = 0; j < Math.sqrt(congressMem); j++){
            		var mesh  = new THREE.Mesh(geometry, material);
            		mesh.position.x = (xDistance * i) + xOffset;
                mesh.position.z = (zDistance * j) + zOffset;
            		scene.add(mesh);
            }
        };
    }

    function init() {
        // Renderer.
        renderer = new THREE.WebGLRenderer();
        //renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Add renderer to page
        document.body.appendChild(renderer.domElement);

        // Create camera.
        camera = new THREE.PerspectiveCamera(1000, window.innerWidth / window.innerHeight, 1, 5000);
        camera.position.y = -200;


        // Add controls
        controls = new THREE.TrackballControls( camera );
        controls.addEventListener( 'change', render );

        // Create scene.
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );

        // Create ambient light and add to scene.
        var light = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(light);

        // Create directional light and add to scene.
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1).normalize();
        scene.add(directionalLight);

        // Add listener for window resize.
        window.addEventListener('resize', onWindowResize, false);
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();

    }

    function render() {
    	renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        controls.handleResize();
    }

})
