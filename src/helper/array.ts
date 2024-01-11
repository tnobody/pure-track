export type ZipStrategy = "strict";

export const zipArrays = <T1, T2>(
  a: T1[],
  b: T2[],
  { strategy } = { strategy: "strict" as ZipStrategy }
) => {
  if (strategy === "strict" && a.length != b.length) {
    throw Error("Zipped array are not in same length");
  }
  const length = Math.min(a.length, b.length);
  const result = [] as [T1, T2][];
  for (let i = 0; i < length; i++) {
    result.push([a[i], b[i]] as [T1, T2]);
  }
  return result;
};

export const groupBy = <T, K extends string | number | symbol = string>(
  list: T[],
  pickKey: (v: T) => K
) => {
  return list.reduce((grouped, e) => {
    const key = pickKey(e);
    const currentValue = grouped[key] ?? [];
    return Object.assign(grouped, { [key]: [e, ...currentValue] });
  }, {} as Record<K, T[]>);
};

export const reverse = <T>(list: T[]) => {
  const _list = [...list];
  _list.reverse();
  return _list;
};

export const sort = <T>(list: T[], cmp?: (a: T, b: T) => number) => {
  const _list = [...list];
  _list.sort(cmp);
  return _list;
};
