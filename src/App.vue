<script setup lang="ts">
import { useAuth } from './composables/useAuth'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const { login, authenticated } = useAuth()

</script>

<template>
  <router-view></router-view>
  <dialog :open="!authenticated">
    <form @submit.prevent="login(username, password)">
      <div>
        <label for="username"></label>
        <input id="username" type="text" v-model="username" />
      </div>
      <div>
        <label for="password"></label>
        <input id="password" type="password" v-model="password" />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  </dialog>
</template>