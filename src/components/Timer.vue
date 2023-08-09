<script setup lang="ts">
import PercentCircle from './PercentCircle.vue';
import Modal from './Modal.vue'
import { useTimer } from '../composables/useTimer';
const timer = useTimer();
</script>
<template>
    <modal :open="timer.isOpen.value" class="w-full m-4  my-auto">
        <div class="h-full w-full flex flex-col overflow-hidden gap-4">
            <div class="text-right">
                <button @click="timer.hide()" class="text-xl font-bold">&times;</button>
            </div>
            <div class="flex-1 h-auto">
                <PercentCircle :percentage="timer.elapsedPercent.value" foreground-circle-class="text-green-600"
                    background-circle-class="text-transparent" :transition-duration="1000">
                    {{ timer.remainingTime }}
                </PercentCircle>
            </div>
        </div>
    </modal>
</template>