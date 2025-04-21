
import React from "react";
import ReactDOM from "react-dom/client";

import {ThirdwebProvider} from "thirdweb/react";

import ConnectWallet from "./components/ConnectButton";

import { init, camera, scene, renderer, controls, objects, targets, initialCameraPosition, initialCameraRotation } from './scene/initScene';
import { resetSceneOld } from './scene/helpers';
import { Group } from "@tweenjs/tween.js";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


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
function animate() {
  requestAnimationFrame(animate);
  tweenGroup.update();
  controls.update();
  render();
}

// Funkcja render() – renderuje scenę przy użyciu kamery
export function render(): void {
  renderer.render(scene, camera);
}





// Inicjalizacja aplikacji

init(tweenGroup); // ← przekaż tweenGroup do środka
setupResetButton();
animate();

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





