/**
 * @author Medhi Foulgoc/ http://www.heolia.eu
**/

var camera, scene, renderer, stats;
/// Log Postion X, Y, Z
//
init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 20000 );
  camera.position.x = -586.5165139498704;
  camera.position.y = 186.0093253403975;
  camera.position.z = 801.5035073083026;
  scene = new THREE.Scene();

  /*var groundTexture = newTexture('textures/ground.jpg', 1, 6, 6);
  var ground = newObjMeshNoAutoText(2000, 50, 2000, groundTexture);
  //scene.add( ground );

  var ground2 = newObjMeshWithAutoText(2000, 50, 2000, 'textures/ground.jpg', 1, 6, 6);
  scene.add( ground2 );
*/
  var img = new Image();
  img.onload = function () {

      //get height data from img
      var data = getHeightData(img);

      // plane
      var geometry = new THREE.PlaneGeometry(10,10,5,5);
      var texture = THREE.ImageUtils.loadTexture( 'img/heightmap2.png' );
      var material = new THREE.MeshLambertMaterial( { map: texture } );
      plane = new THREE.Mesh( geometry, material );

      //set height of vertices
      for ( var i = 0; i<plane.geometry.vertices.length; i++ ) {
           plane.geometry.vertices[i].z = data[i];
      }

      scene.add(plane);

  };
  // load img source
  img.src = "img/heightmap2.png";
  //
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
  Stats();
}
function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
