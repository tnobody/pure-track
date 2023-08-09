<script setup lang="ts">
import Timer from "./components/Timer.vue";
import PercentCircle from "./components/PercentCircle.vue";
import { useAuth } from "./composables/useAuth";
import { useBatchCreate } from "./composables/useBatchSave";
import { useLoading } from "./composables/useLoading";
import { onMounted, ref } from "vue";

const username = ref("");
const password = ref("");
const { login, authenticated } = useAuth();
const loading = useLoading();
const batch = useBatchCreate("Log");
onMounted(() => {
  batch.savePendingData();
});
</script>

<template>
  <router-view></router-view>
  <div v-show="loading.blocking.value"
    class="absolute inset-0 flex items-center justify-center backdrop-blur bg-black/70 transition-all">
    <div class="animate-spin w-full aspect-square p-4">
      <percent-circle :percentage="0.75" foreground-circle-class="text-green-500"
        background-circle-class="text-transparent" />
    </div>
  </div>
  <timer />
  <dialog :open="!authenticated" class="p-4 bg-slate-950 border text-slate-50 rounded">
    <form @submit.prevent="login(username, password)" class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="username">Username</label>
        <input id="username" type="text" v-model="username"
          class="bg-transparent bg-slate-800 focus:bg-green-300/30 p-2 rounded" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password"
          class="bg-transparent bg-slate-800 focus:bg-green-300/30 p-2 rounded" />
      </div>
      <div class="text-right">
        <button class="bg-green-700 rounded py-1 px-2 self-end" type="submit">
          Login
        </button>
      </div>
    </form>
  </dialog>
</template>
