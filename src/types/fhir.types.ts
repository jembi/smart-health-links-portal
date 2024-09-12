import {
  Composition,
  Patient,
  Practitioner,
  Organization,
  Condition,
  Medication,
  MedicationStatement,
  AllergyIntolerance,
  Observation,
  Bundle,
  FhirResource,
} from 'fhir/r4';

export enum EResource {
  Composition = 'Composition',
  Patient = 'Patient',
  Practitioner = 'Practitioner',
  Organization = 'Organization',
  Condition = 'Condition',
  Medication = 'Medication',
  MedicationStatement = 'MedicationStatement',
  AllergyIntolerance = 'AllergyIntolerance',
  Observation = 'Observation',
}

//TODO: this type need to be extended with extra Resources type if needed
export interface IResource {
  [EResource.Composition]: Composition;
  [EResource.Patient]: Patient;
  [EResource.Practitioner]: Practitioner;
  [EResource.Organization]: Organization;
  [EResource.Condition]: Condition;
  [EResource.Medication]: Medication;
  [EResource.AllergyIntolerance]: AllergyIntolerance;
  [EResource.Observation]: Observation;
  [EResource.MedicationStatement]: MedicationStatement;
}

export type TType<TParam extends keyof IResource> = IResource[TParam];

export type TSupportedResource = TType<EResource>;

export type TBundle<R = FhirResource> = Bundle<R>;
