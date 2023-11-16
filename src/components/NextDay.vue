<script setup lang="ts">
import { computed } from 'vue';
import { useCollection, useFirstFrom } from '../composables/pocketbase';
import { usePersistedForm } from '../composables/usePersistedForm';
import ActionButton from '../components/ActionButton.vue'

const form = usePersistedForm()

const { data: lastDay, error } = useFirstFrom<{ totalWeight: number, day: string }>(
    "TotalWeightPerDayView",
    {
        sort: "-date",
    }
);

const { data: plans } = useCollection<{ id: string; name: string }>("PlanDay", {
    sort: 'order'
});

const nextPlan = computed(() => {
    if (!lastDay) return;
    const p = plans.value ?? [];
    const lastIndex = p.findIndex(({ id }) => lastDay.value?.day === id)
    if (lastIndex >= 0) {
        return p[(lastIndex + 1) % p.length]
    }
})

</script>
<template>
    <template v-if="!error">
        <section v-if="nextPlan" class="card bg-base-200">
            <div class="card-body">
                <span>Nächste Einheit: <strong>{{ nextPlan.name }}</strong></span>
                <router-link :to="'/log/' + nextPlan.id" custom v-slot="{ navigate }" v-if="nextPlan">
                    <action-button @click="form.clear(); navigate()">Starten</action-button>
                </router-link>
            </div>
        </section>
    </template>
</template>