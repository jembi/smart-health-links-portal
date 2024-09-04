import { Period } from "./period.types";

export type availableTime = {
  daysOfWeek?: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  allDay?: boolean;
  availableStartTime?: string;
  availableEndTime?: string;
};

export type notAvailable = {
  description: string;
  during?: Period;
};
