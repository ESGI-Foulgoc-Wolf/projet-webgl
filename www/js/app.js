var camera, scene, renderer, controls;
      var ground = [];
      var objects = [];
      var raycaster;
      var blocker = document.getElementById( 'blocker' );
      var instructions = document.getElementById( 'instructions' );
      // http://www.html5rocks.com/en/tutorials/pointerlock/intro/
      var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
      if ( havePointerLock ) {
        var element = document.body;
        var pointerlockchange = function ( event ) {
          if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
            controlsEnabled = true;
            controls.enabled = true;
            blocker.style.display = 'none';
          } else {
            controls.enabled = false;
            blocker.style.display = 'block';
            instructions.style.display = '';
          }
        };
        var pointerlockerror = function ( event ) {
          instructions.style.display = '';
        };
        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
        instructions.addEventListener( 'click', function ( event ) {
          instructions.style.display = 'none';
          // Ask the browser to lock the pointer
          element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
          element.requestPointerLock();
        }, false );
      } else {
        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
      }
      var stats = new Stats();
      stats.showPanel( 0 );
      document.body.appendChild( stats.dom );
      init();
      addLights();
      addGround();
      
      animate();
      var controlsEnabled = false;
      var moveForward = false;
      var moveBackward = false;
      var moveLeft = false;
      var moveRight = false;
      var canJump = false;
      var prevTime = performance.now();
      var velocity = new THREE.Vector3();
      var direction = new THREE.Vector3();
      function init() {
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );
        scene.fog = new THREE.Fog( 0xffffff, 0, 1000 );
        var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
        light.position.set( 0.5, 1, 0.75 );
        scene.add( light );
        controls = new THREE.PointerLockControls( camera );
        scene.add( controls.getObject() );
        var onKeyDown = function ( event ) {
          switch ( event.keyCode ) {
            case 38: // up
            case 90: // z
              moveForward = true;
              break;
            case 37: // left
            case 81: // q
              moveLeft = true; break;
            case 40: // down
            case 83: // s
              moveBackward = true;
              break;
            case 39: // right
            case 68: // d
              moveRight = true;
              break;
            case 32: // space
              if ( canJump === true ) velocity.y += 300;
              canJump = false;
              break;
          }
        };
        var onKeyUp = function ( event ) {
          switch( event.keyCode ) {
            case 38: // up
            case 90: // z
              moveForward = false;
              break;
            case 37: // left
            case 81: // q
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

        var box_geo = new THREE.BoxBufferGeometry(100, 50, 50);
        var box_mat = new THREE.MeshBasicMaterial( { color: 0xfffff } );
        box = new THREE.Mesh( box_geo, box_mat );
        box.position.set(100,100,-200);
        scene.add( box );
        objects.push( box );

        var box_geo2 = new THREE.BoxBufferGeometry(100, 100, 100);
        box2 = new THREE.Mesh( box_geo2, box_mat );
        box2.position.set(0,50,-200);
        scene.add( box2 );
        objects.push( box2 );

        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );
        raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
        //
        window.addEventListener( 'resize', onWindowResize, false );
      }
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }
      function animate() {
        requestAnimationFrame( animate );
        var time = performance.now() / 1000;
          stats.begin();
        if ( controlsEnabled === true ) {
          raycaster.ray.origin.copy( controls.getObject().position );
          raycaster.ray.origin.y -= 10;
          var intersections_ground = raycaster.intersectObjects( ground );
          var onGround = intersections_ground.length > 0;
           var intersections_objects = raycaster.intersectObjects( objects );
          var onObjects = intersections_objects.length > 0;
          var time = performance.now();
          var delta = ( time - prevTime ) / 1000;
          velocity.x -= velocity.x * 10.0 * delta;
          velocity.z -= velocity.z * 10.0 * delta;
          velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
          direction.z = Number( moveForward ) - Number( moveBackward );
          direction.x = Number( moveLeft ) - Number( moveRight );
          direction.normalize(); // this ensures consistent movements in all directions
          if ( moveForward || moveBackward ) velocity.z -= direction.z * 1600.0 * delta;
          if ( moveLeft || moveRight ) velocity.x -= direction.x * 1600.0 * delta;
          if ( onGround === true ) {
            velocity.y = Math.max( 0, velocity.y );
            canJump = true;
          }
          if ( (moveForward || moveBackward || moveLeft || moveRight) && onGround === true){
            velocity.y = Math.max( 200, velocity.y );
            canJump = true;
          }
          if ( onObjects === true ) {
            velocity.y = Math.max( 0, velocity.y );
            canJump = true;
          }
          controls.getObject().translateX( velocity.x * delta );
          controls.getObject().translateY( velocity.y * delta );
          controls.getObject().translateZ( velocity.z * delta );
          if ( controls.getObject().position.y < 0 ) {
            velocity.y = 0;
            controls.getObject().position.y = 200;
            canJump = true;
          }
          if ( controls.getObject().position.y < 50 ) {
            velocity.y = 0;
            controls.getObject().position.y = 50;
            canJump = true;
          }

          objects.forEach(function(object){
            if ( controls.getObject().position.x > (object.position.x - object.geometry.parameters.width/2 - 10) &&
              controls.getObject().position.x < (object.position.x + object.geometry.parameters.width/2 + 10) &&
              controls.getObject().position.z > (object.position.z - object.geometry.parameters.depth/2 - 10) &&
              controls.getObject().position.z < (object.position.z + object.geometry.parameters.depth/2 + 10) &&
              controls.getObject().position.y > (object.position.y - object.geometry.parameters.height/2 - 5) &&
              controls.getObject().position.y < (object.position.y + object.geometry.parameters.height/2 + 5)){

                if(controls.getObject().position.x < (object.position.x - object.geometry.parameters.width/2) ){
                  controls.getObject().position.x = object.position.x - object.geometry.parameters.width/2 -10;
                } else if(controls.getObject().position.z < (object.position.z - object.geometry.parameters.depth/2) ){
                  controls.getObject().position.z = object.position.z - object.geometry.parameters.depth/2 -10;
                } else if(controls.getObject().position.x > (object.position.x + object.geometry.parameters.width/2)){
                  controls.getObject().position.x = object.position.x + object.geometry.parameters.width/2 +10;
                } else if(controls.getObject().position.z > (object.position.z + object.geometry.parameters.depth/2) ){
                  controls.getObject().position.z = object.position.z + object.geometry.parameters.depth/2 +10;
                } else if(controls.getObject().position.y > (object.position.y - object.geometry.parameters.height/2 -5) ){
                  controls.getObject().position.y = object.position.y - object.geometry.parameters.height/2 -10;
                  velocity.y = -10;
                }
            }
          });
          
          /*objects.forEach(function(object){
            object.translateX(1);
          });*/
          prevTime = time;
        }
        stats.end();
        renderer.render( scene, camera );
      }
      function addLights() {
       var ambientLight = new THREE.AmbientLight(0x444444);
       ambientLight.intensity = 0.0;
       scene.add(ambientLight);

       var directionalLight = new THREE.DirectionalLight(0xffffff);

       directionalLight.position.set(1800, 800, 0000).normalize();
       scene.add(directionalLight);
      }

      //To get the pixels, draw the image onto a canvas. From the canvas get the Pixel (R,G,B,A)
      function getTerrainPixelData()
      {
        var img = document.getElementById("landscape-image");
        var canvas = document.getElementById("canvas");

        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

        var data = canvas.getContext('2d').getImageData(0,0, img.height, img.width).data;
        var normPixels = []

        for (var i = 0, n = data.length; i < n; i += 4) {
          // get the average value of R, G and B.
          normPixels.push((data[i] + data[i+1] + data[i+2]) / 3);
        }

        return normPixels;
      }

      function addGround() {
        var numSegments = 17;

        var geometry = new THREE.PlaneGeometry(1000, 1000, numSegments, numSegments);
        var material = new THREE.MeshLambertMaterial({
          color: 0xccccff,
          wireframe: false
        });

        terrain = getTerrainPixelData();

        for (var i = 0, l = geometry.vertices.length; i < l; i++)
        {
          var terrainValue = terrain[i] / 255;
          geometry.vertices[i].z = geometry.vertices[i].z + terrainValue * 200 ;
        }

        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        var plane = new THREE.Mesh(geometry, material);

        plane.position = new THREE.Vector3(0,0,0);
        // rotate the plane so up is where y is growing..

        var q = new THREE.Quaternion();
        q.setFromAxisAngle( new THREE.Vector3(-1,0,0), 90 * Math.PI / 180 );
        plane.quaternion.multiplyQuaternions( q, plane.quaternion );
        scene.add(plane);
        ground.push(plane);
      }
