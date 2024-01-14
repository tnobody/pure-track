<script setup lang="ts">
import { useRoute } from 'vue-router';
import Page from '../../components/Page.vue';
import DayChart from '../../components/charts/DayChart.vue';
import { computed } from 'vue';
import Timeline from '../../components/Timeline.vue';
import { useFirstFrom } from '../../composables/pocketbase';
import { CollectionEntry } from '../../model/base';

const route = useRoute()
const dayId = computed(() => route.params.dayId + '')
const { data } = useFirstFrom<CollectionEntry<{ name: string }>>('PlanDay', {
    filter: `id = '${dayId.value}'`
})
const title = computed(() => data.value?.name)
</script>
<template>
    <Page back-target="/">
        <template #title>
            <span v-if="title">
                {{ title }}
            </span>
            <div v-else class="skeleton h-4 w-full"></div>

        </template>
        <DayChart :day-id="dayId" />
        <Timeline :day="dayId" />
    </Page>
</template>