import { StyledSectionTypography } from '@/app/components/typography/StyledTypography';
import InfoRow from '../../InfoRow';
import React from 'react';
import QualificationDetails from './QualificationsDetails';
import { IResourceType } from '@/types/fhir.types';

export default function Practitioner({
  data,
}: {
  data: IResourceType['Practitioner'];
}) {
  return data.map((practitionerInfo, index) => (
    <React.Fragment key={index}>
      <StyledSectionTypography>Practitioner</StyledSectionTypography>
      {practitionerInfo.name && (
        <InfoRow
          label="Name"
          value={practitionerInfo.name.map(
            ({ given, family }) =>
              `${given?.join(' ')}${family && `, ${family}`}`,
          )}
        />
      )}

      {practitionerInfo.qualification && (
        <QualificationDetails
          qualificationDetails={practitionerInfo?.qualification}
        />
      )}
    </React.Fragment>
  ));
}
