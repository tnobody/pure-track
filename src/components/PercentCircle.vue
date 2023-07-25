<script setup lang="ts">
import { onMounted, ref } from "vue";
defineProps({
  strokeWidth: { type: Number, default: 1 },
  foregroundCircleClass: { type: String, default: "" },
  backgroundCircleClass: { type: String, default: "" },
  percentage: { type: Number, required: true },
  showValue: { type: Boolean, default: false },
});

const mounted = ref(false);
onMounted(() => {
  setTimeout(() => {
    mounted.value = true;
  }, 300);
});
</script>
<template>
  <div :class="['relative']">
    <div
      v-if="showValue"
      class="absolute inset-0 flex justify-center items-center"
    >
      {{ (percentage * 100).toFixed(0) }}%
    </div>
    <svg viewBox="0 0 36 36" class="w-full h-full">
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="currentColor"
        :class="backgroundCircleClass"
        :stroke-width="strokeWidth"
      />
      <path
        d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="currentColor"
        class="transition-all duration-300 delay-300"
        :class="[foregroundCircleClass, { 'percent-overlay': mounted }]"
        :stroke-width="strokeWidth"
        style="stroke-dasharray: var(--percent-circle-percent, 0), 100"
      />
    </svg>
  </div>
</template>
<style scoped>
.percent-overlay {
  --percent-circle-percent: v-bind(percentage * 100);
}
</style>
