export type TotalWeightPerDayViewEntry = {
  collectionId: string;
  collectionName: string;
  date: string;
  day: string;
  id: string;
  percentTargetReps: number;
  totalReps: number;
  totalTargetReps: number;
  totalWeight: number;
  created: string;
  updated: string;
  expand: {
    day: {
      collectionId: string;
      collectionName: string;
      created: string;
      updated: string;
      id: string;
      name: string;
      order: number;
      plan: string;
    };
  };
};
