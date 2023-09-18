<script setup lang="ts">
import { PropType, computed } from "vue";
import PercentCircle from "./PercentCircle.vue";
import { useCollection } from "../composables/pocketbase";
import { useRoute } from "vue-router";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps({
  logData: {
    type: Object as PropType<Record<string, FormDataEntryValue>[]>,
    required: true,
  },
});
const emit = defineEmits<{
  (e: 'abort'): void
}>()
const { params } = useRoute();
const { data } = useCollection<{ totalWeight: number }>(
  "TotalWeightPerDayView",
  {
    filter: `day="${params.planId}"`,
    sort: "-date",
  }
);

const weightSum = computed(() =>
  props.logData.map((l) => Number(l["weight"]) * Number(l["repetitions"])).reduce((a, b) => a + b, 0)
);

const repSum = computed(() =>
  props.logData.map((l) => Number(l["repetitions"])).reduce((a, b) => a + b, 0)
);

const targetRepsSum = computed(() =>
  props.logData.map((l) => Number(l["targetRep"])).reduce((a, b) => a + b, 0)
);

const lastWeightSum = computed(() => {
  if (data.value && data.value.length > 0) {
    const [{ totalWeight }] = data.value;
    return totalWeight;
  } else {
    return 0;
  }
});

const weightDiffPct = computed(() => {
  return (
    Math.abs(lastWeightSum.value - weightSum.value) /
    ((lastWeightSum.value + weightSum.value) * 0.5)
  );
});

const weightDirection = computed(() => {
  if (weightSum.value < lastWeightSum.value) {
    return "down" as const;
  } else if (weightSum.value > lastWeightSum.value) {
    return "up" as const;
  } else {
    return "same";
  }
});
</script>
<template>
  <div class="flex flex-col w-full h-full justify-around gap-4">
    <div>
      <h2 class="text-2xl text-center">Herzlichen Glückwunsch</h2>
    </div>
    <div class="flex-1 flex items-center">
      <div class="grid gap-4 grid-cols-2">
        <section class="flex flex-col items-center">
          <header>Wiederholungen</header>
          <div class="p-4">
            <PercentCircle show-value class="w-full h-full" foreground-circle-class="text-green-600"
              :percentage="repSum / targetRepsSum"></PercentCircle>
          </div>
          <span>{{ repSum }} / {{ targetRepsSum }}</span>
        </section>
        <section class="flex flex-col items-center">
          <header>Gewicht</header>
          <div class="flex flex-1 h-full items-center justify-center">
            <ChevronRightIcon v-if="weightDirection == 'same'" class="w-2/3 text-orange-600" />
            <ChevronUpIcon v-if="weightDirection == 'up'" class="w-2/3 text-green-600" />
            <ChevronDownIcon v-if="weightDirection == 'down'" class="w-2/3 text-red-600" />
          </div>
          <span>{{ weightSum }} (
            <small>
              <span v-if="weightDirection === 'up'">+</span>
              <span v-if="weightDirection === 'down'">-</span>
              {{ (weightDiffPct * 100).toFixed(1) }}%)
            </small></span>
        </section>
      </div>
    </div>
    <button class="px-4 py-2 rounded bg-green-500">
      Abschliessen und Speichern
    </button>
    <button @click.prevent="emit('abort')" class="underline text-green-600">
      Abbrechen
    </button>
  </div>
</template>
