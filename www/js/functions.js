/*
  #################################################################
  #                     READ HEIGHTMAPS                           #
  #################################################################
*/

function getHeightData(img) {
    var canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 128;
    var context = canvas.getContext( '2d' );

    var size = 128 * 128, data = new Float32Array( size );

    context.drawImage(img,0,0);

    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, 128, 128);
    var pix = imgd.data;

    var j=0;
    for (var i = 0, n = pix.length; i < n; i += (4)) {
        var all = pix[i]+pix[i+1]+pix[i+2];
        data[j++] = all/30;
    }

    return data;
}

/*function getHeightData (img, scale){
  if (scale == undefined){
    scale = 1;
  }
  var canvas = document.createElement( 'canvas' );
  canvas.width = img.width;
  canvas.height = img.height;
  var context = canvas.getContext( '2d' );

  var size = img.width * img.height;
  var data = new Float32Array ( size );

  context.drawImage( img, 0, 0 );

  for (var i = 0; i < size; i++){
    data[i] = 0;
  }

  var imgd = context.getImageData(0, 0, img.width, img.height);
  var pix = imgd.data;

  var j = 0;
  for(var i = 0; i < pix.lenght; i += 4){
    var all = pix[i] + pix[i+1] + pix[i+2];
    data[j++] = all/(12 * scale);
  }
  return data;
}*/

/*
  #################################################################
  #                         TEXTURE                               #
  #################################################################
*/
function newTexture(texturePath, activeWrap, repX, repY){
  var newText = new THREE.TextureLoader().load( texturePath );
  if(activeWrap == 1){
    newText.wrapS = THREE.RepeatWrapping;
    newText.wrapT = THREE.RepeatWrapping;
    newText.repeat.set( repX, repY );
  }
  return newText;
}
/*
  #################################################################
  #               NEW OBJECT WITHOUT AUTO TEXTURE                 #
  #################################################################
*/
function newObjMeshNoAutoText (dimX, dimY, dimZ, texture){
  var newObjGeo = new THREE.BoxBufferGeometry(dimX, dimY, dimZ);
  var newObjMat = new THREE.MeshBasicMaterial( { map: texture } );
  var newMesh = new THREE.Mesh( newObjGeo, newObjMat );
  return newMesh;
}
/*
  #################################################################
  #                  NEW OBJECT TEXTURE                           #
  #################################################################
*/
function newObjMeshWithAutoText (dimX, dimY, dimZ, texturePath, activeWrap, repX, repY){
  var newText = new THREE.TextureLoader().load( texturePath );
  if(activeWrap == 1){
    newText.wrapS = THREE.RepeatWrapping;
    newText.wrapT = THREE.RepeatWrapping;
    newText.repeat.set( repX, repY );
  }
  var newObjGeo = new THREE.BoxBufferGeometry(dimX, dimY, dimZ);
  var newObjMat = new THREE.MeshBasicMaterial( { map: newText } );
  var newMesh = new THREE.Mesh( newObjGeo, newObjMat );
  return newMesh;
}
