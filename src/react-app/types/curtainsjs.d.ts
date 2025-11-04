declare module 'curtainsjs' {
  interface PlaneUniform {
    name: string;
    type: string;
    value: any;
  }

  interface PlaneParams {
    vertexShader: string;
    fragmentShader: string;
    widthSegments?: number;
    heightSegments?: number;
    uniforms?: Record<string, PlaneUniform>;
    crossOrigin?: string;
    transparent?: boolean;
  }

  interface CurtainsConfig {
    container?: HTMLElement | string;
    pixelRatio?: number;
    watchScroll?: boolean;
    autoRender?: boolean;
    premultipliedAlpha?: boolean;
  }

  export class Plane {
    constructor(renderer: Curtains, element: HTMLElement, params: PlaneParams);
    uniforms: Record<string, PlaneUniform>;
    onRender(callback: () => void): Plane;
    onReady(callback: () => void): Plane;
    remove(): void;
  }

  export class Curtains {
    constructor(config?: CurtainsConfig);
    onError(callback: () => void): Curtains;
    resize(triggerCallback?: boolean): void;
    dispose(): void;
  }
}
