import { Patient } from "./patient.types";

export enum ResourceType {
  patient = "Patient",
  composition = "Composition",
  organization = "Organization",
  allergyIntolerance = "AllergyIntolerance",
}

export interface ResourceMap {
  Patient: Patient;
  // TODO:Add different resources such as Composition, Condition, etc..
}
