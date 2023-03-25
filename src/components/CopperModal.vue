<script lang="tsx">
export interface ICopperState {
  open: () => void;
}
import { NButton, NModal } from "naive-ui";
import { defineComponent, ref } from "vue";

import ImageCopper, { ICopper } from "~/components/ImageCopper/index.vue";

export default defineComponent({
  name: "CopperModal",
  emits: {
    copped: (data: { blob: Blob | null; res: string }) => data,
  },
  setup(props, { emit, expose }) {
    const visible = ref(false);
    const copperRef = ref<ICopper | null>(null);

    const origin = ref();

    const handleClose = () => {
      visible.value = false;
    };

    const handleCop = async () => {
      const { blob, res } = await copperRef.value!.getImageData();
      visible.value = false;
      emit("copped", { res, blob });
    };

    const open = async () => {
      await setImg();
      visible.value = true;
    };

    const selectImage = () => {
      return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e: Event) => {
          const file = (e.target as HTMLInputElement).files![0];
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target!.result);
          };
          reader.readAsDataURL(file);
        };
        input.click();
      });
    };

    const setImg = async () => {
      const img = await selectImage();
      origin.value = img;
    };

    const Footer = defineComponent({
      name: "ModalFooter",
      setup() {
        return () => (
          <div class="text-right">
            <NButton class="mr-10" onClick={handleClose}>
              关闭
            </NButton>
            <NButton type="primary" onClick={handleCop}>
              确认
            </NButton>
          </div>
        );
      },
    });

    expose({ open });

    return () => (
      <NModal
        show={visible.value}
        class="w-600"
        onUpdateShow={handleClose}
        title="图片剪裁"
        preset="card"
      >
        {{
          default: () => (
            <div>
              <NButton onClick={setImg} class="mb-10" type="primary">
                {origin.value ? "重新选择" : "选择图片"}
              </NButton>
              <ImageCopper url={origin.value} ref={copperRef} />
            </div>
          ),
          footer: () => <Footer />,
        }}
      </NModal>
    );
  },
});
</script>
