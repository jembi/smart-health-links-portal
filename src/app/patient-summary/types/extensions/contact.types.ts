import { Address } from "./address.types";
import { CodeableConcept } from "./codeableConcept.tpes";
import { ContactPoint } from "./contactPoint.types";
import { HumanName } from "./humanName.types";

export type Contact = {
  purpose: CodeableConcept;
  name: HumanName;
  telecom: ContactPoint[];
  address: Address;
};
