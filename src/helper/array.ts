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
