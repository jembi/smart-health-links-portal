import {
  Composition,
  Patient,
  Practitioner,
  Organization,
  Condition,
  Medication,
  AllergyIntolerance,
  Observation,
  Bundle,
  FhirResource,
  MedicationStatement,
  Immunization,
} from 'fhir/r4';

export enum EResource {
  Composition = 'Composition',
  Patient = 'Patient',
  Practitioner = 'Practitioner',
  Organization = 'Organization',
  Condition = 'Condition',
  MedicationStatement = 'MedicationStatement',
  Medication = 'Medication',
  AllergyIntolerance = 'AllergyIntolerance',
  Observation = 'Observation',
  Immunization = 'Immunization',
}

export enum EIpsSection {
  'ActiveProblems' = 'Active Problems',
  'ProblemList' = 'Problem List',
  'Medication' = 'Medication',
  'AllergiesAndIntolerances' = 'Allergies and Intolerances',
  'HistoryOfPastIllness' = 'History of Past Illness',
  'PlanOfTreatment' = 'Plan of Treatment',
  'Results' = 'Results',
  'VitalSigns' = 'Vital Signs',
  'Immunization' = 'Immunizations',
}

// TODO: this type need to be extended with extra Resources type if needed
export interface IResource {
  [EResource.Composition]: Composition;
  [EResource.Patient]: Patient;
  [EResource.Practitioner]: Practitioner;
  [EResource.Organization]: Organization;
  [EResource.Condition]: Condition;
  [EResource.MedicationStatement]: MedicationStatement;
  [EResource.Medication]: Medication;
  [EResource.AllergyIntolerance]: AllergyIntolerance;
  [EResource.Observation]: Observation;
  [EResource.Immunization]: Immunization;
}

export type TType<TParam extends keyof IResource> = IResource[TParam];

export type TSupportedResource = TType<EResource>;

export type TSupportedSection = keyof typeof EIpsSection;

export type TBundle<R = FhirResource> = Bundle<R>;
