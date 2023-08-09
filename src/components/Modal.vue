<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    open: { type: Boolean, default: false },
    closeable: { type: Boolean, default: false }
})
const dialogRef = ref<HTMLDialogElement>();
const handleOpenState = (open: boolean) => {
    if (open) {
        dialogRef.value?.showModal();
    } else {
        dialogRef.value?.close();
    }
}
watch(() => props.open, (isOpen, wasOpen) => {
    if (isOpen != wasOpen) {
        handleOpenState(isOpen)
    }
})

onMounted(() => {
    handleOpenState(props.open);
})
</script>
<template>
    <dialog ref="dialogRef" class="z-20 bg-slate-900 rounded border text-slate-100 shadow-lg relative">
        <slot />
    </dialog>
</template>
<style scoped>
dialog::backdrop {
    @apply backdrop-blur bg-black/70;
}
</style>