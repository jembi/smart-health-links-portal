import { Organization } from "../resources/organisation.types";
import { CodeableConcept } from "./codeableConcept.types";
import { Identifier } from "./identifier.types";
import { Period } from "./period.types";

export type Qualification = {
  identifier?: Identifier[];
  code: CodeableConcept;
  period?: Period;
  issuer: Organization;
};
