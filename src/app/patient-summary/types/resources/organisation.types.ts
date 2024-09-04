import { Address } from "../extensions/address.types";
import { CodeableConcept } from "../extensions/codeableConcept.types";
import { Contact } from "../extensions/contact.types";
import { ContactPoint } from "../extensions/contactPoint.types";
import { Endpoint } from "../extensions/endpoint.types";
import { Identifier } from "../extensions/identifier.types";

export type Organization = {
  identifier?: Identifier[];
  active?: boolean;
  type?: CodeableConcept[];
  name?: string;
  alias?: string[];
  telecom?: ContactPoint[];
  address?: Address[];
  partOf?: Organization;
  contact?: Contact;
  endpoint?: Endpoint[];
};
