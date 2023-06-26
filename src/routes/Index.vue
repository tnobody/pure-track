<script setup lang="ts">
import { usePocketbase } from '../composables/pocketbase'
import { useAsyncState } from '@vueuse/core';
import {RouterLink} from 'vue-router'

const pb = usePocketbase()

const { state } = useAsyncState(() => pb.collection('PlanDay').getFullList<{ id: string, name: string }>({}), [])

</script>

<template>
    <div class="p-4 flex flex-col gap-4">
        <h1 class="text-3xl text-green-700 font-bold">Choose Day</h1>
        <ul class="bg-slate-900 first:rounded-t last:rounded-b divide-y divide-slate-800">
            <li v-for="day of state" :key="day.id" class="flex" >
                <router-link :to="'/log/' + day.id" class="p-4 w-full text-left font-bold">
                    {{ day.name }}
                </router-link>
            </li>
        </ul>
    </div>
</template>