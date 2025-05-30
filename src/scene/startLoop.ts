import * as THREE from 'three';
import { Group } from '@tweenjs/tween.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { render } from '../main';

let moveSpeed = 1;

interface Scenes {
  webglScene: THREE.Scene;
  cssScene: THREE.Scene;
  cssRenderer: CSS3DRenderer;
}

type GetMovingFn = () => boolean;

export function startLoop(
  webglRenderer: THREE.WebGLRenderer,
  scenes: Scenes,
  camera: THREE.Camera,
  mixer: THREE.AnimationMixer,
  soldierMesh: THREE.Object3D,
  getMoving: GetMovingFn,
  tweenGroup: Group,
  controls: TrackballControls // 👈 dodaj to
) {
  const clock = new THREE.Clock();

  webglRenderer.setAnimationLoop(() => {
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);
    if (tweenGroup) tweenGroup.update();
      controls.update(); // 👈 to kluczowe

    if (getMoving()) {
    
      // przesuwa żołnierza wzdłuż osi y
    soldierMesh.position.y += moveSpeed * delta * 60;
    }

      render();

    // webglRenderer.render(scenes.webglScene, camera);
    // scenes.cssRenderer.render(scenes.cssScene, camera);
  });
}
