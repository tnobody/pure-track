import { CollectionEntry } from "./base";

export type LogCube = CollectionEntry<{
  exercise: string;
  exercise_id: number;
  training_day: string;
  day_id: number;
  set: number;
  targetRep: number;
  repetitions: number;
  weight: number;
  weight_total: number;
  date: string;
  day: number;
  month: number;
  year: number;
  simple_date: string;
  comment: string;
}>;
