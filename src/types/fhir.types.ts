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
}

export enum EIpsSection {
  'ActiveProblems' = 'Active Problems',
  'Medication' = 'Medication',
  'Practitioner' = 'Allergies and Intolerances',
  'HistoryOfPastIllness' = 'History of Past Illness',
  'PlanOfTreatment' = 'Plan of Treatment',
  'Results' = 'Results',
}

//TODO: this type need to be extended with extra Resources type if needed
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
}

export type TType<TParam extends keyof IResource> = IResource[TParam];

export type TSupportedResource = TType<EResource>;

export type TSupportedSection = `${EIpsSection}`;

export type TBundle<R = FhirResource> = Bundle<R>;
