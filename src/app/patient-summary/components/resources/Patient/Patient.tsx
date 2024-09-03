import { extractResourceInfo } from "@/app/utils/helpers";
import InfoRow from "../../InfoRow";
import { ResourceType } from "../../../types/resources.types";
import ConnectionDetails from "./ConnectionDetails";
import PatientIdentifiers from "./PatientIdentifiers";
import { StyledSectionTypography } from "@/app/components/typography/StyledTypography";

export default function Patient({ data }) {
  const patientInfo = extractResourceInfo(ResourceType.patient, data);
  return (
    <>
      <StyledSectionTypography>Patient:</StyledSectionTypography>
      <InfoRow
        label="Name"
        value={`${patientInfo.name[0].given[0]}, ${patientInfo.name[0].family}`}
      />
      <InfoRow label="Gender" value={patientInfo.gender} />
      <InfoRow label="Birth Date" value={patientInfo.birthDate} />
      <PatientIdentifiers patientInfo={patientInfo} />
      <ConnectionDetails patientInfo={patientInfo} />
    </>
  );
}
