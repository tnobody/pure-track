import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { PockebaseInjectionKey } from "./composables/pocketbase";
import Pocketbase from "pocketbase";
import { createRouter, createWebHistory } from "vue-router";
import Index from "./routes/Index.vue";
import Log from "./routes/Log.vue";

createApp(App)
  .use(
    createRouter({
      history: createWebHistory(),
      routes: [
        { path: "/", component: Index },
        { path: "/log/:planId", component: Log },
      ],
    })
  )
  .provide(
    PockebaseInjectionKey,
    (() => {
      const pb = new Pocketbase("https://pure-track.pockethost.io");
      return pb;
    })()
  )
  .mount("#app");
