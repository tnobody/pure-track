<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useCollection } from "../composables/pocketbase";
import ExerciseLog from "../components/ExerciseLog.vue";
import { ExerciseSet } from "../model/ExerciseSet";

const { params } = useRoute();

const { data: state } = useCollection<ExerciseSet>("DayExercise", {
  filter: `day="${params.planId}"`,
  sort: "order",
  expand: "exercise,sets,day",
});
</script>
<template>
  <template v-if="state">
    <ExerciseLog :exerciseSets="state" />
  </template>
</template>
