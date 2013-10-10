// example of nice shading: 
// http://www.greenbushlabs.com/ThreeJS/examples/webgl_lights_hemisphere.html

// revolutions per second
var angularSpeed = 0.05;
var lastTime = 0;

// this function is executed on each animation frame
function animate(){
  // update
  var time = (new Date()).getTime();
  var timeDiff = time - lastTime;
  var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
  cube.rotation.y += angleChange;
  lastTime = time;

  // render
  renderer.render(scene, camera);

  // request new frame
  requestAnimationFrame(function(){
      animate();
  });

  controls.update();
}

// camera
var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set( 0, 70, 550 );

// scene
scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
scene.fog.color.setHSL( 0.6, 0, 1 );

// hemisphere lighting
hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 0, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 500, 0 );
scene.add( hemiLight );

// directional light
dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.color.setHSL( 0.1, 0.5, 0.95 );
dirLight.position.set( -1, 1.75, 1 );
dirLight.position.multiplyScalar( 50 );
scene.add( dirLight );

dirLight.castShadow = true;
dirLight.shadowMapWidth = 4000;
dirLight.shadowMapHeight = 4000;



// ground planes
var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
var groundMat = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 0xffffff, specular: 0x050505 } );
groundMat.color.setHSL( 0.09, 0, 0.9 );
var ground = new THREE.Mesh( groundGeo, groundMat );
ground.rotation.x = -Math.PI/2;
ground.position.y = -35;
scene.add( ground );

ground.receiveShadow = true;

// sky dome
var vertexShader = document.getElementById( 'vertexShader' ).textContent;
var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
var uniforms = {
  topColor:    { type: "c", value: new THREE.Color( 0x0077ff ) },
  bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
  offset:    { type: "f", value: 33 },
  exponent:  { type: "f", value: 0.6 }
};
uniforms.topColor.value.copy( hemiLight.color );
scene.fog.color.copy( uniforms.bottomColor.value );
var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
var sky = new THREE.Mesh( skyGeo, skyMat );
scene.add( sky );

// cube object
var cube = new THREE.Mesh(new THREE.CubeGeometry(120, 120, 120), new THREE.MeshPhongMaterial({
  color: 0x333333, specular: 0xffffff, shininess: 20
}));
cube.overdraw = true;
//cube.rotation.x = Math.PI * 0.1;
cube.position.y = 30;
cube.castShadow = true;
cube.receiveShadow = true;

scene.add(cube);


// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor( scene.fog.color, 1 );

renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.physicallyBasedShading = true;

renderer.shadowMapEnabled = true;
//renderer.shadowMapCullFace = THREE.CullFaceBack;

// Add OrbitControls so that we can pan around with the mouse.
controls = new THREE.OrbitControls(camera, renderer.domElement);

// start animation
animate();



