<script lang="tsx">
export interface ICopper {
  getImageData: () => Promise<{
    blob: Blob | null;
    res: string;
  }>;
}
import { NButton, NIcon } from "naive-ui";
import { defineComponent, toRefs, ref } from "vue";
import { canvas2Blob, loadImage } from "./utils";
import { Add, Remove, Refresh } from "@vicons/ionicons5";

import Viewer, { ViewerState } from "../ImageViewer/Viewer.vue";

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

    const viewerRef = ref<ViewerState | null>(null);

    const getImageData = async () => {
      const image = await loadImage(url.value!);
      const { scale, x, y } = viewerRef.value!.getState();

      const dWidth = image.width * scale;
      const dHeight = image.height * scale;

      const dx = x - (dWidth - width.value) / 2;
      const dy = y - (dHeight - height.value) / 2;

      const canvas = document.createElement("canvas");

      canvas.width = width.value;
      canvas.height = height.value;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(image, dx, dy, dWidth, dHeight);

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
        </div>

        <div class="copper_toolbar">
          <NButton
            text
            class="text-[30px] leading-30"
            onClick={() => viewerRef.value?.setScale(-0.03)}
          >
            <NIcon class="text-[30px] leading-30">
              <Remove />
            </NIcon>
          </NButton>
          <NButton
            class="text-[30px] leading-30"
            text
            onClick={() => viewerRef.value?.setScale(0.03)}
          >
            <NIcon class="text-[30px] leading-30">
              <Add />
            </NIcon>
          </NButton>
          <NButton text onClick={() => viewerRef.value?.resetState()}>
            <NIcon class="text-[30px] leading-30">
              <Refresh />
            </NIcon>
          </NButton>
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
      @apply border border-4 border-dashed border-blue-400 overflow-hidden box-border;
      outline: 1200px solid rgba(0, 0, 0, 0.2);
    }
  }

  &_toolbar {
    @apply flex items-center mt-10;
  }
}
</style>
