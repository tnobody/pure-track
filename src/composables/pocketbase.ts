import { InjectionKey, inject } from "vue";
import Pocketbase, { ListQueryParams } from "pocketbase";
import { fail } from "../helper/fail";
import useSWRV from "swrv";

export const PockebaseInjectionKey = Symbol() as InjectionKey<Pocketbase>;

export const usePocketbase = () => {
  return inject(PockebaseInjectionKey) ?? fail("Pocketbase not provided");
};

export const useCollection = <T>(
  collection: string,
  queryParams?: ListQueryParams
) => {
  const pb = usePocketbase();
  const getKey = () => `${collection}?${new URLSearchParams(queryParams)}`;
  return useSWRV(
    getKey(),
    () =>
      pb
        .collection(collection)
        .getFullList<T>({ $cancelKey: getKey(), ...queryParams }),
    {}
  );
};
