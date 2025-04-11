// transform.ts
import * as THREE from 'three';
import { Group, Tween, Easing } from '@tweenjs/tween.js';
import type { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

/**
 * Animuje przejście obiektów do wskazanego układu docelowego.
 * @param targetArray - Tablica docelowych obiektów 3D.
 * @param duration - Czas trwania animacji.
 * @param objects - Lista obiektów CSS3D do animacji.
 * @param tweenGroup - Grupa tweenów do animacji.
 * @param renderCallback - Funkcja renderująca scenę.
 */
export function transform(
  targetArray: THREE.Object3D[],
  duration: number,
  objects: CSS3DObject[],
  tweenGroup: Group,
  renderCallback: () => void
): void {
  tweenGroup.removeAll();

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const target = targetArray[i];

    const tweenPos = new Tween(object.position)
      .to({
        x: target.position.x,
        y: target.position.y,
        z: target.position.z
      }, Math.random() * duration + duration)
      .easing(Easing.Exponential.InOut);

    const tweenRot = new Tween(object.rotation)
      .to({
        x: target.rotation.x,
        y: target.rotation.y,
        z: target.rotation.z
      }, Math.random() * duration + duration)
      .easing(Easing.Exponential.InOut);

    tweenGroup.add(tweenPos);
    tweenGroup.add(tweenRot);
    tweenPos.start();
    tweenRot.start();
  }

  const tweenUpdate = new Tween({})
    .to({}, duration * 2)
    .onUpdate(renderCallback);

  tweenGroup.add(tweenUpdate);
  tweenUpdate.start();
}
