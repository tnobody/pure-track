<script setup lang="ts">
import { useRoute } from 'vue-router';
import Page from '../../components/Page.vue';
import { groupBy, reverse, sort } from '../../helper/array'
import { useCollection, usePocketbase } from '../../composables/pocketbase';
import { Exercise, Log } from '../../model/ExerciseSet';
import { computed, ref } from 'vue';
import { ExpandWith } from '../../model/base';
import IntlDate from '../../components/IntlDate.vue';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

const pb = usePocketbase();
const route = useRoute()
const { date } = route.params
const { data, mutate } = useCollection<Log & ExpandWith<"exercise", Exercise>>('Log', {
    sort: '-date',
    filter: `date > '${date} 00:00:00' && date < '${date} 23:59:59'`,
    expand: 'day,exercise'
})

const group = computed(() => groupBy(reverse(data.value ?? []), log => log.expand.exercise.name));
const sortBySet = (list: Log[]) => sort(list, (a, b) => a.set - b.set)

const isDeleting = ref<string | null>(null);
const deleteEntry = async (id: string) => {
    try {
        isDeleting.value = id;
        await pb.collection('Log').delete(id);
        await mutate()
    }
    catch (e) { }
    finally {
        isDeleting.value = null;
    }
}
</script>
<template>
    <Page back-target="/history/">
        <h2 class="card-title">
            <IntlDate :date="date + ''" month="2-digit" day="2-digit" year="numeric" />
        </h2>
        <section v-for="(sets, exName) of group">
            <h3>{{ exName }}</h3>
            <table class="table -ml-4 w-[calc(100%+theme('spacing.8'))]">
                <thead>
                    <tr>
                        <th>Set</th>
                        <th>Reps</th>
                        <th>Weight</th>
                        <th>Comment</th>
                        <th>
                            <span class="sr-only">Action</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="set of sortBySet(sets)">
                        <td>{{ set.set }}</td>
                        <td>
                            <span>{{ set.repetitions }}</span>
                            <span class="text-accent "> / {{ set.targetRep }}</span>
                        </td>
                        <td>{{ set.weight }}</td>
                        <td>{{ set.comment }}</td>
                        <td>
                            <span v-if="isDeleting == set.id" class="loading loading-xs loading-spinner text-info"></span>
                            <Menu v-else as="div" class="relative ">
                                <MenuButton class="h-4 text-accent z-0">
                                    <EllipsisVerticalIcon class="h-full w-full" />
                                </MenuButton>
                                <MenuItems as="ul" class="menu bg-base-200 w-[230px] absolute z-10 rounded-box right-0">
                                    <MenuItem as="li" class="disabled">
                                    <a>{{ set.date }}</a>
                                    </MenuItem>
                                    <MenuItem as="li">
                                    <button @click="deleteEntry(set.id)" class="text-warning">
                                        <span>
                                            <TrashIcon class="w-4" />
                                        </span>
                                        <span>Löschen</span>
                                    </button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </Page>
</template>
