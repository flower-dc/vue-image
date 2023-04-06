<script lang="tsx">
import { defineComponent, toRefs, ref } from "vue";
import { canvas2Blob, loadImage } from "./utils";

import Viewer from "~/components/ImageViewer/src/components/Viewer.vue";
import Toolbar from "~/components/ImageViewer/src/components/Toolbar.vue";

export default defineComponent({
  name: "ImageCopper",
  props: {
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 200,
    },
    url: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { expose }) {
    const { width, height, url } = toRefs(props);

    const viewerRef = ref<IImageViewerState | null>(null);

    const getImageData = async () => {
      const image = await loadImage(url.value!);
      const { scale, x, y, rotate } = viewerRef.value!.getState();

      const dWidth = image.width * scale;
      const dHeight = image.height * scale;

      const dx = x - (dWidth - width.value) / 2;
      const dy = y - (dHeight - height.value) / 2;

      const canvas = document.createElement("canvas");

      canvas.width = width.value;
      canvas.height = height.value;

      const ctx = canvas.getContext("2d")!;

      const halfWidth = width.value / 2;
      const halfHeight = height.value / 2;

      ctx.translate(halfWidth, halfHeight);

      ctx.rotate((rotate * Math.PI) / 180);

      ctx.drawImage(image, dx - halfWidth, dy - halfHeight, dWidth, dHeight);

      // 方法二
      // ctx.drawImage(
      //   image,
      //   image.width / 2 - width.value / scale / 2 - x / scale,
      //   image.height / 2 - height.value / scale / 2 - y / scale,
      //   canvas.width / scale,
      //   canvas.height / scale,
      //   0,
      //   0,
      //   canvas.width,
      //   canvas.height
      // );

      const res = canvas.toDataURL("image/png");

      const blob = await canvas2Blob(canvas);

      return { blob, res };
    };

    expose({ getImageData });

    return () => (
      <div class="copper">
        <div class="copper_bg">
          <div
            class="copper_bg_rect"
            style={{ height: `${height.value}px`, width: `${width.value}px` }}
          >
            <Viewer ref={viewerRef} url={url.value} mode="copper" />
          </div>
          <Toolbar
            onReset={() => viewerRef.value?.resetState()}
            onScaleDec={() => viewerRef.value?.setScale(-0.03)}
            onScaleInc={() => viewerRef.value?.setScale(0.03)}
            onRotateForward={() => viewerRef.value?.setRotate(90)}
            onRotateNegative={() => viewerRef.value?.setRotate(-90)}
          />
        </div>
      </div>
    );
  },
});
</script>
<style lang="scss" scoped>
.copper {
  @apply flex flex-col justify-center items-center;

  &_bg {
    @apply flex flex-col justify-center items-center py-10 w-full overflow-hidden;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC)
      repeat;

    &_rect {
      @apply border mb-10 border-4 border-dashed border-blue-400 overflow-hidden box-border;
      outline: 1200px solid rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
