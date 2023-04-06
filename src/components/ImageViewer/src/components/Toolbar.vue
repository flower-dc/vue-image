<script lang="tsx">
import { NButton, NIcon } from "naive-ui";
import { defineComponent, h } from "vue";
import { Remove, Refresh, Add } from "@vicons/ionicons5";

const RotateIcon = () =>
  h(
    "svg",
    {
      viewBox: "0 0 1024 1024",
      xmlns: "http://www.w3.org/2000/svg",
      width: "1em",
      height: "1em",
      fill: "currentColor",
    },
    [
      h("path", {
        d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 832c-212.1 0-384-171.9-384-384S299.9 128 512 128s384 171.9 384 384-171.9 384-384 384z",
      }),
      h("path", {
        d: "M512 256c-17.7 0-32 14.3-32 32v192H288c-17.7 0-32 14.3-32 32s14.3 32 32 32h192c17.7 0 32-14.3 32-32V288c0-17.7-14.3-32-32-32z",
      }),
    ]
  );

export default defineComponent({
  name: "ViewerToolbar",
  emits: ["scaleDec", "scaleInc", "rotateForward", "rotateNegative", "reset"],
  setup(props, { emit }) {
    return () => (
      <div class="copper_toolbar">
        <NButton
          text
          class="text-[30px] leading-30"
          onClick={() => emit("scaleDec")}
        >
          <NIcon class="text-[30px] leading-30">
            <Remove />
          </NIcon>
        </NButton>
        <NButton
          class="text-[30px] leading-30"
          text
          onClick={() => emit("scaleInc")}
        >
          <NIcon class="text-[30px] leading-30">
            <Add />
          </NIcon>
        </NButton>

        <NButton text onClick={() => emit("rotateNegative")}>
          <NIcon class="text-[30px] leading-30 transform ">
            <RotateIcon />
          </NIcon>
        </NButton>

        <NButton text onClick={() => emit("rotateForward")}>
          <NIcon class="text-[30px] leading-30 rotate-y-180">
            <RotateIcon />
          </NIcon>
        </NButton>
        <NButton text onClick={() => emit("reset")}>
          <NIcon class="text-[30px] leading-30">
            <Refresh />
          </NIcon>
        </NButton>
      </div>
    );
  },
});
</script>
<style lang="scss" scoped>
.copper_toolbar {
  @apply flex items-center;
}
</style>
