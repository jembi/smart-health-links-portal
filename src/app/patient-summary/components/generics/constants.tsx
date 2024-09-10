import { TMapComponent } from './resource.types';
import { AllergyIntolerance } from '../resources/AllergyIntolerance/AllergyIntolerance';
import Condition from '../resources/Condition/Condition';
import Organization from '../resources/Organization/Organization';
import Patient from '../resources/Patient/Patient';
import Practitioner from '../resources/Practitioner/Practitioner';

export const COMPONENT_MAP: TMapComponent = {
  Patient: { Component: Patient },
  Organization: { Component: Organization },
  Condition: { Component: Condition },
  Practitioner: { Component: Practitioner },
  AllergyIntolerance: {
    title: 'Allergy Intolerance',
    Component: AllergyIntolerance,
  },
};
