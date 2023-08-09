<script setup lang="ts">
import { onMounted, ref } from "vue";
defineProps({
  strokeWidth: { type: Number, default: 1 },
  foregroundCircleClass: { type: String, default: "" },
  backgroundCircleClass: { type: String, default: "" },
  percentage: { type: Number, required: true },
  showValue: { type: Boolean, default: false },
  transitionDuration: { type: Number, default: 300 }
});

const mounted = ref(false);
onMounted(() => {
  setTimeout(() => {
    mounted.value = true;
  }, 300);
});
</script>
<template>
  <div class="relative">
    <div class="absolute inset-0 flex justify-center items-center">
      <span v-if="showValue">{{ (percentage * 100).toFixed(0) }}%</span>
      <slot />
    </div>
    <svg viewBox="0 0 36 36" class="w-full h-full">
      <path d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" :class="backgroundCircleClass"
        :stroke-width="strokeWidth" />
      <path d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" class="transition-all"
        :class="[foregroundCircleClass, { 'percent-overlay': mounted }]" :stroke-width="strokeWidth"
        style="stroke-dasharray: var(--percent-circle-percent, 0), 100" />
    </svg>
  </div>
</template>
<style scoped>
.percent-overlay {
  --percent-circle-percent: v-bind(percentage * 100);
}

.transition-all {
  transition-duration: v-bind(transitionDuration + 'ms');
}
</style>
