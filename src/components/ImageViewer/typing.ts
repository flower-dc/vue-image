import { Ref } from "vue";

export interface State {
  (): {
    scale: number;
    x: number;
    y: number;
  };
}

export interface ViewerState {
  resetState: () => void;
  getState: State;
  setScale: (scale?: number) => void;
  setRotate: (rotate?: number) => void;
  viewerRef: Ref<HTMLDivElement>;
  imageRef: Ref<HTMLImageElement>;
}
