<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ArrowDownRightIcon, ArrowRightIcon, ArrowUpRightIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline';
const itemClass = "flex items-center gap-4 p-2 rounded hover:bg-white/20"
const props = defineProps({
    step: { type: Number, default: 1 }
})
const emit = defineEmits<{
    (e: 'valueSelected', value: number): void
}>()
</script>
<template>
    <Menu as="div" class="relative inline-block text-left">
        <MenuButton>
            <EllipsisVerticalIcon class="h-4 w-4 text-slate-300" />
        </MenuButton>
        <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
            <MenuItems
                class="z-10 absolute flex flex-col p-2 gap-2 right-0 mt-2 origin-top-right rounded-md bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-slot="{ active }">
                <button @click.prevent="emit('valueSelected', step)" :class="[itemClass, { 'active': active }]">
                    <ArrowUpRightIcon class="w-4 h-4" />
                    <span>Erhöht</span>
                </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                <button @click.prevent="emit('valueSelected', 0)" :class="[itemClass, { 'active': active }]">
                    <ArrowRightIcon class="w-4 h-4" />
                    <span>Unverändert</span>
                </button>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                <button @click.prevent="emit('valueSelected', step * -1)" :class="[itemClass, { 'active': active }]">
                    <ArrowDownRightIcon class="w-4 h-4" />
                    <span>Verringert</span>
                </button>
                </MenuItem>
            </MenuItems>
        </transition>
    </Menu>
</template>
<style scoped>
.active {
    @apply bg-white/20;
}
</style>