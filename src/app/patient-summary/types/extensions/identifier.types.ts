import { CodeableConcept } from "./codeableConcept.tpes";
import { Organization } from "../resources/organisation.types";
import { Period } from "./period.types";

export type Identifier = {
  use?: "usual" | "official" | "temp" | "secondary" | "old";
  type?: CodeableConcept;
  system?: string;
  value?: string;
  period?: Period;
  assigner?: Organization;
};
