export const formToJson = <Keys extends string = string>(
  form: HTMLFormElement
) => {
  const formData = new FormData(form);
  const uniqKeys = new Set(formData.keys());
  const allValues = [...uniqKeys].reduce(
    (group, key) => ({ ...group, [key]: formData.getAll(key) }),
    {} as Record<string, FormDataEntryValue[]>
  );
  return allValues as Record<Keys, FormDataEntryValue[]>;
};

export const flatFormJson = <Keys extends string = string>(
  values: Record<Keys, FormDataEntryValue[]>
) => {
  const vals = Object.values(values);
  const length = !vals.length
    ? 0
    : Math.min(...vals.map((v) => (Array.isArray(v) ? v.length : 0)));
  return Array.from({ length }, (_, i) => i).map((i) => {
    return Object.fromEntries(
      Object.entries(values).map(([key, v]) => [
        key,
        (v as FormDataEntryValue[])[i],
      ])
    );
  }) as Array<Record<Keys, FormDataEntryValue>>;
};
