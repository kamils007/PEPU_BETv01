// ✅ initMixedScene.tsx – pełna wersja z podwójną sceną
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer } from 'three';
import { Group } from '@tweenjs/tween.js';

import { transform } from './transform';
import { moveToCenter, focusOnObject, resetSceneOld, adjustCameraForScreen } from './helpers';
import { render } from '../main';
import { updateCardIndices, updateRotation } from './components/carousel';
import { myScratchCards } from './components/myScratchCards';

export let camera: THREE.PerspectiveCamera;
export let webglScene: THREE.Scene;
export let cssScene: THREE.Scene;
export let webglRenderer: THREE.WebGLRenderer;
export let cssRenderer: CSS3DRenderer;
export let controls: TrackballControls;
export let mixer: AnimationMixer;
export let initialCameraPosition = new THREE.Vector3();
export let initialCameraRotation = new THREE.Euler();

const loader = new GLTFLoader();
export const objects: CSS3DObject[] = [];
export const targets = {
  table: [] as THREE.Object3D[],
  sphere: [] as THREE.Object3D[],
  helix: [] as THREE.Object3D[],
  grid: [] as THREE.Object3D[]
};
const columns = 12;
const cardRegistry = new Map<number, { object: CSS3DObject; container: HTMLDivElement }>();

export function initMixedScene(tweenGroup: Group) {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  adjustCameraForScreen(camera);
  initialCameraPosition.copy(camera.position);
  initialCameraRotation.copy(camera.rotation);
  webglScene = new THREE.Scene();
  cssScene = new THREE.Scene();

  webglRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  webglRenderer.setSize(window.innerWidth, window.innerHeight);
  webglRenderer.domElement.style.position = 'absolute';
  webglRenderer.domElement.style.top = '0';
  webglRenderer.domElement.style.left = '0';
  webglRenderer.domElement.style.zIndex = '0';

  cssRenderer = new CSS3DRenderer();
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.domElement.style.position = 'absolute';
  cssRenderer.domElement.style.top = '0';
  cssRenderer.domElement.style.left = '0';
  cssRenderer.domElement.style.zIndex = '1';

  const container = document.getElementById('container');
  if (container) {
    container.appendChild(webglRenderer.domElement);
    container.appendChild(cssRenderer.domElement);
  }

  controls = new TrackballControls(camera, cssRenderer.domElement);
  controls.rotateSpeed = 0.5;

  webglScene.add(new THREE.AxesHelper(100));
  webglScene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  webglScene.add(light);

  loader.load('/models/Box.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(10, 10, 10);
    model.position.set(0, 0, 0);
    webglScene.add(model);

    if (gltf.animations.length > 0) {
      mixer = new AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    } else {
      console.warn('⚠️ Brak animacji w Box.glb – to OK.');
    }
  });

  fetch(`${import.meta.env.BASE_URL}python/scratch_cards.json`)
    .then((res) => res.json())
    .then((cards: { id: number; isWinner: boolean }[]) => {
      const selected = cards.sort(() => 0.5 - Math.random()).slice(0, 120);
      selected.forEach((card, index) => createScratchCard(card.id, card.isWinner, index, tweenGroup));
      generateOtherLayouts(objects);
      transform(targets.table, 3000, objects, tweenGroup, () => {
        cssRenderer.render(cssScene, camera);
      });
    });

  const layoutButtons = ['table', 'sphere', 'helix', 'grid'];
  layoutButtons.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => transform(targets[id], 3000, objects, tweenGroup, () => cssRenderer.render(cssScene, camera)));
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    webglRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function createScratchCard(id: number, isWinner: boolean, index: number, tweenGroup: Group) {
  const mainContainer = document.createElement('div');
  mainContainer.className = 'mainContainer';
  mainContainer.style.backgroundColor = `rgba(0,127,127,${Math.random() * 0.5 + 0.25})`;
  mainContainer.style.width = '170px';
  mainContainer.style.maxHeight = '180px';

  const messageParagraph = document.createElement('p');
  messageParagraph.className = 'scratchMessage';
  messageParagraph.textContent = isWinner ? '💰 1.000.000 PEPU' : '🤞 Może się uda!';
  mainContainer.appendChild(messageParagraph);

  const cssObject = new CSS3DObject(mainContainer);
  cssObject.position.x = Math.random() * 4000 - 2000;
  cssObject.position.y = Math.random() * 4000 - 2000;
  cssObject.position.z = Math.random() * 4000 - 2000;
  cssScene.add(cssObject);
  objects.push(cssObject);

  const row = Math.floor(index / columns);
  const col = index % columns;
  const containerWidth = parseFloat(mainContainer.style.width);
  const separationX = containerWidth * 1.2;
  const separationY = 350;
  const offsetX = (columns - 1) * separationX / 2;
  const offsetY = (Math.ceil(objects.length / columns) - 1) * separationY / 2 + 600;

  const target = new THREE.Object3D();
  target.position.x = col * separationX - offsetX;
  target.position.y = -row * separationY + offsetY;
  target.position.z = 0;
  targets.table.push(target);

  mainContainer.addEventListener('mousedown', () => {
    moveToCenter(cssObject, camera, controls, tweenGroup, objects, focusOnObject);
  });

  cardRegistry.set(id, { object: cssObject, container: mainContainer });
}  

export function removeCardFromScene(id: number) {
  const entry = cardRegistry.get(id);
  if (!entry) return;
  cssScene.remove(entry.object);
  const index = objects.indexOf(entry.object);
  if (index !== -1) objects.splice(index, 1);
  cardRegistry.delete(id);
  render();
}

function generateOtherLayouts(objects: CSS3DObject[]) {
  const vector = new THREE.Vector3();
  targets.sphere = [];
  targets.helix = [];
  targets.grid = [];

  for (let i = 0, l = objects.length; i < l; i++) {
    const phi = Math.acos(-1 + (2 * i) / l);
    const theta = Math.sqrt(l * Math.PI) * phi;

    const objectSphere = new THREE.Object3D();
    objectSphere.position.x = 800 * Math.cos(theta) * Math.sin(phi);
    objectSphere.position.y = 800 * Math.sin(theta) * Math.sin(phi);
    objectSphere.position.z = 800 * Math.cos(phi);
    vector.copy(objectSphere.position).multiplyScalar(2);
    objectSphere.lookAt(vector);
    targets.sphere.push(objectSphere);

    const phiH = i * 0.175 + Math.PI;
    const objectHelix = new THREE.Object3D();
    objectHelix.position.x = 900 * Math.sin(phiH);
    objectHelix.position.y = -(i * 8) + 450;
    objectHelix.position.z = 900 * Math.cos(phiH);
    vector.set(objectHelix.position.x * 2, objectHelix.position.y, objectHelix.position.z * 2);
    objectHelix.lookAt(vector);
    targets.helix.push(objectHelix);

    const objectGrid = new THREE.Object3D();
    objectGrid.position.x = ((i % 5) * 400) - 800;
    objectGrid.position.y = (-(Math.floor(i / 5) % 5) * 400) + 800;
    objectGrid.position.z = (Math.floor(i / 25)) * 1000 - 2000;
    targets.grid.push(objectGrid);
  }
}
