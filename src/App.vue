<script setup lang="ts">
import { NAvatar, NButton } from "naive-ui";
import { ref } from "vue";

import CopperModal, { ICopperState } from "./components/CopperModal.vue";

const avatar = ref();

const copperModalRef = ref<ICopperState | null>(null);

const handleCopped = ({ blob, res }: { blob: Blob | null; res: string }) => {
  avatar.value = res;
};
</script>

<template>
  <div>
    <ImageViewer :urls="avatar">
      <n-avatar round :size="78" :src="avatar" />
    </ImageViewer>

    <n-button type="primary" class="ml-40" @click="() => copperModalRef!.open()"
      >修改头像</n-button
    >
    <CopperModal ref="copperModalRef" @copped="handleCopped" />
  </div>
</template>
