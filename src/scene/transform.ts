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

  let completed = 0;

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    const target = targetArray[i];

    const tweenDuration = Math.random() * duration + duration;

    let finishedTweens = 0;

    const onTweenFinished = () => {
      finishedTweens++;
      if (finishedTweens === 2) {
        completed++;
        if (completed === objects.length) {
          renderCallback(); // ✅ dopiero po WSZYSTKICH obiektach (position + rotation)
          
        }
      }
    };

    const tweenPos = new Tween(object.position)
      .to({
        x: target.position.x,
        y: target.position.y,
        z: target.position.z
      }, tweenDuration)
      .easing(Easing.Exponential.InOut)
      .onComplete(onTweenFinished);

    const tweenRot = new Tween(object.rotation)
      .to({
        x: target.rotation.x,
        y: target.rotation.y,
        z: target.rotation.z
      }, tweenDuration)
      .easing(Easing.Exponential.InOut)
      .onComplete(onTweenFinished);

    tweenGroup.add(tweenPos);
    tweenGroup.add(tweenRot);
    tweenPos.start();
    tweenRot.start();
  }
}
