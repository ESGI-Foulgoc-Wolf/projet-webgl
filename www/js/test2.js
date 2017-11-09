var container, stats;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
init();
animate();
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 20000 );
  camera.position.x = 2;
  camera.position.y = 186.0093253403975;
  camera.position.z = 801.5035073083026;
  scene = new THREE.Scene();
	// scene
	// BEGIN Clara.io JSON loader code
	var objectLoader = new THREE.ObjectLoader();
	objectLoader.load("./assets/World/scene.json", function ( obj ) {
	 	scene.add( obj );
	} );
	// END Clara.io JSON loader code
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;
}
//
function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;
	camera.lookAt( scene.position );
	renderer.render( scene, camera );
}
