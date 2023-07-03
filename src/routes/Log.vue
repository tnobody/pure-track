<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useCollection } from "../composables/pocketbase";
import ExerciseCard from "../components/ExerciseCard.vue";
import { ExerciseSet } from "../model/ExerciseSet";

const { params } = useRoute();

const { data: state } = useCollection<ExerciseSet>("DayExercise", {
  filter: `day="${params.planId}"`,
  sort: "order",
  expand: "exercise,sets",
});
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
