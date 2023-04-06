<script lang="tsx">
import { Ref, defineComponent, ref, toRefs, watch } from "vue";
import { getImageRect } from "./utils";

export interface State {
  (): {
    scale: number;
    rotate: number;
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

import { useMousePressed, useMouseInElement, useCssVar } from "@vueuse/core";

export default defineComponent({
  name: "Viewer",
  props: {
    url: {
      type: String,
      default: undefined,
    },
    mode: {
      type: String,
      default: "viewer", // or copper
    },
  },
  setup(props, { expose }) {
    const { url, mode } = toRefs(props);

    const viewerRef = ref<HTMLDivElement | null>(null);
    const imageRef = ref<HTMLImageElement | null>(null);

    // 使用unocss的cssVar
    const ux = useCssVar("--un-translate-x", imageRef);
    const uy = useCssVar("--un-translate-y", imageRef);
    const sy = useCssVar("--un-scale-y", imageRef);
    const sx = useCssVar("--un-scale-x", imageRef);
    const r = useCssVar("--un-rotate", imageRef);

    let _ux = 0;
    let _uy = 0;
    let _sx = 1;
    let _r = 0;

    const { pressed } = useMousePressed({ target: viewerRef });
    const { x, y, isOutside } = useMouseInElement(viewerRef);

    let lastMouseX = x.value;
    let lastMouseY = y.value;

    let initialScale = 1;

    const setInitialScale = (n: number) => {
      return props.mode === "copper" ? n : n * 0.8;
    };

    const getMinScale = () => {
      return props.mode === "copper" ? initialScale : initialScale * 0.2;
    };

    const createInitialScale = async () => {
      const { width, height } = await getImageRect(props.url!);
      const { clientHeight, clientWidth } = viewerRef.value!;

      const scale = setInitialScale(
        Math.min(clientWidth / width, clientHeight / height)
      );

      return scale;
    };

    const transition = ref(0);

    const handleMousedown = (e: MouseEvent) => {
      transition.value = 0;
      e.preventDefault();
      lastMouseX = x.value;
      lastMouseY = y.value;
    };

    const handleWheel = (e: WheelEvent) => {
      transition.value = 0;
      e.preventDefault();

      const deltaY = e.deltaY / 1000;

      setScale(-deltaY);
    };

    const handleMouseup = (e: MouseEvent) => {
      e.preventDefault();
      transition.value = 0.5;
    };

    const handleMousemove = (x: number, y: number) => {
      if (isOutside.value) return;

      const deltaX = x - lastMouseX;
      const deltaY = y - lastMouseY;

      _ux += deltaX;
      _uy += deltaY;

      ux.value = `${_ux}px`;
      uy.value = `${_uy}px`;
      lastMouseX = x;
      lastMouseY = y;
    };

    const handleLoadImage = async () => {
      const scale = await createInitialScale();

      _sx = initialScale = scale;

      sx.value = sy.value = `${scale}`;
    };

    watch(
      () => [x.value, y.value, pressed.value],
      ([x, y, pressed]) => {
        if (pressed) {
          handleMousemove(x as number, y as number);
        }
      }
    );

    const setScale = (scale = 0.03) => {
      const minScale = getMinScale();

      _sx += scale;

      if (_sx <= minScale && scale < 0) {
        _sx = minScale;
      }

      sx.value = sy.value = _sx + "";
    };

    const setRotate = (rotate = 45) => {
      _r += rotate;
      r.value = `${_r}deg`;
    };

    const resetState = () => {
      transition.value = 0.5;

      sy.value = sx.value = initialScale + "";

      _sx = initialScale;

      _r = _uy = _ux = 0;

      uy.value = ux.value = `0px`;
    };

    const resetOffset = () => {
      transition.value = 0.5;
      _ux = 0;
      _uy = 0;
      ux.value = `0px`;
      uy.value = `0px`;
    };

    const getState = () => {
      return {
        scale: _sx,
        rotate: _r,
        x: _ux,
        y: _uy,
      };
    };

    watch(
      () => [isOutside.value, mode.value, pressed.value],
      async ([isOutside, mode, pressed]) => {
        if (
          (isOutside && mode === "viewer") ||
          (!pressed && mode === "viewer")
        ) {
          resetOffset();
        }
      }
    );

    expose({
      resetState,
      getState,
      setScale,
      setRotate,
      viewerRef,
      imageRef,
    });

    return () => (
      <div
        ref={viewerRef}
        class="w-full h-full flex flex-col justify-center items-center"
        onWheel={handleWheel}
        onMousedown={handleMousedown}
        onMouseup={handleMouseup}
      >
        <img
          ref={imageRef}
          src={url.value}
          class="transform cursor-move"
          style={{ transition: `${transition.value}s` }}
          onLoad={handleLoadImage}
        />
      </div>
    );
  },
});
</script>
