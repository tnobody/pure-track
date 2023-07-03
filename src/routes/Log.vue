<script lang="ts" setup>
import { useRoute } from "vue-router";
import { usePocketbase } from "../composables/pocketbase";
import { waitForScrollEnd } from "../composables/useScrollEnd";
import { useAsyncState } from "@vueuse/core";
import { ref } from "vue";

type ExerciseSet = {
  id: string;
  set: number;
  targetRep: number;
  expand: {
    exercise: {
      name: string;
    };
    sets: Array<{
      id: string;
      set: number;
      targetRep: number;
    }>;
  };
};

const { params } = useRoute();

const pb = usePocketbase();

const { state } = useAsyncState(
  () =>
    pb.collection("DayExercise").getFullList<ExerciseSet>({
      filter: `day="${params.planId}"`,
      sort: "order",
      expand: "exercise,sets",
    }),
  []
);

const index = ref(0);
const scrollContainerRef = ref<HTMLElement>();
const cardElementRefs = ref<HTMLElement[]>([]);
const goto = async (i: number) => {
  if (!scrollContainerRef.value) return;
  scrollContainerRef.value.style.overflow = "auto";
  const p = waitForScrollEnd(scrollContainerRef.value);
  cardElementRefs.value[i]?.scrollIntoView({ behavior: "smooth" });
  index.value = i;
  await p;
  scrollContainerRef.value.style.overflow = "";
};

const getIndex = (exIndex: number, setIndex: number) =>
  state.value
    .slice(0, exIndex)
    .map((e) => e.expand.sets.length)
    .reduce((a, b) => a + b, setIndex);
</script>
<template>
  <div class="flex flex-col h-full justify-center relative overflow-hidden">
    <ul
      ref="scrollContainerRef"
      class="overflow-hidden snap-y snap-mandatory max-h-full px-4"
    >
      <li class="h-[5%]"></li>
      <template v-for="(entry, i) of state" :key="entry.id">
        <li
          v-for="(set, setI) of entry.expand.sets"
          :key="set.id"
          ref="cardElementRefs"
          class="snap-center py-2 h-[90%] gap-4 transform transition-all duration-500 ease-in"
          :class="{
            'blur opacity-90': getIndex(i, setI) !== index,
          }"
        >
          <div class="p-4 h-full rounded bg-slate-900 flex flex-col gap-4">
            <div class="self-end text-slate-300">
              {{ set.set }} / {{ entry.expand.sets.length }}
            </div>
            <div class="flex h-2 gap-4">
              <div
                v-for="(_, barIndex) of entry.expand.sets"
                :key="barIndex"
                class="flex-1"
                :class="barIndex <= setI ? 'bg-green-500' : 'bg-slate-500'"
              ></div>
            </div>
            <div>
              <h2 class="text-4xl">{{ entry.expand.exercise.name }}</h2>
            </div>
            <div class="flex flex-col gap-4">
              <label
                class="flex rounded bg-slate-800 focus-within:bg-green-300/30 pl-0 justify-end"
              >
                <input
                  type="number"
                  inputmode="numeric"
                  class="focus:outline-none flex-1 bg-transparent p-2 text-right"
                />
                <div class="p-4 pl-0">/ {{ set.targetRep }}</div>
              </label>
              <label
                class="flex rounded bg-slate-800 focus-within:bg-green-300/30 pl-0 justify-end"
              >
                <input
                  type="number"
                  inputmode="decimal"
                  class="max-w-[50%] box-border focus:outline-none flex-1 bg-transparent p-2 text-right"
                />
                <div class="p-4 pl-0">kg</div>
              </label>
            </div>
            <div class="flex-1"></div>
            <div class="self-end">
              <button
                class="bg-green-700 font-bold text-xl py-1 px-2 rounded"
                @click="goto(getIndex(i, setI) + 1)"
              >
                Next
              </button>
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>
