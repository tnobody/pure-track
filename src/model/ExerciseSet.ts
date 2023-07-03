export type ExerciseSet = {
  id: string;
  set: number;
  targetRep: number;
  expand: {
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

export type Log = {
  collectionId: string;
  collectionName: "Log";
  comment: string;
  created: string;
  date: string;
  day: string;
  exercise: string;
  id: string;
  repetitions: number;
  set: number;
  targetRep: string;
  weight: number;
};
