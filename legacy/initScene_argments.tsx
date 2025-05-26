import * as THREE from 'three';
import React from "react";
// @ts-ignore
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
// @ts-ignore

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { Group, Tween, Easing } from '@tweenjs/tween.js';

import { transform } from '../src/scene/transform';
import { moveToCenter, focusOnObject, resetSceneOld  } from '../src/scene/helpers';
import { table } from '../src/scene/scratch/scratchData';

//import { render } from '../main'; // lub poprawna ścieżka, np. '../main'

import { ThirdwebProvider as ThirdwebProviderV5 } from "thirdweb/react";

import BuyButton from "../src/components/BuyButton";  // ścieżka zależna od Twojej struktury

import ReactDOM from "react-dom/client";







//export let camera: THREE.PerspectiveCamera;
//export let scene: THREE.Scene;
//export let renderer: CSS3DRenderer;
//export let controls: TrackballControls;
//export let initialCameraPosition = new THREE.Vector3();
//export let initialCameraRotation = new THREE.Euler();

// Status zakupu i wygranej
let isBought = false;
let isWinner = false;

// export const objects: CSS3DObject[] = [];
// export const targets = {
//   table: [] as THREE.Object3D[],
//   sphere: [] as THREE.Object3D[],
//   helix: [] as THREE.Object3D[],
//   grid: [] as THREE.Object3D[]
// };

//const screenWidth = window.innerWidth;
//const tweenGroup = new Group();

