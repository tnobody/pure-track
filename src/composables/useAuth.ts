
import { ref } from "vue"
import { usePocketbase } from "./pocketbase"

export const useAuth = () => {
    const pb = usePocketbase()

    const isValid = ref(pb.authStore.isValid);
    const token = ref(pb.authStore.token);
    const model = ref(pb.authStore.model);

    pb.authStore.onChange(() => {
        isValid.value = pb.authStore.isValid;
        token.value = pb.authStore.token;
        model.value = pb.authStore.model;
    })

    return {
        authenticated: isValid,
        login(user: string, password: string) {
            return pb.admins.authWithPassword(user, password)
        }
    }
}