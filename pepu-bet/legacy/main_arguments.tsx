import React from "react";
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import ReactDOM from "react-dom/client";


import {ThirdwebProvider} from "thirdweb/react";

import ConnectWallet from "./components/ConnectButton";


  import { init } from './scene/initScene';
//import { init, camera, scene, renderer, controls, objects, targets, initialCameraPosition, initialCameraRotation } from './scene/initScene';
import { resetSceneOld } from './scene/helpers';
import { Group } from "@tweenjs/tween.js";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient();
import { pepeUnchained } from "./constants/chains";

// Inicjalizacja tweenGroup
const tweenGroup = new Group();

// Setup reset button handler
function setupResetButton(
  camera: THREE.PerspectiveCamera,
  controls: TrackballControls,
  tweenGroup: Group,
  objects: any[],
  initialCameraPosition: THREE.Vector3,
  initialCameraRotation: THREE.Euler
) {
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetSceneOld(camera, controls, tweenGroup, objects, initialCameraPosition, initialCameraRotation);
    });
  }
}


// Funkcja animate() – główna pętla renderowania/animacji
// function animate() {
//   requestAnimationFrame(animate);
//   tweenGroup.update();
//   controls.update();
//   render();
// }
function animate(
  controls: TrackballControls,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: CSS3DRenderer
) {
  requestAnimationFrame(() => animate(controls, scene, camera, renderer));
  tweenGroup.update();
  controls.update();
  render(scene, camera, renderer);
}


// Funkcja render() – renderuje scenę przy użyciu kamery
// export function render(): void {
//   renderer.render(scene, camera);
// }
 function render(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer:CSS3DRenderer): void {
  renderer.render(scene, camera);
}


// Inicjalizacja aplikacji

//init(tweenGroup); // ← przekaż tweenGroup do środka
const {
  scene,
  camera,
  renderer,
  controls,
  objects,
  targets,
  initialCameraPosition,
  initialCameraRotation
} = init(tweenGroup, render); // ← przekaż render do init

//setupResetButton();
setupResetButton(camera, controls, tweenGroup, objects, initialCameraPosition, initialCameraRotation);

//animate();
animate(controls, scene, camera, renderer);

// declare global {
//   interface Window {
//     __walletRoot__: ReactDOM.Root | undefined;
//   }
// }

// const walletRoot = document.getElementById("wallet-button-root");

// if (walletRoot) {
//   if (!window.__walletRoot__) {
//     window.__walletRoot__ = ReactDOM.createRoot(walletRoot);
//   }

//   window.__walletRoot__.render(
//     <React.StrictMode>
//       <ConnectWallet />
//     </React.StrictMode>
//   );
// }

// React Wallet UI

 const walletRoot = document.getElementById("wallet-button-root");

if (walletRoot) {
  ReactDOM.createRoot(walletRoot).render(
    <React.StrictMode>
  

      {/* v5 provider */}
     
        <ConnectWallet />
     
    </React.StrictMode>
  );
}



