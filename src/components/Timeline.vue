<script setup lang="ts">
import { computed } from 'vue';
import { useCollection } from '../composables/pocketbase';
import { TotalWeightPerDayViewEntry } from '../model/History';
import IntlDate from './IntlDate.vue';

const props = defineProps<
    { exercise?: string, day?: string }
>()

const filter = computed(() => {
    let filters = []
    if (props.exercise) {
        filters.push(`exercise = '${props.exercise}'`)
    } else if ('day' in props) {
        filters.push(`day = '${props.day}'`)
    }
    return filters.join(' && ')
})

const { data } = useCollection<TotalWeightPerDayViewEntry>('TotalWeightPerDayView', {
    sort: '-date',
    expand: 'day',
    filter: filter.value
})

const getHistoryLink = (entry: TotalWeightPerDayViewEntry) => {
    const [date] = entry.date.split(' ');
    return `/history/${date}`
}

</script>
<template>
    <ul v-if="data" class="timeline timeline-vertical"
        style="--timeline-col-start:auto; --timeline-row-start: 0;--timeline-row-end: 0">
        <li v-for="(entry, index) in data" :key="entry.id">
            <hr v-if="index != 0" />
            <div class="timeline-start tabular-nums">
                <IntlDate :date="entry.date" year="numeric" month="2-digit" day="2-digit" />
            </div>
            <div class="timeline-middle px-2 text-success">
                <div class="radial-progress" :style="{
                    '--value': entry.percentTargetReps * 100,
                    '--size': '1rem',
                    '--thickness': '2px'
                }" role="progressbar"></div>
            </div>
            <RouterLink :to="getHistoryLink(entry)" class="timeline-end timeline-box w-full">
                {{ entry.expand.day.name }}
                <span class="text-xs text-neutral-400">({{ entry.totalWeight.toFixed(1) }}kg)</span>
            </RouterLink>
            <hr v-if="index < data.length - 1" />
        </li>
    </ul>
</template>
