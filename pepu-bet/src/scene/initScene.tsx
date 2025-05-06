import * as THREE from 'three';
// @ts-ignore
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
// @ts-ignore
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { Group } from '@tweenjs/tween.js';
import { transform } from './transform';
import { moveToCenter, focusOnObject, resetSceneOld } from './helpers';
import { render } from '../main';
import { updateCardIndices, updateRotation } from './components/carousel';
import { myScratchCards, MyScratchCard } from './components/myScratchCards';

export let camera: THREE.PerspectiveCamera;
export let scene: THREE.Scene;
export let renderer: CSS3DRenderer;
export let controls: TrackballControls;
export let initialCameraPosition = new THREE.Vector3();
export let initialCameraRotation = new THREE.Euler();

export const objects: CSS3DObject[] = [];
export const targets = {
  table: [] as THREE.Object3D[],
  sphere: [] as THREE.Object3D[],
  helix: [] as THREE.Object3D[],
  grid: [] as THREE.Object3D[]
};

const screenWidth = window.innerWidth;
const columns = 12;

const cardRegistry = new Map<number, {
  object: CSS3DObject,
  container: HTMLDivElement
}>();

export function init(tweenGroup: Group) {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1500;
  initialCameraPosition.copy(camera.position);
  initialCameraRotation.copy(camera.rotation);
  scene = new THREE.Scene();

  fetch(`${import.meta.env.BASE_URL}python/scratch_cards.json`)
    .then((res) => res.json())
    .then((allCards: { id: number; isWinner: boolean }[]) => {
      const numberToLoad = 120;
      const shuffled = allCards.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, numberToLoad);

      selected.forEach((card, index) => {
        createScratchCard(card.id, card.isWinner, index, tweenGroup);
      });

      generateOtherLayouts(objects);
      transform(targets.table, 3000, objects, tweenGroup, render);
    });

  renderer = new CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  const containerElem = document.getElementById('container');
  if (containerElem) {
    containerElem.appendChild(renderer.domElement);
  } else {
    document.body.appendChild(renderer.domElement);
  }

  controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;

  const tableButton = document.getElementById('table');
  const sphereButton = document.getElementById('sphere');
  const helixButton = document.getElementById('helix');
  const gridButton = document.getElementById('grid');
  if (tableButton) tableButton.addEventListener('click', () => transform(targets.table, 3000, objects, tweenGroup, render));
  if (sphereButton) sphereButton.addEventListener('click', () => transform(targets.sphere, 3000, objects, tweenGroup, render));
  if (helixButton) helixButton.addEventListener('click', () => transform(targets.helix, 3000, objects, tweenGroup, render));
  if (gridButton) gridButton.addEventListener('click', () => transform(targets.grid, 3000, objects, tweenGroup, render));

  window.addEventListener('resize', onWindowResize);
}

function createScratchCard(id: number, isWinner: boolean, index: number, tweenGroup: Group) {
  const mainContainer = document.createElement('div');
  mainContainer.className = 'mainContainer';
  mainContainer.style.backgroundColor = `rgba(0,127,127,${Math.random() * 0.5 + 0.25})`;
  mainContainer.style.width = '10%';

  const resetButton = document.createElement('button');
  resetButton.textContent = 'RESET';
  resetButton.style.display = 'none';
  
  const messageParagraph = document.createElement('p');
  messageParagraph.className = 'scratchMessage';

  resetButton.addEventListener('click', () => {
    resetSceneOld(camera, controls, tweenGroup, objects, initialCameraPosition, initialCameraRotation);
    messageParagraph.textContent = '💰 Może coś tu jest!';
  });
  mainContainer.appendChild(resetButton);

  messageParagraph.textContent = isWinner ? '💰 1.000.000 PEPU' : '🤞 Może się uda!';
  mainContainer.appendChild(messageParagraph);

  const squareScratch = document.createElement('div');
  squareScratch.className = 'squareScratch';
  for (let j = 0; j < 9; j++) {
    const scratchContainer = document.createElement('div');
    scratchContainer.className = 'scratchContainer';
    const symbolCanvas = document.createElement('canvas');
    symbolCanvas.className = 'symbolCanvas';
    symbolCanvas.width = 10;
    symbolCanvas.height = 10;
    scratchContainer.appendChild(symbolCanvas);
    const scratchCanvas = document.createElement('canvas');
    scratchCanvas.className = 'scratchCanvas';
    scratchContainer.appendChild(scratchCanvas);
    squareScratch.appendChild(scratchContainer);
  }
  mainContainer.appendChild(squareScratch);

  const claimButton = document.createElement('button');
  claimButton.textContent = 'Scratch Card Now!';
  claimButton.disabled = true;
  mainContainer.appendChild(claimButton);

  function enableClaimButtonWhenReady() {
    const handleBuy = (window as any).handleBuy;
    if (typeof handleBuy === 'function') {
      claimButton.disabled = false;
      claimButton.addEventListener('click', async () => {
        handleBuy(
          id,
          () => {
            messageParagraph.textContent = `✅ Zdrapka #${id} kupiona!`;
            cloneScratchCardMini(mainContainer, id);
            resetSceneOld(camera, controls, tweenGroup, objects, initialCameraPosition, initialCameraRotation);
            removeCardFromScene(id);
          },
          () => {
            messageParagraph.textContent = `❌ Zakup anulowany lub nieudany.`;
          }
        );
      });
    } else {
      setTimeout(() => enableClaimButtonWhenReady(), 300);
    }
  }
  enableClaimButtonWhenReady();

  const objectCSS = new CSS3DObject(mainContainer);
  objectCSS.position.x = Math.random() * 4000 - 2000;
  objectCSS.position.y = Math.random() * 4000 - 2000;
  objectCSS.position.z = Math.random() * 4000 - 2000;
  scene.add(objectCSS);
  objects.push(objectCSS);

  cardRegistry.set(id, {
    object: objectCSS,
    container: mainContainer
  });

  const objectTarget = new THREE.Object3D();
  const row = Math.floor(index / columns);
  const col = index % columns;
  const containerWidth = screenWidth * 0.1;
  const separationX = containerWidth * 1.2;
  const separationY = 350;
  const offsetX = (columns - 1) * separationX / 2;
  const offsetY = (Math.ceil(objects.length / columns) - 1) * separationY / 2 + 600;

  objectTarget.position.x = col * separationX - offsetX;
  objectTarget.position.y = -row * separationY + offsetY;
  objectTarget.position.z = 0;

  targets.table.push(objectTarget);

  mainContainer.addEventListener('mousedown', () => {
    moveToCenter(objectCSS, camera, controls, tweenGroup, objects, focusOnObject);
  });
}

