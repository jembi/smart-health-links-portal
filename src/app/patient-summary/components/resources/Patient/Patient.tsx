import React from 'react';
import InfoRow from '../../InfoRow';
import ConnectionDetails from './ConnectionDetails';
import PatientIdentifiers from './PatientIdentifiers';
import { StyledSectionTypography } from '@/app/components/typography/StyledTypography';
import { IResourceType } from '@/app/patient-summary/types/fhir.types';
export default function Patient({ data }: { data: IResourceType['Patient'] }) {
  return (
    <>
      <StyledSectionTypography>Patient</StyledSectionTypography>
      <InfoRow
        label="Name"
        value={`${data[0].name[0].given[0]}, ${data[0].name[0].family}`}
      />
      <InfoRow label="Gender" value={data[0].gender} />
      <InfoRow label="Birth Date" value={data[0].birthDate} />
      <PatientIdentifiers patientInfo={data[0]} />
      <ConnectionDetails resourceInfo={data[0]} />
    </>
  );
}
