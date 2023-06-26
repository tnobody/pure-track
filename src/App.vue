<script setup lang="ts">
import { useAuth } from './composables/useAuth'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const { login, authenticated } = useAuth()

</script>

<template>
  <router-view></router-view>
  <dialog :open="!authenticated" class="p-4 bg-slate-950 border text-slate-50 rounded">
    <form @submit.prevent="login(username, password)" class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="username">Username</label>
        <input id="username" type="text" v-model="username" class="bg-transparent bg-slate-800 focus:bg-green-300/30 p-2 rounded" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" class="bg-transparent bg-slate-800 focus:bg-green-300/30 p-2 rounded" />
      </div>
      <div class="text-right">
        <button class="bg-green-700 rounded py-1 px-2 self-end" type="submit">Login</button>
      </div>
    </form>
  </dialog>
</template>