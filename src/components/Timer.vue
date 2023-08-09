<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PercentCircle from './PercentCircle.vue';
import Modal from './Modal.vue'
import { useTimer } from '../composables/useTimer';
const open = ref(true)
const timer = useTimer();
onMounted(() => {
    timer.start();
})
</script>
<template>
    <modal :open="open" class=" w-full m-4 my-auto flex flex-col overflow-hidden gap-4">
        <div class="text-right">
            <button @click="open = false" class="text-xl font-bold">&times;</button>
        </div>
        <div class="flex-1 h-auto">
            <PercentCircle :percentage="timer.elapsedPercent.value" foreground-circle-class="text-green-600"
                background-circle-class="text-transparent" :transition-duration="1000">
                {{ timer.remainingTime }}
            </PercentCircle>
        </div>
    </modal>
</template>