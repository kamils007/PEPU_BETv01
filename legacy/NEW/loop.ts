import * as THREE from 'three';
import { Group } from '@tweenjs/tween.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

interface Scenes {
  webglScene: THREE.Scene;
  cssScene: THREE.Scene;
  cssRenderer: CSS3DRenderer;
}

type GetMovingFn = () => boolean;

export function startLoop(
  renderer: THREE.WebGLRenderer,
  scenes: Scenes,
  camera: THREE.Camera,
  mixer: THREE.AnimationMixer,
  soldierMesh: THREE.Object3D,
  getMoving: GetMovingFn,
  tweenGroup: Group
) {
  const clock = new THREE.Clock();

  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);
    if (tweenGroup) tweenGroup.update();

    if (getMoving()) {
      soldierMesh.position.z -= 1 * delta * 60;
    }

    renderer.render(scenes.webglScene, camera);
    scenes.cssRenderer.render(scenes.cssScene, camera);
  });
}
