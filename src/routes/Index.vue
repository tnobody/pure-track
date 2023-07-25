<script setup lang="ts">
import { useCollection } from "../composables/pocketbase";
import { RouterLink } from "vue-router";
import { usePersistedForm } from "../composables/usePersistedForm";
import { computed } from "vue";

const { data: state } = useCollection<{ id: string; name: string }>("PlanDay", {
  sort: 'order'
});
const { clear, json } = usePersistedForm();

const currentPlan = computed(() => {
  if (json.value && json.value.length) {
    return json.value[0]['day'];
  }
})

</script>

<template>
  <div class="p-4 flex flex-col gap-4">
    <h1 class="text-3xl text-green-700 font-bold">Choose Day</h1>
    <section v-if="currentPlan" class="flex flex-col gap-4 mb-4">
      <span>Letztes Training nicht abgeschlossen</span>
      <router-link :to="'/log/' + currentPlan" class="px-4 py-2 text-center rounded bg-green-500">
        Training fortsetzen
      </router-link>
    </section>
    <ul class="bg-slate-900 first:rounded-t last:rounded-b divide-y divide-slate-800">
      <li v-for="day of state" :key="day.id" class="flex">
        <router-link @click.native="clear()" :to="'/log/' + day.id" class="p-4 w-full text-left font-bold">
          {{ day.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