export function init(tweenGroup: Group) {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1500;
  const scene = new THREE.Scene();
  const renderer = new CSS3DRenderer();
  const controls = new TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  const objects: CSS3DObject[] = [];
  const targets = {
    table: [] as THREE.Object3D[],
    sphere: [] as THREE.Object3D[],
    helix: [] as THREE.Object3D[],
    grid: [] as THREE.Object3D[]
  };
  const initialCameraPosition = camera.position.clone();
  const initialCameraRotation = camera.rotation.clone();
  const screenWidth = window.innerWidth;
  //initialCameraPosition.copy(camera.position);
  //initialCameraRotation.copy(camera.rotation);

  

  for (let i = 0, index = 0; i < table.length; i += 5, index++) {
    const mainContainer = document.createElement('div');
    mainContainer.className = 'mainContainer';
    mainContainer.style.backgroundColor = `rgba(0,127,127,${Math.random() * 0.5 + 0.25})`;
    mainContainer.style.width = "10%";

    const resetButton = document.createElement('button');
    resetButton.textContent = 'RESET';
    resetButton.style.display = 'none';
    //resetButton.addEventListener('click', () => resetScene());
    resetButton.addEventListener('click', () => {resetSceneOld(camera, controls, tweenGroup, objects, initialCameraPosition, initialCameraRotation) });
    mainContainer.appendChild(resetButton);

    const communicationArea = document.createElement('div');
    communicationArea.className = 'communicationArea';
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = 'Witaj!';
    communicationArea.appendChild(messageParagraph);
    mainContainer.appendChild(communicationArea);

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

    const symbol = document.createElement('div');
    symbol.className = 'symbol';
    symbol.textContent = table[i] as string;
    mainContainer.appendChild(symbol);

    const details = document.createElement('div');
    details.className = 'details';
    details.innerHTML = `${table[i + 1]}<br>${table[i + 2]}`;
    mainContainer.appendChild(details);

    const number = document.createElement('div');
    number.className = 'number';
    number.textContent = (index + 1).toString();
    mainContainer.appendChild(number);

//   // Przycisk "Buy Scratch"
// const buyButtonRoot = document.createElement("div");
// ReactDOM.createRoot(buyButtonRoot).render(
//   <React.StrictMode>
//     <ThirdwebProviderV5>
//       <BuyButton />
//     </ThirdwebProviderV5>
//   </React.StrictMode>
// );

//mainContainer.appendChild(buyButtonRoot);

// Przycisk "Claim Reward"
const claimButton = document.createElement('button');
claimButton.textContent = 'Claim Reward';
claimButton.style.display = 'none';
claimButton.addEventListener('click', () => {
  console.log('Reward claimed!');
  messageParagraph.textContent = 'Reward claimed! 🎉';
  claimButton.disabled = true;
});
mainContainer.appendChild(claimButton);

    const objectCSS = new CSS3DObject(mainContainer);
    objectCSS.position.x = Math.random() * 4000 - 2000;
    objectCSS.position.y = Math.random() * 4000 - 2000;
    objectCSS.position.z = Math.random() * 4000 - 2000;
    scene.add(objectCSS);
    objects.push(objectCSS);

    const objectTarget = new THREE.Object3D();
    const columns = 12;
    const row = Math.floor(index / columns);
    const col = index % columns;
    const containerWidth = screenWidth * 0.1;
    const separationX = containerWidth * 1.2;
    const separationY = 300;
    const offsetX = (columns - 1) * separationX / 2;
    const offsetY = (Math.ceil(objects.length / columns) - 1) * separationY / 2 + 500;

    objectTarget.position.x = col * separationX - offsetX;
    objectTarget.position.y = -row * separationY + offsetY;
    objectTarget.position.z = 0;

    targets.table.push(objectTarget);

    mainContainer.addEventListener('mousedown', () => {
      moveToCenter(objectCSS, camera, controls, tweenGroup, objects, focusOnObject);
    });
  }

  const vector = new THREE.Vector3();
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
  }

  for (let i = 0, l = objects.length; i < l; i++) {
    const phi = i * 0.175 + Math.PI;
    const objectHelix = new THREE.Object3D();
    objectHelix.position.x = 900 * Math.sin(phi);
    objectHelix.position.y = -(i * 8) + 450;
    objectHelix.position.z = 900 * Math.cos(phi);
    vector.set(objectHelix.position.x * 2, objectHelix.position.y, objectHelix.position.z * 2);
    objectHelix.lookAt(vector);
    targets.helix.push(objectHelix);
  }

  for (let i = 0; i < objects.length; i++) {
    const objectGrid = new THREE.Object3D();
    objectGrid.position.x = ((i % 5) * 400) - 800;
    objectGrid.position.y = (-(Math.floor(i / 5) % 5) * 400) + 800;
    objectGrid.position.z = (Math.floor(i / 25)) * 1000 - 2000;
    targets.grid.push(objectGrid);
  }

  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  const containerElem = document.getElementById('container');
  if (containerElem) {
    containerElem.appendChild(renderer.domElement);
  } else {
    document.body.appendChild(renderer.domElement);
  }

  //controls = new TrackballControls(camera, renderer.domElement);
  //controls.rotateSpeed = 0.5;

  const tableButton = document.getElementById('table');
  const sphereButton = document.getElementById('sphere');
  const helixButton = document.getElementById('helix');
  const gridButton = document.getElementById('grid');

  if (tableButton) {tableButton.addEventListener('click', () =>transform(targets.sphere, 3000, objects, tweenGroup, renderFn))};
  if (sphereButton) {sphereButton.addEventListener('click', () =>transform(targets.sphere, 3000, objects, tweenGroup, renderFn))};
  if (helixButton) {helixButton.addEventListener('click', () => transform(targets.sphere, 3000, objects, tweenGroup, renderFn))};
  if (gridButton) {gridButton.addEventListener('click', () => transform(targets.sphere, 3000, objects, tweenGroup, renderFn))};

  
  //transform(targets.table, 3000, objects, tweenGroup, render);
   transform(targets.sphere, 3000, objects, tweenGroup, renderFn);
   window.addEventListener("resize", () => onWindowResize(camera, renderer));

  return {
    scene,
    camera,
    renderer,
    controls,
    objects,
    targets,
    initialCameraPosition,
    initialCameraRotation
  };

}

function resetScene() {
  console.log('resetScene placeholder');
}

function onWindowResize(camera: THREE.PerspectiveCamera, renderer: CSS3DRenderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}





