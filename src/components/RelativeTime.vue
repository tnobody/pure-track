<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    date: { type: [String, Date], required: true },
    relativeTo: { type: [String, Date], default: new Date() }
})
const format = new Intl.RelativeTimeFormat();
const date = computed(() => new Date(props.date))
const relativeTo = computed(() => new Date(props.relativeTo))
const text = computed(() => {
    const days =
        -1 * Math.ceil((relativeTo.value.getTime() - date.value.getTime()) / 1000 / 60 / 60 / 24);
    return format.format(days, "days");
});
</script>
<template>
    <time :datetime="date.toISOString()">{{ text }}</time>
</template>