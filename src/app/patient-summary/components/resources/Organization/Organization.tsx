import { StyledSectionTypography } from '@/app/components/typography/StyledTypography';
import InfoRow from '../../InfoRow';
import ConnectionDetails from '../Patient/ConnectionDetails';
import React from 'react';
import { IResourceType } from '@/types/fhir.types';

export default function Organization({
  data,
}: {
  data: IResourceType['Organization'][];
}) {
  return data.map((organizationInfo, index) => (
    <React.Fragment key={index}>
      <StyledSectionTypography key={index}>
        Organization {index > -1 && `(${index + 1})`}
      </StyledSectionTypography>
      <InfoRow label="Name" value={organizationInfo.name} />
      <ConnectionDetails resourceInfo={organizationInfo} />
    </React.Fragment>
  ));
}
