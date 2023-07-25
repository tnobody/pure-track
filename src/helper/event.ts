export type Clazz<T> = new (...args: any[]) => T;
export type FN<T> = (arg: T) => void;

export const withEventTarget = <T, E extends Event>(
  Ctor: Clazz<T>,
  run: FN<E & { target: T }>
): FN<E> => {
  return (e: E) => {
    console.log(e, e.target, Ctor, e.target instanceof Ctor);

    if (e.target instanceof Ctor) {
      run(e as E & { target: T });
    }
  };
};
