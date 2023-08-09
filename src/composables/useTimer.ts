import { createGlobalState } from "@vueuse/core";
import { computed, ref, watch } from "vue";

export const useTimer = createGlobalState(() => {
  const countdownFrom = ref(60);
  const elapsedTime = ref(0);
  const initialTime = ref(0);
  const isRunning = ref(false);
  const elapsedSeconds = computed(() => Math.ceil(elapsedTime.value / 1000));
  const remainingTime = computed(
    () => countdownFrom.value - elapsedSeconds.value
  );
  const elapsedPercent = computed(
    () => elapsedSeconds.value / countdownFrom.value
  );
  const updateElapsedTime = (t: number) => {
    elapsedTime.value = t - initialTime.value;
    if (isRunning.value === true) {
      requestAnimationFrame(updateElapsedTime);
    }
  };

  watch(elapsedSeconds, (latestElapsedSeconds) => {
    if (latestElapsedSeconds >= countdownFrom.value) {
      stop();
    }
  });

  const start = () => {
    elapsedTime.value = 0;
    isRunning.value = true;
    requestAnimationFrame((t) => {
      initialTime.value = t;
      updateElapsedTime(t);
    });
  };

  const stop = () => {
    isRunning.value = false;
  };

  return {
    start,
    stop,
    elapsedSeconds,
    elapsedPercent,
    remainingTime,
  };
});
