declare module 'three/examples/jsm/renderers/CSS3DRenderer' {
  import { Object3D } from 'three';

  export class CSS3DObject extends Object3D {
    element: HTMLElement;
    constructor(element: HTMLElement);
  }

  export class CSS3DSprite extends CSS3DObject {}

  export class CSS3DRenderer {
    domElement: HTMLElement;
    constructor();
    setSize(width: number, height: number): void;
    render(scene: Object3D, camera: any): void;
  }
}

declare module 'three/examples/jsm/controls/TrackballControls' {
  import { Camera, Object3D } from 'three';

  export class TrackballControls {
    object: Camera;
    domElement: HTMLElement;

    enabled: boolean;
    target: Object3D['position'];
    rotateSpeed: number;
    zoomSpeed: number;
    panSpeed: number;

    constructor(object: Camera, domElement?: HTMLElement);
    update(): void;
    dispose(): void;
    handleResize(): void;
    /** 🔥 Dodaj to: */
    reset(): void;
  }
}
