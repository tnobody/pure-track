<script setup lang="ts">
import { useAuth } from "./composables/useAuth";
import { useBatchCreate } from "./composables/useBatchSave";
import { useLoading } from "./composables/useLoading";
import { onMounted, ref } from "vue";

const username = ref("");
const password = ref("");
const { login, authenticated, loading: authLoading, error: authError } = useAuth();
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
    <div class=" w-full aspect-square p-12">
      <div class="h-full w-full loading loading-spinner text-success"></div>
    </div>
  </div>
  <dialog :open="!authenticated" class="modal" :class="{ 'modal-open': !authenticated }">
    <div class="modal-box">
      <form @submit.prevent="login(username, password)" class="flex flex-col gap-4">
        <h1 class="text-3xl font-bold">Login</h1>
        <div class="form-control">
          <label class="label" for="username"><span class="label-text">Username</span></label>
          <input id="username" type="text" v-model="username" class="input input-bordered" />
        </div>
        <div class="form-control">
          <label class="label" for="password"><span class="label-text">Password</span></label>
          <input id="password" type="password" v-model="password" class="input input-bordered" />
        </div>
        <div v-if="authError" class="text-error">
          Login failed
        </div>  
        <div class="modal-action">
          <button class="btn btn-primary" type="submit">
            <span v-if="authLoading" class="loading loading-bars loading-xs"></span>
            Login
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>
