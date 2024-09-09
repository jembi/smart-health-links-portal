import { StyledSectionTypography } from '@/app/components/typography/StyledTypography';
import React from 'react';
import InfoRow from '../../InfoRow';
import { Condition as ConditionType } from '@/app/patient-summary/types/resources/condition.types';
import ConditionDetails from './ConditionDetails';
export default function Condition({ data }: { data: ConditionType[] }) {
  return data.map((conditionInfo, index) => (
    <React.Fragment key={index}>
      <StyledSectionTypography key={index}>
        Condition {index > -1 && `(${index + 1})`}
      </StyledSectionTypography>
      {conditionInfo.onsetDateTime && (
        <InfoRow label="Onset Date Time" value={conditionInfo.onsetDateTime} />
      )}
      {conditionInfo.recordedDate && (
        <InfoRow label="Recorded Date" value={conditionInfo.recordedDate} />
      )}
      <InfoRow
        label="Condition"
        value={conditionInfo.code['coding']
          .map((coding) => coding.display)
          .join(', ')}
      />
      {conditionInfo.severity && (
        <InfoRow
          label="Severity"
          value={conditionInfo.severity?.coding
            ?.map((coding) => coding.display)
            .join(', ')}
        />
      )}
      {conditionInfo.clinicalStatus && (
        <InfoRow
          label="Status"
          value={conditionInfo.clinicalStatus?.coding
            ?.map((coding) => coding.code)
            .join(', ')}
        />
      )}

      <ConditionDetails conditionDetails={conditionInfo} />

      {conditionInfo.code?.text && (
        <InfoRow label="Code Text" value={conditionInfo.code?.text} />
      )}
      {conditionInfo.asserter && (
        <InfoRow label="Asserter" value={conditionInfo.asserter.display} />
      )}
    </React.Fragment>
  ));
}
