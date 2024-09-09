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
} from 'fhir/r4';

export enum EResourceType {
  Composition = 'Composition',
  Patient = 'Patient',
  Practitioner = 'Practitioner',
  Organization = 'Organization',
  Condition = 'Condition',
  Medication = 'Medication',
  AllergyIntolerance = 'AllergyIntolerance',
  Observation = 'Observation',
}

//TODO: this type need to be extended with extra Resources type if needed
export interface IResourceType {
  [EResourceType.Composition]: Composition;
  [EResourceType.Patient]: Patient;
  [EResourceType.Practitioner]: Practitioner;
  [EResourceType.Organization]: Organization;
  [EResourceType.Condition]: Condition;
  [EResourceType.Medication]: Medication;
  [EResourceType.AllergyIntolerance]: AllergyIntolerance;
  [EResourceType.Observation]: Observation;
}

export type TType<TParam extends keyof IResourceType> = IResourceType[TParam];

export interface IDynamicProps {
  resource: keyof IResourceType;
}

export type TBundle<R = FhirResource> = Bundle<R>;
