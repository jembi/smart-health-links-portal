import { Patient } from '../patient.types';
import { CodeableConcept } from './../extensions/codeableConcept.types';
import { Practitioner } from './practitioner.types';
import { PractitionerRole } from './practitionerRole.types';
export type Condition = {
  onsetDateTime?: string;
  recordedDate?: string;
  code?: CodeableConcept;
  severity?: CodeableConcept;
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  category?: CodeableConcept[];
  asserter?: any; // TODO:should rather be a reference to  Practitioner | PractitionerRole | Patient;
};
