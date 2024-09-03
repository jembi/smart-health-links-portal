import { Practitioner } from "./practitioner.types";
import { Period } from "../extensions/period.types";
import { Identifier } from "./../extensions/identifier.types";
import { Organization } from "./organisation.types";
import { CodeableConcept } from "../extensions/codeableConcept.tpes";
import { ContactPoint } from "../extensions/contactPoint.types";
import {
  availableTime,
  notAvailable,
} from "../extensions/timaAvailability.types";
import { Endpoint } from "../extensions/endpoint.types";
export type PractitionerRole = {
  identifier?: Identifier[];
  active?: boolean;
  period: Period;
  practitioner?: Practitioner;
  organization?: Organization;
  code?: CodeableConcept[];
  specialty?: CodeableConcept[];
  location?: {}; //Location
  healthcareService: {}; //HealthcareService
  telecom?: ContactPoint[];
  availableTime?: availableTime[];
  notAvailable?: notAvailable[];
  availabilityExceptions?: string;
  endPoint?: Endpoint[];
};
