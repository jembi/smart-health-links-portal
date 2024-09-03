import { CodeableConcept } from "./codeableConcept.tpes";
import { Coding } from "./coding.types";
import { ContactPoint } from "./contactPoint.types";
import { Identifier } from "./identifier.types";
import { Period } from "./period.types";
import { Organization } from "../resources/organisation.types";
export type Endpoint = {
  Identifier?: Identifier[];
  status:
    | "active"
    | "suspended"
    | "error"
    | "off"
    | "entered-in-error"
    | "test";
  connectionType: Coding;
  name?: string;
  managingOrganization?: Organization;
  contact?: ContactPoint[];
  period?: Period;
  payloadType: CodeableConcept[];
  payloadMimeType?: Coding[];
  address: string;
  header?: string[];
};
