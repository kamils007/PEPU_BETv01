
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three';


export async function initSoldier(scene: THREE.Scene, url: string) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);

  const modelSoldier = gltf.scene;
  modelSoldier.scale.set(50, 50, 50); // jeżeli model może być mały
  modelSoldier.position.set(0, -1000, 0); // startowa pozycja
  modelSoldier.rotation.x = Math.PI/2; // obrót o 180° – przodem do kamery
  modelSoldier.castShadow=true;
  scene.add(modelSoldier);

  const mixer = new THREE.AnimationMixer(modelSoldier);
  const walkAction = mixer.clipAction(gltf.animations[3]);
  const idleAction = mixer.clipAction(gltf.animations[0]);
  idleAction.play(); // domyślnie stoi

    return { soldierMesh: modelSoldier, mixer, walkAction, idleAction };
}
