<script lang="tsx">
import { toRefs, ref, computed, defineComponent, PropType } from "vue";
import { ArrowBackCircle, Close } from "@vicons/ionicons5";
import { NIcon } from "naive-ui";

import Viewer from "./components/Viewer.vue";
import Toolbar from "./components/Toolbar.vue";

export default defineComponent({
  name: "ImageViewer",
  props: {
    urls: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const { urls } = toRefs(props);

    const visible = ref(false);

    const viewerRef = ref<IImageViewerState | null>(null);

    const currentIndex = ref(0);

    const images = computed(() => {
      if (Array.isArray(urls.value)) {
        return urls.value;
      } else if (typeof urls.value === "string") {
        return [urls.value];
      } else {
        return [];
      }
    });

    const isMultiple = computed(() => images.value.length > 1);

    const currentImage = computed(() => images.value[currentIndex.value]);

    const setVisible = () => {
      if (!currentImage.value) return;
      visible.value = !visible.value;
      if (!visible.value) {
        viewerRef.value?.resetState();
      }
    };

    const next = (n = 1) => {
      viewerRef.value?.resetState();

      if (currentIndex.value >= images.value.length - 1 && n > 0)
        return (currentIndex.value = 0);

      if (currentIndex.value <= 0 && n < 0)
        return (currentIndex.value = images.value.length - 1);

      currentIndex.value += n;
    };

    return () => (
      <>
        {visible.value && (
          <div class="image-viewer">
            <Viewer url={currentImage.value} ref={viewerRef} />
            <NIcon size={40} class="image-viewer__close" onClick={setVisible}>
              <Close />
            </NIcon>

            <div class="image-viewer__toolbar">
              <Toolbar
                onReset={() => viewerRef.value?.resetState()}
                onScaleDec={() => viewerRef.value?.setScale(-0.03)}
                onScaleInc={() => viewerRef.value?.setScale(0.03)}
                onRotateForward={() => viewerRef.value?.setRotate(90)}
                onRotateNegative={() => viewerRef.value?.setRotate(-90)}
              />
            </div>

            {isMultiple.value && (
              <>
                <NIcon
                  size={40}
                  class="image-viewer__stepper_left cursor-pointer"
                  onClick={() => next(-1)}
                >
                  <ArrowBackCircle />
                </NIcon>

                <NIcon
                  size={40}
                  class="image-viewer__stepper_right cursor-pointer"
                  onClick={() => next(1)}
                >
                  <ArrowBackCircle />
                </NIcon>
              </>
            )}
          </div>
        )}
        <div onClick={setVisible}>{slots?.default?.()}</div>
      </>
    );
  },
});
</script>
<style lang="scss" scoped>
.image-viewer {
  @apply h-screen w-screen fixed top-0 left-0 bottom-0 z-2999;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);

  &__close {
    @apply absolute top-0 right-0 m-20 cursor-pointer transition hover:rotate-90;
  }

  &__toolbar {
    @apply absolute bottom-20 left-1/2 -translate-x-1/2 px-20 py-10 rounded-[25px]  bg-[rgba(123,123,123,0.5)];
  }

  &__stepper_left,
  &__stepper_right {
    @apply absolute top-1/2 transform;
  }
  &__stepper_left {
    @apply left-0;
  }
  &__stepper_right {
    @apply right-0 rotate-180;
  }
}
</style>