export function removeCardFromScene(id: number) {
  const entry = cardRegistry.get(id);
  if (!entry) return;

  scene.remove(entry.object);
  const index = objects.indexOf(entry.object);
  if (index !== -1) objects.splice(index, 1);
  cardRegistry.delete(id);
  render();
}

export function cloneScratchCardMini(originalContainer: HTMLDivElement, cardId: number) {
  const container = document.getElementById('carousel-inner');
  if (!container) return;
  myScratchCards.push({ id: cardId, isWinner: true, claimed: false });
  //const nextIndex = 2;// policz ile już jest kart
  const clone = originalContainer.cloneNode(true) as HTMLDivElement;
  clone.style.removeProperty('transform');
  clone.style.removeProperty('width');

  // clone.style.width = "100%";
  // clone.style.scale="0.3";
  // clone.style.top="50%";
  // clone.style.left="50%";
  // clone.className = 'card'; // Ustaw, że to ma być .card!
  // clone.classList.add('mainContainer', 'active', 'miniCard');
   
 clone.classList.add('miniCard');
 
  // clone.style.transformOrigin = "center center";
  // clone.style.marginBottom = "0px"; // w karuzeli nie potrzebujesz marginesu
  // clone.style.cursor = "pointer";
  // clone.style.transform = `translate(-50%, -50%) rotateY(calc(var(--i) * 72deg)) rotateX(-7deg) translateZ(150px)`;
 
  
  // clone.textContent = `Zdrapka #${cardId}`; // dla przykładu, możesz mieć co chcesz
  // clone.style.removeProperty('transform'); // CSS ustawi na podstawie --i
  // clone.style.removeProperty('top');
  // clone.style.removeProperty('left');
  // clone.style.removeProperty('position');
  // clone.style.removeProperty('scale');
  
  
  container.appendChild(clone);

    // Dynamiczna aktualizacja całej karuzeli:
    updateCarouselLayout();

  // Aktualizuj indeksy i układ po dodaniu
  updateCardIndices();
  updateRotation();
}

//------------foo-----------
function updateCarouselLayout() {
  const container = document.getElementById('carousel-inner');
  if (!container) return;

  const cards = container.querySelectorAll<HTMLElement>('.miniCard');
  const count = cards.length;
  const angleStep = 360 / count;
  const minRadius = 300;
  const baseSpacing = 30;
  const radius = Math.max(minRadius, (baseSpacing * count) / (2 * Math.PI));

  cards.forEach((card, i) => {
    const angle = i * angleStep;
    card.style.transform = `rotateY(${angle}deg) rotateX(-7deg) translateZ(${radius}px)`;
  });
}
//--------------

function generateOtherLayouts(objects: CSS3DObject[]) {
  const vector = new THREE.Vector3();
  targets.sphere = [];
  targets.helix = [];
  targets.grid = [];

  for (let i = 0, l = objects.length; i < l; i++) {
    // Sphere
    const phi = Math.acos(-1 + (2 * i) / l);
    const theta = Math.sqrt(l * Math.PI) * phi;
    const objectSphere = new THREE.Object3D();
    objectSphere.position.x = 800 * Math.cos(theta) * Math.sin(phi);
    objectSphere.position.y = 800 * Math.sin(theta) * Math.sin(phi);
    objectSphere.position.z = 800 * Math.cos(phi);
    vector.copy(objectSphere.position).multiplyScalar(2);
    objectSphere.lookAt(vector);
    targets.sphere.push(objectSphere);

    // Helix
    const phiH = i * 0.175 + Math.PI;
    const objectHelix = new THREE.Object3D();
    objectHelix.position.x = 900 * Math.sin(phiH);
    objectHelix.position.y = -(i * 8) + 450;
    objectHelix.position.z = 900 * Math.cos(phiH);
    vector.set(objectHelix.position.x * 2, objectHelix.position.y, objectHelix.position.z * 2);
    objectHelix.lookAt(vector);
    targets.helix.push(objectHelix);

    // Grid
    const objectGrid = new THREE.Object3D();
    objectGrid.position.x = ((i % 5) * 400) - 800;
    objectGrid.position.y = (-(Math.floor(i / 5) % 5) * 400) + 800;
    objectGrid.position.z = (Math.floor(i / 25)) * 1000 - 2000;
    targets.grid.push(objectGrid);
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}