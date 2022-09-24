import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/fontloader';
import { TextGeometry } from 'three/examples/jsm/geometries/textgeometry';

const gui = new dat.GUI();
const canvas = document.querySelector('canvas.webgl');

const scene = new THREE.Scene();

const fontLoader = new FontLoader();

fontLoader.load(
  '/fonts/Creepster_Regular.json',
  (font) => {
    const textGeometry = new TextGeometry('The Haunted', {
      font,
      size: 1,
      height: 0.5,
      curveSegments: 1,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.0001,
    });

    const textMaterial = new THREE.MeshStandardMaterial({
      color: 'brown',
    });
    textGeometry.center();
    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);
    text.position.set(0.3, 5, 1);
  },
  undefined,
  () => {
    console.log('erroe');
  },
);

const doorColorTextureLoader = new THREE.TextureLoader().load('/textures/door/color.jpg');
const doorAlphaTextureLoader = new THREE.TextureLoader().load('/textures/door/alpha.jpg');
const doorAmbientOcclusion = new THREE.TextureLoader().load('/textures/door/ambientOcclusion.jpg');
const wallsTextureLoader = new THREE.TextureLoader().load('/textures/bricks/roughness.jpg');
const floorTextureLoader = new THREE.TextureLoader().load('/textures/grass/normal.jpg');
const moonTextureLoader = new THREE.TextureLoader().load('/textures/moon/redmoon.png');
const ghostTextureLoader = new THREE.TextureLoader().load('/textures/moon/ghost.png');
ghostTextureLoader.magFilter = THREE.NearestFilter;
doorColorTextureLoader.magFilter = THREE.NearestFilter;

const doorlight = new THREE.PointLight('red', 0.5, 7);

const ghostlight1 = new THREE.PointLight('red', 1, 7);

const ghostlight2 = new THREE.PointLight('pink', 1, 7);

const ghostlight3 = new THREE.PointLight('pink', 1, 7);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 10),
  new THREE.MeshBasicMaterial({
    map: moonTextureLoader,
    color: 'red',
  }),
);

moon.position.set(2.5, 6.5, -13.5);

scene.add(moon);
scene.add(ghostlight1);
scene.add(ghostlight2);
scene.add(ghostlight3);
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({
    map: doorColorTextureLoader,
    transparent: true,
    alphaMap: doorAlphaTextureLoader,
    aoMap: doorAmbientOcclusion,
    color: 'brown',
  }),
);

door.position.set(0, 0, 1.51);
doorlight.position.set(2.5, 2.5, 4);
gui.add(door.position, 'x', 1, 100, 0.5).name('doorpos(x)');
gui.add(door.position, 'y', 1, 100, 0.5).name('doorpos(y)');
gui.add(door.position, 'z', 1, 100, 0.5).name('doorpos(z)');
gui.add(doorlight.position, 'x', 1, 100, 0.5).name('doorlight(x)');
gui.add(doorlight.position, 'y', 1, 100, 0.5).name('doorlight(y)');
gui.add(doorlight.position, 'z', 1, 100, 0.5).name('doorlight(z)');

//!MOON GUI
gui.add(moon.position, 'x', -10, 100, 0.5).name('moonpos(x)');
gui.add(moon.position, 'y', -10, 100, 0.5).name('moonpos(y)');
gui.add(moon.position, 'z', -10, 100, 0.5).name('moonpos(z)');

/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

house.add(doorlight);
//Walls

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshStandardMaterial({
    map: wallsTextureLoader,
    color: 'red',
    opacity: 1,
    metalness: 0.5,
    roughness: 2,
  }),
);

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(2.5, 2, 4),
  new THREE.MeshStandardMaterial({
    color: 'red',
    map: wallsTextureLoader,
  }),
);

roof.position.y = 2.5;
roof.rotation.y = 2.4;

const stones = new THREE.Group();
house.add(stones);

