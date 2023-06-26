<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { usePocketbase } from '../composables/pocketbase'
import { useAsyncState } from '@vueuse/core';
import { ref } from 'vue';

type ExerciseSet = {
    id: string,
    set: number,
    targetRep: number,
    expand: {
        exercise: {
            name: string
        },
        sets: Array<{
            id: string,
            set: number,
            targetRep: number
        }>
    },

}

const { params } = useRoute();

const pb = usePocketbase()

const { state } = useAsyncState(() => pb.collection('DayExercise').getFullList<ExerciseSet>({
    filter: `day="${params.planId}"`,
    sort: 'order',
    expand: 'exercise,sets'
}), [])

const index = ref(0)
</script>
<template>
    <div class="flex flex-col h-full justify-center relative overflow-hidden">
        <ul class="overflow-auto snap-y snap-mandatory max-h-full px-4">
            <li class="h-[calc(1_/_8_*_100%)]"></li>
            <template v-for="(entry) of state" :key="entry.id">
                <li v-for="(set) of entry.expand.sets" :key="set.id"
                    class="snap-center py-2 h-3/4 gap-4 transform transition-transform ease-in-out">
                    <div class="p-4 h-full rounded bg-slate-900 flex flex-col">
                        <div class="self-end text-slate-300">{{ set.set }} / {{ entry.expand.sets.length }}</div>
                        <div>
                            <h2 class="text-5xl">{{ entry.expand.exercise.name }}</h2>
                        </div>
                        <div class="flex-1">
                            <div class="text-3xl">
                                <input type="number" class="bg-transparent p-2 text-right" /> / {{ set.targetRep }}
                            </div>
                        </div>
                        <div class="self-end">
                            <button class="bg-green-700 font-bold text-xl py-1 px-2 rounded" @click="index++">Next</button>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
    </div>
</template>