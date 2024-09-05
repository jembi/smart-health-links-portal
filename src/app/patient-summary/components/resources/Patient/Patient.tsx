import InfoRow from '../../InfoRow';
import ConnectionDetails from './ConnectionDetails';
import PatientIdentifiers from './PatientIdentifiers';
import { StyledSectionTypography } from '@/app/components/typography/StyledTypography';

export default function Patient({ data }) {
  return (
    <>
      <StyledSectionTypography>Patient:</StyledSectionTypography>
      <InfoRow
        label="Name"
        value={`${data.name[0].given[0]}, ${data.name[0].family}`}
      />
      <InfoRow label="Gender" value={data.gender} />
      <InfoRow label="Birth Date" value={data.birthDate} />
      <PatientIdentifiers patientInfo={data} />
      <ConnectionDetails patientInfo={data} />
    </>
  );
}
