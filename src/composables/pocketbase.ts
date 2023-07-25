import { InjectionKey, inject } from "vue";
import Pocketbase, { ListQueryParams } from "pocketbase";
import { fail } from "../helper/fail";
import useSWRV from "swrv";
import LocalStorageCache from "swrv/dist/cache/adapters/localStorage";

export const PockebaseInjectionKey = Symbol() as InjectionKey<Pocketbase>;

export const usePocketbase = () => {
  return inject(PockebaseInjectionKey) ?? fail("Pocketbase not provided");
};

const cache = new LocalStorageCache("swrv");

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
    { cache }
  );
};

export const usePagedCollection = <T>(
  collection: string,
  queryParams: { page: number; perPage: number } & ListQueryParams
) => {
  const pb = usePocketbase();
  const { page, perPage } = queryParams;
  const getKey = () => `${collection}?${new URLSearchParams(queryParams)}`;
  return useSWRV(
    getKey(),
    () =>
      pb
        .collection(collection)
        .getList<T>(page, perPage, { $cancelKey: getKey(), ...queryParams }),
    { cache }
  );
};
