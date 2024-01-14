<script setup lang="ts">
import { Chart } from 'chart.js/auto';
import { computed, onMounted, ref, toRaw, watch } from 'vue';
import { useCollection } from '../../composables/pocketbase';
import { TotalWeightPerDayViewEntry } from '../../model/History';
import { sub, isAfter, format } from 'date-fns'
import 'chartjs-adapter-date-fns';
import { groupBy } from '../../helper/array';


const props = defineProps({
    dayId: { type: String, required: true }
})

const { data } = useCollection<TotalWeightPerDayViewEntry>('TotalWeightPerDayView', {
    sort: 'date',
    filter: `day = '${props.dayId}'`
})

const weightChartElRef = ref<HTMLCanvasElement>()
const countChartElRef = ref<HTMLCanvasElement>()
const dateRange = ref<string>('all')
let weightChart: Chart;
let countChart: Chart;

const filteredDate = computed(() => {
    const now = Date.now();
    const filters: Record<string, (() => TotalWeightPerDayViewEntry[] | undefined)> = {
        '3mo': () => data.value?.filter(({ date }) => {
            return isAfter(date, sub(now, { months: 3 }));
        }),
        '6mo': () => data.value?.filter(({ date }) => isAfter(date, sub(now, { months: 6 }))),
        '1yr': () => data.value?.filter(({ date }) => isAfter(date, sub(now, { years: 1 }))),
    };
    const filterFn = filters[dateRange.value];
    return filterFn?.() ?? data.value;
})

watch(filteredDate, (_value) => {
    if (!weightChart)
        return void 0;
    const value = toRaw(_value ?? []);

    weightChart.data.datasets[0].data = value.map(v => ({ x: v.date, y: v.totalWeight })) as any
    weightChart.data.datasets[1].data = value.map(v => ({ x: v.date, y: v.percentTargetReps * 100 })) as any
    weightChart.update();

    const countData = Object
        .entries(groupBy(value, ({ date }) => format(date, 'MM.yyyy')))
        .map(([date, e]) => ({ label: date, data: e.length }))
    countChart.data.datasets[0].data = countData.map(({ data }) => data)
    countChart.data.labels = countData.map(({ label }) => label)
    countChart.update();
})

onMounted(() => {
    if (!weightChartElRef.value)
        return void 0;
    if (!countChartElRef.value)
        return void 0;

    weightChart = new Chart(weightChartElRef.value, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Total Weight',
                data: []
            }, {
                label: 'Target Reps %',
                data: [], yAxisID: 'y2', fill: 'start'
            }]
        },
        options: {
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y2: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: 100
                },
                x: {
                    type: 'time',
                    time: {
                        displayFormats: {
                            month: 'MM.yyyy'
                        }
                    }
                },
            },
            responsive: true,
            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: false,
                }
            }
        },
    })

    countChart = new Chart(countChartElRef.value, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'Attendens per Months',
                data: []
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: false,
                }
            }
        },
    })
})

</script>
<template>
    <div class="join">
        <input class="join-item btn btn-xs" v-model="dateRange" type="radio" value="all" name="options"
            aria-label="Alles" />
        <input class="join-item btn btn-xs" v-model="dateRange" type="radio" value="3mo" name="options"
            aria-label="3 Mon" />
        <input class="join-item btn btn-xs" v-model="dateRange" type="radio" value="6mo" name="options"
            aria-label="6 Mon" />
        <input class="join-item btn btn-xs" v-model="dateRange" type="radio" value="1yr" name="options"
            aria-label="1 Jahr" />
    </div>
    <canvas ref="weightChartElRef"></canvas>
    <canvas ref="countChartElRef"></canvas>
</template>