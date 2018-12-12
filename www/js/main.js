const billselect = 1;

$("select").change(function(){
    clearScene(scene);
    const billselect = document.getElementById("billselect").value;
    console.log(billselect);
    socket.emit('apiReq', 'https://api.propublica.org/congress/v1/115/senate/sessions/1/votes/' + billselect + '.json');


});

function clearScene( scene ) {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const object = scene.children[i];
    if (object.type === 'Mesh') {
      object.geometry.dispose();
      object.material.dispose();
      scene.remove(object);
    }
  }
}


    // DOM
    // Title
    let billTitle, billDesc, billDate, billResult;





    // VOTE Variables


    // console.log(json);
    // console.log(billTitle);

    let camera, scene, renderer, mesh, material, controls;
    let mouse, raycaster, intersections;


    init();
    animate();
    setupRaycaster();
    // init();
    // animate();
    //
    // render();

    function setupRaycaster(){
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        intersections = [];
        document.addEventListener('mousemove', function(e){
            mouse.x = (e.clientX / renderer.domElement.width) * 2 - 1;
            mouse.y = - (e.clientY / renderer.domElement.height) * 2 + 1;
            raycaster.setFromCamera( mouse, camera );
            intersections = raycaster.intersectObjects(scene.children)
        })
        document.addEventListener('click', function(e){
            let name = intersections[0].object.userData.name;
            let party = intersections[0].object.userData.party;
            let state = intersections[0].object.userData.state;
            let voteposition = intersections[0].object.userData.vote_position;

            document.getElementById("senatorinfo").textContent = name + " (" + party + "), " + state;
            document.getElementById("senatorvote").textContent = voteposition;
        })
    }


    // // add raycaster & mouse as 2d vector
    // raycaster = new THREE.Raycaster();
    // mouse = new THREE.Vector2();
    //
    // function onDocumentTouchStart(event) {
    //     event.preventDefault();
    //
    //     event.clientX = event.touches[0].clientX;
    //     event.clientY = event.touches[0].clientY;
    //     onDocumentMouseDown( event );
    // }
    //
    // function onDocumentMouseDown( event ) {
    //     event.preventDefault();
    //
    //     mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
    //     mouse.y = - (event.clientY / renderer.domElement.height) * 2 + 1;
    //
    //     raycaster.setFromCamera(mouse, camera);
    //
    //     var intersects = raycaster.intersectObjects(scene.meshDem);
    //
    //     if (intersects.length > 0) {
    //
    //     }
    // }

    //add event listener for mouse and calls function when activated
    // document.addEventListener('mousedown', onDocumentMouseDown, false);
    // document.addEventListener('touchstart', onDocumentTouchStart, false);

    function addCubes(json) {

        const senators = json.results.votes.vote.positions;
        console.log(senators);
    	var xDistance = -10;
        var zDistance = 10;
        var geometry = new THREE.SphereGeometry(3,100,100);
        var materialRep =  new THREE.MeshLambertMaterial({color:0xff0000});
        var materialDem =  new THREE.MeshLambertMaterial({color:0x0000ff});
        var materialInd =  new THREE.MeshLambertMaterial({color:0xfff300});

        //initial offset so does not start in middle.
        // var xOffset = -50;
        // var zOffset = -50;

        for (var i = 1; i < senators.length; i++) {
            if (senators[i].vote_position == "Yes" && senators[i].party == "R") {
                var meshRep = new THREE.Mesh(geometry, materialRep);
                meshRep.position.x = (xDistance * i);
                meshRep.userData = senators[i]
                scene.add(meshRep);
            } else if (senators[i].vote_position == "No" && senators[i].party == "R") {
                var meshRep = new THREE.Mesh(geometry, materialRep);
                meshRep.position.x = (xDistance * i);
                meshRep.position.y = -20;
                meshRep.userData = senators[i]
                scene.add(meshRep);
            } else if (senators[i].vote_position == "Yes" && senators[i].party == "D") {
                var meshDem = new THREE.Mesh(geometry, materialDem);
                meshDem.position.x = (xDistance * i);
                meshDem.userData = senators[i]
                scene.add(meshDem);
            } else if (senators[i].vote_position == "No" && senators[i].party == "D") {
                var meshDem = new THREE.Mesh(geometry, materialDem);
                meshDem.position.x = (xDistance * i);
                meshDem.position.y = -20;
                meshDem.userData = senators[i]
                scene.add(meshDem);
            } else if (senators[i].vote_position == "Yes" && senators[i].party == "I") {
                var meshInd = new THREE.Mesh(geometry, materialInd);
                meshDem.position.x = (xDistance * i);
                meshDem.userData = senators[i]
                scene.add(meshDem);
            } else if (senators[i].vote_position == "No" && senators[i].party == "I") {
                var meshInd = new THREE.Mesh(geometry, materialInd);
                meshInd.position.x = (xDistance * i);
                meshInd.position.y = -20;
                meshInd.userData = senators[i]
                scene.add(meshInd);
            }
        }
}
        // for(var i = 0; i < Math.sqrt(congressMem); i++){
        //     for(var j = 0; j < Math.sqrt(congressMem); j++){
        //     		var mesh  = new THREE.Mesh(geometry, material);
        //     		mesh.position.x = (xDistance * i) + xOffset;
        //         mesh.position.z = (zDistance * j) + zOffset;
        //     		scene.add(mesh);
        //     }
        // };

    function init() {
        // Renderer.
        renderer = new THREE.WebGLRenderer();
        //renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // Add renderer to page
        document.body.appendChild(renderer.domElement);

        // Create camera. (perspective)
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1200;
        camera.position.x = -500;
        camera.position.y = 200;

        // Create scene.
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );

        // Create ambient light and add to scene.
        var light = new THREE.AmbientLight(0xff6ff0);
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
        // controls.update();
        renderer.render(scene, camera);

    }


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        // controls.handleResize();
    }





const socket = io()


socket.emit('apiReq', 'https://api.propublica.org/congress/v1/115/senate/sessions/1/votes/' + billselect + '.json')

socket.on('apiRes', function(json){

    console.log(json);
    billTitle = json.results.votes.vote.bill.title;
    document.getElementById("billtitle").textContent = billTitle;
    // Description
    billDesc = json.results.votes.vote.description;
    document.getElementById("billdesc").textContent = billDesc;
    // Date
    billDate = json.results.votes.vote.date;
    document.getElementById("billdate").textContent = billDate;
    // Result
    billResult = json.results.votes.vote.result;
    document.getElementById("billresult").textContent = billResult;


    addCubes(json);
})
