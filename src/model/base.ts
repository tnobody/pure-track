export type CollectionEntry<T, Name extends string = string> = T & {
  collectionId: string;
  collectionName: Name;
  id: string;
  created: string;
  updated: string;
};

export type ExpandWith<Name extends string, T> = {
  expand: Record<Name, T>;
};
