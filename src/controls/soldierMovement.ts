import { AnimationAction } from 'three';

export function setupMovementHandlers(walkAction: AnimationAction, idleAction: AnimationAction) {
  let isMoving = false;

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'w' && !isMoving) {
      isMoving = true;
      idleAction.stop();
      walkAction.reset().play();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'w') {
      isMoving = false;
      walkAction.stop();
      idleAction.reset().play();
    }
  });

  return {
    getMoving: () => isMoving
  };
}
