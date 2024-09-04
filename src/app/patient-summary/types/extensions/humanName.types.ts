import { Period } from "./period.types";

export type HumanName = {
  use?:
    | "usual"
    | "official"
    | "temp"
    | "nickname"
    | "anonymous"
    | "old"
    | "maiden"; // Name use
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  period?: Period;
};
