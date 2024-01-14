import { CollectionEntry } from "./base";

export type ExerciseSet = {
  id: string;
  set: number;
  targetRep: number;
  expand: {
    day: {
      id: string;
      name: string;
    };
    exercise: {
      id: string;
      name: string;
    };
    sets: Array<{
      id: string;
      set: number;
      targetRep: number;
    }>;
  };
};

export type Log = CollectionEntry<{
  comment: string;
  date: string;
  day: string;
  exercise: string;
  id: string;
  repetitions: number;
  set: number;
  targetRep: number;
  weight: number;
}>;


export type Exercise = CollectionEntry<{
  name: string;
}>;
