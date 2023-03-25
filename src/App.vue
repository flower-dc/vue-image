<script setup lang="ts">
import { NAvatar, NButton } from "naive-ui";
import { ref } from "vue";

import CopperModal, { ICopperState } from "./components/CopperModal.vue";
import ImageViewer from "./components/ImageViewer/index.vue";
import Avatar from "./assets//images/avatar.jpg";

const avatar = ref(Avatar);

const copperModalRef = ref<ICopperState | null>(null);

const handleCopped = ({ blob, res }: { blob: Blob | null; res: string }) => {
  avatar.value = res;
};
</script>

<template>
  <div flex="~" items="~ center" justify="~ center">
    <ImageViewer :urls="avatar">
      <n-avatar :size="68" :src="avatar" />
    </ImageViewer>

    <n-button type="primary" class="ml-40" @click="() => copperModalRef!.open()"
      >修改头像</n-button
    >
    <CopperModal ref="copperModalRef" @copped="handleCopped" />
  </div>
</template>
