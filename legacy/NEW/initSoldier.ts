
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three';


export async function initSoldier(scene: THREE.Scene, url: string) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);

  const model = gltf.scene;
  scene.add(model);

  const mixer = new THREE.AnimationMixer(model);
  const action = mixer.clipAction(gltf.animations[3]);
  action.play();

  return { soldierMesh: model, mixer, action };
}
