import { Group, Tween, Easing } from '@tweenjs/tween.js';
import * as THREE from 'three';
import type { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import type { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

// ===============================
// Move to center
// ===============================
export function moveToCenter(
  object: CSS3DObject,
  camera: THREE.PerspectiveCamera,
  controls: TrackballControls,
  tweenGroup: Group,
  objects: CSS3DObject[],
  focusOnObject: (obj: CSS3DObject, allObjects: CSS3DObject[]) => void
): CSS3DObject {
  const mainContainer = object.element as HTMLElement;
  mainContainer.classList.add('active');

  const targetPosition = object.position.clone();
  const normal = new THREE.Vector3(0, 0, 1)
    .applyQuaternion(object.quaternion || new THREE.Quaternion())
    .normalize();
  const cameraPosition = targetPosition.clone().addScaledVector(normal, 200);

  camera.up.set(0, 1, 0);

  new Tween(camera.position, tweenGroup)
    .to(cameraPosition, 1000)
    .easing(Easing.Exponential.InOut)
    .start();

  new Tween(controls.target, tweenGroup)
    .to(targetPosition, 1000)
    .easing(Easing.Exponential.InOut)
    .onComplete(() => object.lookAt(camera.position))
    .start();

  for (const obj of objects) {
    const el = obj.element as HTMLElement;
    const btn = el.querySelector('button');
    if (btn) btn.style.display = obj === object ? 'block' : 'none';
  }

  controls.enabled = false;
  focusOnObject(object, objects);
  return object;
}

// ===============================
// Focus on selected object
// ===============================
export function focusOnObject(clickedObject: CSS3DObject, objects: CSS3DObject[]) {
  for (const obj of objects) {
    const el = obj.element as HTMLElement;

    if (obj !== clickedObject) {
      el.style.transition = 'all 0.5s ease';
      el.style.filter = 'blur(6px)';
      el.style.opacity = '0.2';
      el.style.pointerEvents = 'none';
    } else {
      el.style.filter = 'none';
      el.style.opacity = '1';
      el.style.pointerEvents = 'none';
    }
  }
}

// ===============================
// Reset scene (bez parametrów)
// ===============================
export function resetScene(
  camera: THREE.PerspectiveCamera,
  controls: TrackballControls,
  tweenGroup: Group,
  objects: CSS3DObject[],
  initialCameraPosition: THREE.Vector3,
  initialCameraRotation: THREE.Euler
) {
  new Tween(camera.position, tweenGroup)
    .to(initialCameraPosition, 1000)
    .easing(Easing.Exponential.InOut)
    .start();

  new Tween(camera.rotation, tweenGroup)
    .to({
      x: initialCameraRotation.x,
      y: initialCameraRotation.y,
      z: initialCameraRotation.z
    }, 1000)
    .easing(Easing.Exponential.InOut)
    .start();

  new Tween(controls.target, tweenGroup)
    .to({ x: 0, y: 0, z: 0 }, 1000)
    .easing(Easing.Exponential.InOut)
    .start();

  for (const obj of objects) {
    const el = obj.element as HTMLElement;
    el.classList.remove('active');

    const btn = el.querySelector('button');
    if (btn) btn.style.display = 'none';

    el.style.transition = 'all 0.5s ease';
    el.style.filter = 'none';
    el.style.opacity = '1';
    el.style.pointerEvents = 'auto';
  }

  controls.enabled = true;
  controls.reset();
}

// ===============================
// Move to easy center
// ===============================
export function moveToCenterEasy(
  camera: THREE.PerspectiveCamera,
  tweenGroup: Group
): void {
  new Tween(camera.position, tweenGroup)
    .to({ x: 0, y: 0, z: 200 }, 1000)
    .easing(Easing.Exponential.InOut)
    .start();
}

export function resetSceneOld(
  camera: THREE.PerspectiveCamera,
  controls: TrackballControls,
  tweenGroup: Group,
  objects: CSS3DObject[],
  initialCameraPosition: THREE.Vector3,
  initialCameraRotation: THREE.Euler
): void {
  // 🔄 Pozycja kamery
  new Tween(camera.position, tweenGroup)
    .to(initialCameraPosition, 1000)
    .easing(Easing.Exponential.InOut)
    .start();

  // 🔄 Rotacja kamery
  new Tween(camera.rotation, tweenGroup)
    .to({
      x: initialCameraRotation.x,
      y: initialCameraRotation.y,
      z: initialCameraRotation.z
    }, 1000)
    .easing(Easing.Exponential.InOut)
    .start();

  // 🔄 Cel kamery
  new Tween(controls.target, tweenGroup)
    .to({ x: 0, y: 0, z: 0 }, 1000)
    .easing(Easing.Exponential.InOut)
    .start();

  // 🔁 Ukryj przyciski i przywróć styl
  for (const obj of objects) {
    const el = obj.element as HTMLElement;
    el.classList.remove('active');

    const btn = el.querySelector('button');
    if (btn) btn.style.display = 'none';

    el.style.transition = 'all 0.5s ease';
    el.style.filter = 'none';
    el.style.opacity = '1';
    el.style.pointerEvents = 'auto';
  }

  // ♻️ Reset kontrolek
  controls.enabled = true;
  controls.reset();
}

export function adjustCameraForScreen( camera: THREE.PerspectiveCamera,) {
  const width = window.innerWidth;

  if (width >= 1200) {
    // Duże ekrany (np. monitor)
    camera.position.z = 1500;
  } else if (width >= 768) {
    // Tablety poziomo
    camera.position.z = 2500;
  } else {
    // Telefony – iPhone itd.
    camera.position.z = 3000;
  }
}
