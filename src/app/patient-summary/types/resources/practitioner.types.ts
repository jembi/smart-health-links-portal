import { CodeableConcept } from "./../extensions/codeableConcept.tpes";
import { Gender } from "../codes/gender.types";
import { Address } from "../extensions/address.types";
import { Attachment } from "../extensions/attachment.types";
import { ContactPoint } from "../extensions/contactPoint.types";
import { HumanName } from "../extensions/humanName.types";
import { Identifier } from "../extensions/identifier.types";
import { Qualification } from "../extensions/qualification.types";

export type Practitioner = {
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  address?: Address[];
  gender?: Gender;
  birthDate?: string;
  photo?: Attachment[];
  qualification?: Qualification[];
  communication?: CodeableConcept[];
};
