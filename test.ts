// === IMPORTY ===
import * as THREE from 'three';
import { Tween, Easing, Group } from '@tweenjs/tween.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

// === TWEEN GROUP ===
const tweenGroup = new Group();

// === ZMIENNE GLOBALNE ===
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: CSS3DRenderer;
let controls: TrackballControls;

const objects: CSS3DObject[] = [];

const targets = {
  table: [] as THREE.Object3D[],
  sphere: [] as THREE.Object3D[],
  helix: [] as THREE.Object3D[],
  grid: [] as THREE.Object3D[],
};

let initialCameraPosition = new THREE.Vector3();
let initialCameraRotation = new THREE.Euler();

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

window.addEventListener('resize', () => {
  console.log(`Nowy rozmiar: ${window.innerWidth}px x ${window.innerHeight}px`);
  onWindowResize();
});

function init(): void {
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  scene = new THREE.Scene();
  saveInitialCameraState();

  for (let i = 0; i < 20; i++) {
    const mainContainer = document.createElement('div');
    mainContainer.id = 'mainContainer';
    mainContainer.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';
    mainContainer.style.width = (screenWidth / 10) + 'px';
    mainContainer.style.height = '160px';

    const symbol = document.createElement('div');
    symbol.className = 'symbol';
    symbol.textContent = 'El' + i;
    symbol.style.fontSize = '40px';
    symbol.style.color = '#fff';
    symbol.style.marginTop = '40px';
    mainContainer.appendChild(symbol);

    const objectCSS = new CSS3DObject(mainContainer);
    objectCSS.position.x = Math.random() * 4000 - 2000;
    objectCSS.position.y = Math.random() * 4000 - 2000;
    objectCSS.position.z = Math.random() * 4000 - 2000;
    scene.add(objectCSS);
    objects.push(objectCSS);

    const object = new THREE.Object3D();
    object.position.x = (i % 5) * 400 - 800;
    object.position.y = -Math.floor(i / 5) * 400 + 800;
    object.position.z = 0;
    targets.table.push(object);
  }

  renderer = new CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container')?.appendChild(renderer.domElement);

  controls = new TrackballControls(camera, renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener('change', render);

  transform(targets.table, 2000);
}

function animate(): void {
  requestAnimationFrame(animate);
  tweenGroup.update();
  controls.update();
  render();
}

function render(): void {
  renderer.render(scene, camera);
}

function onWindowResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function transform(targets: THREE.Object3D[], duration: number): void {
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const target = targets[i];

    new Tween(object.position, tweenGroup)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
      .easing(Easing.Exponential.InOut)
      .start();

    new Tween(object.rotation, tweenGroup)
      .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
      .easing(Easing.Exponential.InOut)
      .start();
  }

  new Tween({}, tweenGroup)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
}

function saveInitialCameraState(): void {
  initialCameraPosition.copy(camera.position);
  initialCameraRotation.copy(camera.rotation);
}

function moveToCenter(object: CSS3DObject): void {
  const targetPosition = new THREE.Vector3().copy(object.position);
  const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(object.quaternion).normalize();
  const cameraPosition = new THREE.Vector3().copy(targetPosition).addScaledVector(normal, 1000);

  new Tween(camera.position, tweenGroup)
    .to({ x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z }, 1000)
    .easing(Easing.Exponential.InOut)
    .start();

  new Tween(controls.target, tweenGroup)
    .to({ x: targetPosition.x, y: targetPosition.y, z: targetPosition.z }, 1000)
    .easing(Easing.Exponential.InOut)
    .start();
}

// === START ===
init();
animate();
