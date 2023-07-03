<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useCollection, usePocketbase } from "../composables/pocketbase";
import ExerciseCard from "../components/ExerciseCard.vue";
import { ExerciseSet } from "../model/ExerciseSet";

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
</script>
<template>
  <div class="flex flex-col h-full justify-center relative overflow-hidden">
    <ul
      class="overflow-auto snap-y snap-mandatory max-h-full px-4"
      ref="scrollContainerRef"
    >
      <li class="h-[calc(1_/_8_*_100%)]"></li>
      <ExerciseCard
        v-for="entry of state ?? []"
        :key="entry.id"
        :entry="entry"
      />
    </ul>
  </div>
</template>
