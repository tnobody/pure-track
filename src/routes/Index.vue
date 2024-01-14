<script setup lang="ts">
import { useCollection } from "../composables/pocketbase";
import { RouterLink } from "vue-router";
import { usePersistedForm } from "../composables/usePersistedForm";
import { computed } from "vue";
import NextDay from "../components/NextDay.vue";
import ActionButton from "../components/ActionButton.vue";
import { ChartBarSquareIcon, PlayIcon } from "@heroicons/vue/24/outline";

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
    <h1 class="text-3xl text-green-700 font-bold text-center" style="font-variant:small-caps;">PureTrack</h1>
    <section v-if="currentPlan" class="card bg-base-200">
      <div class="card-body">
        <span>Letztes Training nicht abgeschlossen</span>
        <router-link custom v-slot="{ navigate }" :to="'/log/' + currentPlan">
          <action-button @click="navigate">Training fortsetzen</action-button>
        </router-link>
      </div>
    </section>
    <section v-if="!currentPlan">
      <next-day></next-day>
    </section>

    <div class="flex flex-col gap-2">
      <h3 class="text-sm font-bold pl-4">Einheiten</h3>
      <section class="card bg-base-200 bg-neutral-color join join-vertical">
        <div v-for="day of state" :key="day.id">
          <div class="join-item p-4 text-sm text-left font-bold flex justify-between">
            <span>{{ day.name }}</span>
            <span class="flex gap-4 items-center">
              <router-link :to="'/history/day/' + day.id">
                <ChartBarSquareIcon class="text-primary h-6" />
              </router-link>
              <router-link :to="'/log/' + day.id"  @click.native="clear()">
                <PlayIcon class="text-primary h-6" />
              </router-link>
            </span>
          </div>
        </div>
      </section>
    </div>

    <div class="flex flex-col gap-2">
      <h3 class="text-sm font-bold pl-4">Mehr</h3>
      <section class="card bg-base-200 bg-neutral-color join join-vertical">
        <router-link to="/history" v-slot="{ navigate }">
          <button @click="navigate" class="join-item btn text-left font-bold">Verlauf</button>
        </router-link>
      </section>
    </div>
  </div>
</template>
