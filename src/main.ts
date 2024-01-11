import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { PockebaseInjectionKey } from "./composables/pocketbase";
import Pocketbase from "pocketbase";
import { createRouter, createWebHistory } from "vue-router";
import Index from "./routes/Index.vue";
import Log from "./routes/Log.vue";
import History from "./routes/History.vue";
import HistoryDetail from "./routes/HistoryDetail.vue";
import { TouchedDirective } from "./directive/touched-directive";

createApp(App)
  .use(
    createRouter({
      history: createWebHistory(),
      routes: [
        { path: "/", component: Index },
        { path: "/log/:planId", component: Log },
        { path: "/history", component: History },
        { path: "/history/:date", component: HistoryDetail },
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
  .directive("touched", TouchedDirective)
  .mount("#app");
