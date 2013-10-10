// example of nice shading: http://www.greenbushlabs.com/ThreeJS/examples/webgl_lights_hemisphere.html

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

// renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 500;

// scene
var scene = new THREE.Scene();
        
// cube
var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshLambertMaterial({
  color: 'blue'
}));
cube.overdraw = true;
cube.rotation.x = Math.PI * 0.1;
scene.add(cube);

// add subtle blue ambient lighting
var ambientLight = new THREE.AmbientLight(0x000044);
scene.add(ambientLight);

// directional lighting
var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Add OrbitControls so that we can pan around with the mouse.
controls = new THREE.OrbitControls(camera, renderer.domElement);

// start animation
animate();