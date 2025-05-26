
import React from "react";
import ReactDOM from "react-dom/client";

import {ThirdwebProvider} from "thirdweb/react";

import ConnectWallet from "./components/ConnectButton";

//import { initMixedScene } from './scene/initMixedScene';


import { initMixedScene, camera, cssScene, webglScene, cssRenderer, webglRenderer, controls, objects, targets, initialCameraPosition, initialCameraRotation, mixer} from './scene/initScene';
import { resetSceneOld } from './scene/helpers';
import { Group } from "@tweenjs/tween.js";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as THREE from 'three';




const queryClient = new QueryClient();
//import { pepeUnchained } from "./constants/chains";

// Inicjalizacja tweenGroup
const tweenGroup = new Group();

// Setup reset button handler

function setupResetButton() {
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetSceneOld(camera, controls, tweenGroup, objects, initialCameraPosition, initialCameraRotation);
    });
  }
}

// Funkcja animate() – główna pętla renderowania/animacji
// Funkcja animate() – główna pętla renderowania/animacji
// const clock = new THREE.Clock();

// webglRenderer.setAnimationLoop(() => {
//   const delta = clock.getDelta();
//   if (mixer) mixer.update(delta);
//   tweenGroup.update();
//   controls.update();
//   render();
// });

// Funkcja render() – renderuje obie sceny przy użyciu tej samej kamery
export function render(): void {
  webglRenderer.render(webglScene, camera); // 🎮 modele 3D (GLTF, siatki itp.)
  cssRenderer.render(cssScene, camera);     // 🧩 HTML w przestrzeni 3D (zdrapki)
}




// Inicjalizacja aplikacji

//initMixedScene();
initMixedScene(tweenGroup); // ← przekaż tweenGroup do środka
setupResetButton();

//animate();

// // React Wallet UI

const walletRoot = document.getElementById("wallet-button-root");

if (walletRoot) {
  ReactDOM.createRoot(walletRoot).render(
    <React.StrictMode>
  

      {/* v5 provider */}
     <ThirdwebProvider>
        <ConnectWallet />
        </ThirdwebProvider>
    </React.StrictMode>
  );
}





