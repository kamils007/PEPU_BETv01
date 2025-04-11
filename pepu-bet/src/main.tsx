import React from "react";
import ReactDOM from "react-dom/client";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import WalletButton from "./WalletButton";

import { init, camera, scene, renderer, controls, objects, targets, initialCameraPosition, initialCameraRotation } from './scene/initScene';
import { resetSceneOld } from './scene/helpers';
import { Group } from "@tweenjs/tween.js";

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

// React Wallet UI
const walletRoot = document.getElementById("wallet-button-root");
if (walletRoot) {
  ReactDOM.createRoot(walletRoot).render(
    <React.StrictMode>
      <ThirdwebProvider
        activeChain="sepolia"
        clientId="CnXawaLYJxbQ6k193U510uSCkYdDaKdt1O3EDspSDgKsWW_pBvTA3IgTygxC-HAagcuppltr6RQdz_7iLte2KQ"
      >
        <WalletButton />
      </ThirdwebProvider>
    </React.StrictMode>
  );
}
