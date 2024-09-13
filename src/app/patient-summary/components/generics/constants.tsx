import { TComponentMap } from './resource.types';
import { AllergyIntolerance } from '../resources/AllergyIntolerance';
import { Composition } from '../resources/Composition';
import { Condition } from '../resources/Condition';
import { MedicationStatement } from '../resources/MedicationStatement';
import { Observation } from '../resources/Observation';
import { Organization } from '../resources/Organization';
import { Patient } from '../resources/Patient';
import { Practitioner } from '../resources/Practitioner';

export const COMPONENT_MAP: TComponentMap = {
  Composition: { title: 'Composition', Component: Composition },
  Patient: { title: 'Patient', Component: Patient },
  Organization: { title: 'Organization', Component: Organization },
  Condition: { title: 'Condition', Component: Condition },
  Practitioner: { title: 'Practitioner', Component: Practitioner },
  MedicationStatement: { title: 'Medication', Component: MedicationStatement },
  AllergyIntolerance: {
    title: 'Allergies',
    Component: AllergyIntolerance,
  },
  Observation: {
    title: 'Observation',
    Component: Observation,
  },
};
