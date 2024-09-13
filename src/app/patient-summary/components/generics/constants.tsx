import { TComponentMap } from './resource.types';
import { AllergyIntolerance } from '../resources/AllergyIntolerance';
import { Condition } from '../resources/Condition';
import { Organization } from '../resources/Organization';
import { Patient } from '../resources/Patient';
import { Practitioner } from '../resources/Practitioner';

export const COMPONENT_MAP: TComponentMap = {
  Patient: { title: 'Patient', Component: Patient },
  Organization: { title: 'Organization', Component: Organization },
  Condition: { title: 'Condition', Component: Condition },
  Practitioner: { title: 'Practitioner', Component: Practitioner },
  AllergyIntolerance: {
    title: 'Allergy Intolerance',
    Component: AllergyIntolerance,
  },
};
