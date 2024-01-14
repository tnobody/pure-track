<script setup lang="ts">
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';

defineProps({
    backTarget: { type: String, default: '..' }
})

</script>
<template>
    <div class="bg-base-200 p-4 flex flex-col gap-4 min-h-full">
        <nav class="flex justify-between">
            <RouterLink :to="backTarget" class=" text-accent flex gap-1 items-center">
                <ChevronLeftIcon class="h-4" />
                <span>Zurück</span>
            </RouterLink>
        </nav>
        <h1 v-if="$slots.title" class="text-2xl font-bold text-primary">
            <slot name="title"></slot>
        </h1>
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <slot />
            </div>
        </div>
    </div>
</template>