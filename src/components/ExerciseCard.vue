<script setup lang="ts">
import { PropType, computed, ref } from "vue";
import { ExerciseSet, Log } from "../model/ExerciseSet";
import PercentCircle from "./PercentCircle.vue";
import RelativeTime from "./RelativeTime.vue";
import {
  ArrowUpOnSquareStackIcon,
  DocumentDuplicateIcon,
} from "@heroicons/vue/24/outline";
import { usePagedCollection } from "../composables/pocketbase";

const props = defineProps({
  entry: { type: Object as PropType<ExerciseSet>, required: true },
});

defineExpose({
  scrollToMe() {
    ulRef.value?.scrollIntoView({ behavior: "smooth" });
  },
});

const ulRef = ref<HTMLElement>();

const { data: historyData } = usePagedCollection<Log>("Log", {
  filter: `exercise="${props.entry.expand.exercise.id}"`,
  sort: "-date,set",
  page: 1,
  perPage: props.entry.expand.sets.length,
});

const history = computed(() => {
  const obj =
    historyData?.value?.items.reduce((group, record) => {
      const groupKey = record.date.split(" ")[0];
      return { [groupKey]: [...(group[groupKey] ?? []), record] };
    }, {} as Record<string, Log[]>) ?? [];
  return Object.entries(obj).map(([date, logs]) => ({ date, logs }));
});

const selectOnFocus = (e: FocusEvent) => {
  if (e.target instanceof HTMLInputElement) {
    e.target.select()
  }
}

const applyToNextFreeFormSpot = (repetitions: number, weight: number) => {
  for (const row of Array.from(ulRef.value?.querySelectorAll('.input-row') ?? { length: 0 })) {
    const [repetitionsInput, weightInput] = [
      row.querySelector('input[name="repetitions"]') as HTMLInputElement,
      row.querySelector('input[name="weight"]') as HTMLInputElement,
    ]
    if (!repetitionsInput.value && !weightInput.value) {
      repetitionsInput.value = `${repetitions}`
      weightInput.value = `${weight}`
      ulRef.value?.closest('form')?.dispatchEvent(new Event('change'));
      break;
    }
  }
}

</script>
<template>
  <li ref="ulRef" class="snap-start h-full w-screen gap-4 transform transition-transform ease-in-out">
    <div class="p-4 h-full rounded bg-slate-900 flex flex-col gap-4">
      <div>
        <h2 class="text-2xl">{{ entry.expand.exercise.name }}</h2>
      </div>
      <table class="py-2">
        <thead>
          <tr class="text-xs font-normal">
            <th class="w-2 font-normal text-left capitalize">Set</th>
            <th class="w-[calc(5ch_+_2rem)] font-normal text-center capitalize">
              Wdh
            </th>
            <th class="w-[calc(8ch_+_2rem)] font-normal text-center capitalize">
              Gewicht
            </th>
            <th class="font-normal text-center capitalize">Notiz</th>
          </tr>
        </thead>
        <tbody class="first:rounded-t last:rounded-b overflow-hidden">
          <template v-for="set of entry.expand.sets" :key="set.id">
            <tr class="input-row">
              <td class="p-4 pl-0 text-left text-green-700 font-bold flex items-start">
                {{ set.set }}
                <input type="hidden" name="set" :value="set.set" />
                <input type="hidden" name="day" :value="entry.expand.day.id" />
                <input type="hidden" name="targetRep" :value="set.targetRep" />
                <input type="hidden" name="exercise" :value="entry.expand.exercise.id" />
              </td>
              <td>
                <label class="flex p-2 justify-end">
                  <input v-touched required name="repetitions" type="number" @focus="selectOnFocus($event)" inputmode="decimal" step="1"
                    :placeholder="'' + set.targetRep" />
                </label>
              </td>
              <td>
                <label class="flex p-2 justify-end">
                  <input v-touched required name="weight" type="number" inputmode="decimal" @focus="selectOnFocus($event)" step="0.01"
                    placeholder="0" />
                </label>
              </td>
              <td colspan="">
                <label class="flex p-2 justify-end">
                  <input name="comment" type="text" />
                </label>
              </td>
              <td class="hidden">
                <button class="p-2">
                  <DocumentDuplicateIcon class="w-4 h-4 text-slate-400" />
                </button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="flex-1">
        <ul v-for="group in history" class="flex flex-col gap-4" :key="group.date">
          <li class="text-center font-bold text-sm text-slate-500 flex">
            <relative-time :date="group.date" />
          </li>
          <li v-for="h in group.logs" :key="h.id" class="flex flex-col gap-2">
            <div class="flex items-center gap-4">
              <div class="w-[2ch]">{{ h.set }}</div>
              <PercentCircle :percentage="h.repetitions / h.targetRep" class="w-4 h-4"
                foregroundCircleClass="text-red-500" backgroundCircleClass="text-slate-300" :strokeWidth="5" />
              <div>{{ h.repetitions }} / {{ h.targetRep }}</div>
              <div class="flex-1 text-right">{{ h.weight }}kg</div>
              <div>
                <button @click.prevent="applyToNextFreeFormSpot(h.repetitions, h.weight)">
                  <ArrowUpOnSquareStackIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div v-if="h.comment"
              class=" text-center text-sm text-slate-500 italic before:content-[open-quote] after:content-[close-quote]">
              {{ h.comment }}</div>
          </li>
        </ul>
      </div>
    </div>
  </li>
</template>
<style>
input {
  @apply w-full box-border rounded bg-green-300/10 focus:outline-none flex-1 p-2;
}

input.touched {
  @apply invalid:ring-red-600 ring-offset-0 invalid:ring-2
}

input[type="number"] {
  @apply text-right;
}
</style>
