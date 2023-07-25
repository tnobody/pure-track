import { createGlobalState } from "@vueuse/core";
import { ref } from "vue";

export const useLoading = createGlobalState(() => {
  const blocking = ref(false);

  return {
    blocking,
    async withBlocking(run: () => Promise<void>) {
      try {
        blocking.value = true;
        await run();
      } catch (e) {
        throw e;
      } finally {
        blocking.value = false;
      }
    },
  };
});