const stone1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.3),
  new THREE.MeshStandardMaterial({
    color: 'brown',
  }),
);
const stone2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.3),
  new THREE.MeshStandardMaterial({
    color: 'brown',
  }),
);
const stone3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.3),
  new THREE.MeshStandardMaterial({
    color: 'brown',
  }),
);
stone2.position.set(-0.5, 0, 0);
stone3.position.set(2, 0, 0);
stones.add(stone1);
stones.add(stone2);
stones.add(stone3);

stones.position.set(-0.9, -0.3, 1.9);
house.position.y = 1;
gui.add(stones.position, 'y', 0, 100, 0.5).name('stone pos(y)');
gui.add(stones.position, 'x', 0, 100, 0.5).name('stone pos(x)');
gui.add(stones.position, 'z', 0, 10, 0.5).name('stone pos(z)');

gui.add(roof.position, 'y', 0, 100, 0.5).name('roof pos(y)');
gui.add(house.position, 'y', 0, 100, 0.5).name('house pos(y)');
gui.add(roof.rotation, 'y', 0, 10, 0.5).name('roof rotation');
house.position.y = 0.4;
house.add(walls);
house.add(roof);
house.add(door);

//ghost

const ghost1 = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.4, 0.2, 4, 10),
  new THREE.MeshBasicMaterial({
    color: '#efefef',
    fog: true,
    map: ghostTextureLoader,
  }),
);
ghost1.rotation.y = Math.PI * 5;
ghost1.rotation.x = 0;

const ghost2 = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.4, 0.2, 4, 10),
  new THREE.MeshBasicMaterial({
    color: '#efefef',
    fog: true,
    map: ghostTextureLoader,
  }),
);
ghost2.rotation.y = Math.PI * 5;
ghost2.rotation.x = 0;

ghostlight2.position.set(-5.5, 1, -1.5);
ghost1.position.set(2.5, 1, 4.5);
ghost2.position.set(-5.5, 1, -1.5);
gui.add(ghost1.position, 'x', 1, 20, 0.5).name('ghost(x)');
gui.add(ghost1.position, 'y', 1, 20, 0.5).name('ghost(y)');
gui.add(ghost1.position, 'z', 1, 20, 0.5).name('ghost(z)');

gui.add(ghost2.position, 'x', -10, 20, 0.5).name('ghost2(x)');
gui.add(ghost2.position, 'y', 1, 20, 0.5).name('ghost2(y)');
gui.add(ghost2.position, 'z', 1, 20, 0.5).name('ghost2(z)');

scene.add(ghost1);
scene.add(ghost2);
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    color: 'brown',
    map: floorTextureLoader,
    opacity: 0.6,
    roughness: 1,
    metalness: 0.4,
  }),
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

//Tombs
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterail = new THREE.MeshStandardMaterial({
  color: '#b2b6b1',
});

Array(59)
  .fill(1)
  .forEach(() => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 7 + 3;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const grave = new THREE.Mesh(graveGeometry, graveMaterail);

    grave.position.set(x, 0.3, z);

    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    graves.add(grave);
  });
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.0054);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('red', 0);
moonLight.position.set(2.5, 6.5, -13.5);

gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 7;
camera.position.y = 2;
camera.position.z = 10;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //ghost position set

  ghost1.position.x = Math.sin(elapsedTime) * 5.5;
  ghost1.position.y = Math.abs(Math.cos(elapsedTime)) * 1.5 + 0.5;
  ghost1.position.z = Math.cos(elapsedTime) * 8.5;

  ghost2.position.y = Math.abs(Math.sin(elapsedTime)) * 3.3 + 1;
  ghostlight1.position.x = Math.sin(elapsedTime) * 1.5;
  ghostlight1.position.y = Math.abs(Math.cos(elapsedTime)) * 1.5 + 0.5;
  ghostlight1.position.z = Math.cos(elapsedTime) * 8.5;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
let snd = new Audio("/sound/ghost.mp3");
snd.play();
snd.loop = true;
tick();
