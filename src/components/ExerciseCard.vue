<script setup lang="ts">
import { PropType, ref } from 'vue';
import { ExerciseSet, Log } from '../model/ExerciseSet'
import { ChatBubbleLeftIcon } from '@heroicons/vue/24/outline'
import { useCollection, usePocketbase } from '../composables/pocketbase';

const pb = usePocketbase()

const showComments = ref(new Set<string>())

const isShowcomment = (id: string) => showComments.value.has(id)
const toggleShowComment = (id: string) => isShowcomment(id) ? showComments.value.delete(id) : showComments.value.add(id);

const props = defineProps({
    entry: { type: Object as PropType<ExerciseSet>, required: true }
})

const emit = defineEmits<{
    (e: "next"): void
}>()

const { data: history } = useCollection<Log>('Log', {
    filter: `exercise="${props.entry.expand.exercise.id}"`,
    order: '-date',
    perPage: 3
})

</script>
<template>
    <li class="snap-center py-2 h-3/4 gap-4 transform transition-transform ease-in-out">
        <div class="p-4 h-full rounded bg-slate-900 flex flex-col gap-4">
            <div>
                <h2 class="text-3xl">{{ entry.expand.exercise.name }}</h2>
            </div>
            <ul class="flex flex-col py-4">
                <li v-for="(set) of entry.expand.sets" :key="set.id"
                    class="flex flex-col bg-slate-800  first:rounded-t last:rounded-b overflow-hidden">
                    <div class="flex">
                        <span class="p-4 pr-2  text-green-700 font-bold flex items-center">{{ set.set }}</span>
                        <label class="flex   p-2 justify-end">
                            <input type="number" inputmode="decimal" :placeholder="'' + set.targetRep"
                                class="w-full box-border rounded focus:bg-green-300/30 focus:outline-none flex-1 bg-transparent p-2 text-right" />
                            <div class="pl-2 flex items-center">/ {{ set.targetRep }}</div>
                        </label>
                        <label class="flex p-2 justify-end">
                            <input type="number" inputmode="decimal" placeholder="0"
                                class="w-full box-border rounded focus:bg-green-300/30 focus:outline-none flex-1 bg-transparent p-2 text-right" />
                            <div class="pl-2 flex items-center">kg</div>
                        </label>
                        <button class="flex items-center px-4" @click="toggleShowComment(set.id)"
                            :class="{ 'text-green-700': isShowcomment(set.id) }">
                            <ChatBubbleLeftIcon class="w-4 h-4" />
                        </button>
                    </div>
                    <div v-if="isShowcomment(set.id)" class="px-4 pb-2">
                        <input type="text" placeholder="Comment..."
                            class="w-full box-border rounded focus:bg-green-300/30 focus:outline-none flex-1 bg-transparent p-2" />

                    </div>
                </li>
            </ul>
            <div class="flex-1">
                <ul>
                    <li v-for="h in history ?? []">
                        {{ h.date }}
                    </li>                                    
                </ul>
            </div>
            <div class="self-end">
                <button class="bg-green-700 font-bold text-xl py-1 px-2 rounded" @click="emit('next')">Next</button>
            </div>
        </div>
    </li>
</template>
