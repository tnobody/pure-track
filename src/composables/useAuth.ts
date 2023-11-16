import { ref } from "vue";
import { usePocketbase } from "./pocketbase";

export const useAuth = () => {
  const pb = usePocketbase();

  const isValid = ref(pb.authStore.isValid);
  const token = ref(pb.authStore.token);
  const model = ref(pb.authStore.model);
  const error = ref<unknown>(null);
  const loading = ref(false);

  pb.authStore.onChange((args) => {
    console.log(args, pb.authStore);

    isValid.value = pb.authStore.isValid;
    token.value = pb.authStore.token;
    model.value = pb.authStore.model;
  });

  return {
    authenticated: isValid,
    error: error,
    loading: loading,
    async login(user: string, password: string) {
      try {
        error.value = null;
        loading.value = true;
        await pb.admins.authWithPassword(user, password);
      } catch (e) {
        error.value = e;
      } finally {
        loading.value = false;
      }
    },
  };
};
