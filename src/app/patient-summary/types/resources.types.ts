import { Patient } from "./patient.types";

export enum ResourceType {
  Patient = "Patient",
  Composition = "Composition",
  Organization = "Organization",
  AllergyIntolerance = "AllergyIntolerance",
}

export interface ResourceMap {
  Patient: Patient;
  // TODO:Add different resources such as Composition, Condition, etc..
}
