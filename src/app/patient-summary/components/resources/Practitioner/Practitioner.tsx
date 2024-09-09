import { StyledSectionTypography } from '@/app/components/typography/StyledTypography';
import InfoRow from '../../InfoRow';
import { Practitioner as PractitionerType } from '@/app/patient-summary/types/resources/practitioner.types';
import React from 'react';
import QualificationDetails from './QualificationsDetails';
import ConnectionDetails from '../Patient/ConnectionDetails';

export default function Practitioner({ data }: { data: PractitionerType[] }) {
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
