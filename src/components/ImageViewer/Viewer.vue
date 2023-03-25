<script lang="tsx">
import { Ref, defineComponent, ref, toRefs, watch } from "vue";

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

    const viewerRef = ref(null);
    const imageRef = ref(null);

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

      if (deltaY > 0) {
        setScale(-0.1);
      } else {
        setScale(0.1);
      }
    };

    const handleMouseup = (e: MouseEvent) => {
      e.preventDefault();
      transition.value = 0.5;
    };

    const handleMousemove = () => {
      if (!pressed.value) return;
      const deltaX = x.value - lastMouseX;
      const deltaY = y.value - lastMouseY;

      _ux += deltaX;
      _uy += deltaY;

      ux.value = `${_ux}px`;
      uy.value = `${_uy}px`;
      lastMouseX = x.value;
      lastMouseY = y.value;
    };

    const setScale = (scale = 0.1) => {
      if (_sx <= 0.5 && scale < 0) return;
      // _sx = (_sx + scale).toFixed(1) * 1
      _sx += scale;
      sx.value = sy.value = _sx + "";
    };

    const setRotate = (rotate = 45) => {
      _r += rotate;
      r.value = `${_r}deg`;
    };

    const resetState = () => {
      sx.value = "1";
      sy.value = "1";
      _sx = 1;
      _ux = 0;
      _uy = 0;
      ux.value = `0px`;
      uy.value = `0px`;
    };

    const resetOffset = () => {
      _ux = 0;
      _uy = 0;
      ux.value = `0px`;
      uy.value = `0px`;
    };

    const getState = () => {
      return {
        scale: _sx,
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
          transition.value = 0.5;
          resetOffset();
        }
      },
      { immediate: true, deep: true }
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
        onMousemove={handleMousemove}
      >
        <img
          ref={imageRef}
          src={url.value}
          class="transform cursor-move"
          style={{ transition: `${transition.value}s` }}
        />
      </div>
    );
  },
});
</script>
