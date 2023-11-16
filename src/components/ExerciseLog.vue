<script lang="ts" setup>
import ExerciseCard from "../components/ExerciseCard.vue";
import ResultPage from "../components/ResultPage.vue";
import { useElementBounding, useScroll } from "@vueuse/core";
import { PropType, computed, reactive, ref, watch } from "vue";
import { ExerciseSet } from "../model/ExerciseSet";
import { waitForScrollEnd } from "../composables/useScrollEnd";
import { usePersistedForm } from "../composables/usePersistedForm";
import { useBatchCreate } from "../composables/useBatchSave";
import { useRouter } from "vue-router";

const props = defineProps({
  exerciseSets: { type: Object as PropType<ExerciseSet[]>, required: true },
});
const logBatch = useBatchCreate("Log");
const state = reactive(props.exerciseSets);
const router = useRouter();

const scrollContainerRef = ref<HTMLElement>();
const resultPage = ref<HTMLElement>();
const cardRef = ref<{ scrollToMe(): void }[]>([]);

const { x: xScroll } = useScroll(scrollContainerRef);
const { width } = useElementBounding(scrollContainerRef);
const form = usePersistedForm();

const scrollPct = computed(() =>
  scrollContainerRef.value
    ? Math.min(
      1,
      (xScroll.value + width.value) / scrollContainerRef.value.scrollWidth
    )
    : 0
);

const n = computed(() => 1 + (state.length ?? 0));

watch(scrollPct, (scrolled, old) => {
  const round = scrolled > old ? Math.ceil : Math.floor;
  index.value = round(n.value * scrolled) - 1;
});

const handleForm = async (e: Event) => {
  if (e.target instanceof HTMLFormElement) {
    console.log(form.json);
    const date = new Date().toISOString();
    const batchData = form.json.value.map((d) => ({ ...d, date }));
    logBatch.addBatch(batchData);
    await logBatch.savePendingData();
    form.clear();
    router.push("/");
  }
};

const autoScroll = async (scrollAction: () => Promise<void>) => {
  if (!scrollContainerRef.value) return void 0;
  scrollContainerRef.value.classList.replace(
    "overflow-hidden",
    "overflow-auto"
  );
  await scrollAction();
  await waitForScrollEnd(scrollContainerRef.value);
  scrollContainerRef.value.classList.replace(
    "overflow-auto",
    "overflow-hidden"
  );
};

const index = ref(0);
const isOnResultPage = computed(() => scrollPct.value > 1 - 1 / n.value);
const goto = async (i: number) =>
  autoScroll(async () => {
    index.value = i;
    cardRef.value[index.value]?.scrollToMe();
  });

const goToResults = async () => {
  await autoScroll(async () => {
    const invalidElement = form.reportValidity()
    if (invalidElement) {
      invalidElement.scrollIntoView({ behavior: "smooth" });
      invalidElement.reportValidity()
    } else {
      resultPage.value?.scrollIntoView({ behavior: "smooth" });
    }
  });
}
const next = () => goto(index.value + 1);
const prev = () => goto(index.value - 1);

const abortAnd = (then: () => any) => {
  const confirmed = confirm("Willst du wirklich abbrechen?");
  if (confirmed) {
    form.clear();
    then();
  }
}
</script>
<template>
  <form :ref="form.ref" @change="form.persist()" @submit.prevent="handleForm($event as SubmitEvent)"
    class="bg-base-100 flex flex-col h-full justify-center relative overflow-hidden">
    <div class=" left-0 right-0 top-0 pt-4 px-4 flex gap-2 transition-transform duration-300 ease-in"
      :class="{ '-translate-y-full': isOnResultPage }">
      <div v-for="(entry, i) of state ?? []" :key="entry.id" class="h-2 flex-1 transition-all duration-300" :class="[
        { 'flex-[3] rounded': index === i },
        i <= index ? 'bg-primary' : 'bg-neutral',
      ]"></div>
    </div>
    <ul
      class="overflow-hidden grid grid-flow-col snap-x snap-mandatory overscroll-x-contain w-full flex-1 max-w-full max-h-full"
      ref="scrollContainerRef">
      <ExerciseCard v-for="entry of state" ref="cardRef" :key="entry.id" :entry="entry" />
      <li ref="resultPage"
        class="overflow-auto snap-start h-full w-screen gap-4 p-4 transform transition-transform ease-in-out">
        <ResultPage :log-data="form.json.value" @abort="goto(0)" />
      </li>
    </ul>
    <div class="bg-base-200 p-4 flex justify-between relative transition-transform duration-300 ease-in"
      :class="{ 'translate-y-[calc(100%+2rem)]': isOnResultPage }">
      <div>
        <router-link v-if="index === 0" custom to="/" v-slot="{ navigate }">
          <button class="btn btn-sm btn-ghost" @click.prevent="abortAnd(navigate)">Abbrechen</button>
        </router-link>
        <button class="btn btn-sm btn-ghost" v-if="index !== 0" @click.prevent="prev()">Zurück</button>
      </div>
      <div>
        <button class="btn btn-sm btn-ghost" v-if="index < state.length - 1" @click.prevent="next()">
          Weiter
        </button>
        <button class="btn btn-sm btn-ghost"  v-if="index === state.length - 1" @click.prevent="goToResults()">
          Abschliessen
        </button>
      </div>
    </div>
  </form>
</template>
