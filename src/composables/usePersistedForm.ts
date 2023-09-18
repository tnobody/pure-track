import { useStorage } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { zipArrays } from "../helper/array";
import { flatFormJson, formToJson } from "../helper/form";

export const usePersistedForm = () => {
  const formRef = ref<HTMLFormElement>();
  const json = ref<Record<string, FormDataEntryValue>[]>([]);
  const formData = useStorage<Record<string, FormDataEntryValue[]>>(
    "current-plan",
    {}
  );

  onMounted(() => {
    json.value = flatFormJson(formData.value);

    if (!formRef.value) return void 0;
    Object.entries(formData.value).forEach(([name, values]) => {
      zipArrays(
        [...(formRef.value?.querySelectorAll(`[name="${name}"]`) ?? [])],
        values
      ).forEach(([element, value]) => {
        const e = element as HTMLInputElement;
        e.value = `${value}`;
      });
    });
  });

  return {
    ref: formRef,
    json,
    /**
     *
     * @returns the first invalid element or undefined
     */
    reportValidity(): HTMLInputElement | undefined {
      const inputs: HTMLInputElement[] = Array.from(
        formRef.value?.querySelectorAll("input[required]") ?? { length: 0 }
      );
      for (const input of inputs) {
        if (!input.checkValidity()) {
          return input;
        }
      }
    },
    persist: (form?: HTMLFormElement) => {
      const f = form ?? formRef.value;
      if (!f) return;
      formData.value = formToJson(f);
      json.value = flatFormJson(formData.value);
    },
    clear() {
      formData.value = {};
    },
  };
};
