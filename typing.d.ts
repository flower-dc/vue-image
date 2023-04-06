/// <reference types="vite/client" />

import { Ref } from "vue";

declare global {
  export interface IViewState {
    (): {
      scale: number;
      rotate: number;
      x: number;
      y: number;
    };
  }

  export interface IImageViewerState {
    resetState: () => void;
    getState: IViewState;
    setScale: (scale?: number) => void;
    setRotate: (rotate?: number) => void;
    viewerRef: Ref<HTMLDivElement>;
    imageRef: Ref<HTMLImageElement>;
  }

  export interface ICopper {
    getImageData: () => Promise<{
      blob: Blob | null;
      res: string;
    }>;
  }

  export interface ICopperState {
    open: () => void;
  }
}
