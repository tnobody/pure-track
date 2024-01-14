<script setup lang="ts">
import { useRoute } from 'vue-router';
import Page from '../../components/Page.vue';
import { groupBy, reverse, sort } from '../../helper/array'
import { useCollection } from '../../composables/pocketbase';
import { Exercise, Log } from '../../model/ExerciseSet';
import { computed } from 'vue';
import { ExpandWith } from '../../model/base';
import IntlDate from '../../components/IntlDate.vue';

const route = useRoute()
const { date } = route.params
const { data } = useCollection<Log & ExpandWith<"exercise", Exercise>>('Log', {
    sort: '-date',
    filter: `date > '${date} 00:00:00' && date < '${date} 23:59:59'`,
    expand: 'day,exercise'
})

const group = computed(() => groupBy(reverse(data.value ?? []), log => log.expand.exercise.name));
const sortBySet = (list: Log[]) => sort(list, (a, b) => a.set - b.set)
</script>
<template>
    <Page back-target="/history/">
        <h2 class="card-title">
            <IntlDate :date="date + ''" month="2-digit" day="2-digit" year="numeric" />
        </h2>
        <section v-for="(sets, exName) of group">
            <h3>{{ exName }}</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Set</th>
                        <th>Target</th>
                        <th>Weight</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="set of sortBySet(sets)">
                        <td>{{ set.set }}</td>
                        <td>{{ set.targetRep }}</td>
                        <td>{{ set.weight }}</td>
                        <td>{{ set.comment }}</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </Page>
</template>
