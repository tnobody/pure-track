import { useStorage } from "@vueuse/core";
import { usePocketbase } from "./pocketbase";
import { useLoading } from "./useLoading";

export const useBatchCreate = <T>(collectionName: string) => {
  const pb = usePocketbase();
  const loading = useLoading();
  const stack = useStorage(`batch-create-${collectionName}`, () => [] as T[]);

  const savePendingData = async () => {
    await loading.withBlocking(async () => {
      const pending = stack.value;
      while (pending.length) {
        const next = pending.pop()!;
        await pb.collection(collectionName).create<T>(next);
        stack.value = pending;
      }
    });
  };

  const addBatch = (data: T[]) => {
    stack.value = [...stack.value, ...data];
  };

  return {
    addBatch,
    savePendingData,
  };
};
