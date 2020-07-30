/**
 * A basic ThreeJS cube scene.
 * @author Matt DesLauriers (@mattdesl)
 */

const canvasSketch = require("canvas-sketch");

// Ensure ThreeJS is in global scope for the 'examples/'
const THREE = require("three");

// Include any additional ThreeJS examples below
// require("three/examples/js/controls/OrbitControls");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  // Turn on MSAA
  attributes: { antialias: true },
};

const sketch = ({ width, height, context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context,
  });

  // WebGL background color
  renderer.setClearColor("#fff", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  // camera.position.set(2, 2, -4);
  // camera.lookAt(new THREE.Vector3());

  // var camera = new THREE.OrthographicCamera(
  //   width / -2,
  //   width / 2,
  //   height / 2,
  //   height / -2,
  //   1,
  //   5
  // );
  camera.position.set(1, 1, -4);
  camera.lookAt(new THREE.Vector3());
  // scene.add(camera);

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera);

  // Setup your scene
  const scene = new THREE.Scene();

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  for (var i = 0; i < 6; i++) {
    geometry.faces[i].color.setHex(0x719dca);
  }

  for (var i = 6; i < 12; i++) {
    geometry.faces[i].color.setHex(0x58595b);
  }

  var material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    vertexColors: true,
  });

  const mesh = new THREE.Mesh(
    geometry,
    material
    // new THREE.BoxGeometry(1, 1, 1),
    // new THREE.MeshPhysicalMaterial({
    //   color: "white",
    //   roughness: 0.75,
    //   flatShading: true,
    // })
  );
  scene.add(mesh);

  // Specify an ambient/unlit colour
  // scene.add(new THREE.AmbientLight("#ff0000"));

  // Add some light
  // const light = new THREE.PointLight("#45caf7", 1, 15.5);
  // light.position.set(2, 2, -4).multiplyScalar(1.5);
  // scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // And render events here
    render({ time, deltaTime }) {
      mesh.rotation.y = time * ((10 * Math.PI) / 180);
      // controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of WebGL context (optional)
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
