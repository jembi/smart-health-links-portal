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
  Medication = 'Medication',
  AllergyIntolerance = 'AllergyIntolerance',
  Observation = 'Observation',
  MedicationStatement = 'MedicationStatement',
}

//TODO: this type need to be extended with extra Resources type if needed
export interface IResource {
  [EResource.Composition]: Composition;
  [EResource.Patient]: Patient;
  [EResource.Practitioner]: Practitioner;
  [EResource.Organization]: Organization;
  [EResource.Condition]: Condition;
  [EResource.Medication]: Medication;
  [EResource.MedicationStatement]: MedicationStatement;
  [EResource.AllergyIntolerance]: AllergyIntolerance;
  [EResource.Observation]: Observation;
}

export type TType<TParam extends keyof IResource> = IResource[TParam];

export type TSupportedResource = TType<EResource>;

export type TBundle<R = FhirResource> = Bundle<R>;
