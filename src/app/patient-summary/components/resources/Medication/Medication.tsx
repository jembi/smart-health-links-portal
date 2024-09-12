import React from 'react';

import { StyledSectionTypography } from '@/app/components/typography/StyledTypography';
import { IResource } from '@/types/fhir.types';

import DosageDetails from './DosageDetail';
import MedicationInfo from './MedicationInfo';
import MedicationStatementDetails from './MedicationStatementDetails';
import InfoRow from '../../InfoRow';

export default function Medication({
  data,
}: {
  data: IResource['MedicationStatement'][] | IResource['Medication'][];
}) {
  const { medications, medicationStatements } = data.reduce(
    (acc, item) => {
      if (item.resourceType === 'Medication') {
        acc.medications.push(item);
      } else if (item.resourceType === 'MedicationStatement') {
        acc.medicationStatements.push(item);
      }
      return acc;
    },
    { medications: [], medicationStatements: [] } as {
      medications: IResource['Medication'][];
      medicationStatements: IResource['MedicationStatement'][];
    },
  );
  const groupedMedicationInfo = medications.map((medication, index) => ({
    medication,
    medicationStatement: medicationStatements[index],
  }));
  return groupedMedicationInfo.map((groupedMedication, index) => {
    return (
      <React.Fragment key={index}>
        <StyledSectionTypography>
          Medication Statement {index > -1 && `(${index + 1})`}
        </StyledSectionTypography>

        {groupedMedication.medicationStatement?.effectivePeriod?.start && (
          <InfoRow
            label="Effective Period"
            value={`start: ${groupedMedication.medicationStatement?.effectivePeriod?.start}`}
          />
        )}
        {groupedMedication.medicationStatement?.status && (
          <InfoRow
            label="Status"
            value={groupedMedication.medicationStatement.status}
          />
        )}

        {groupedMedication.medication?.code && (
          <InfoRow
            label="Medication"
            value={
              groupedMedication.medication?.code?.coding.find(
                ({ system }) =>
                  system ===
                  'http://spor.ema.europa.eu/v2/marketing-authorisation-numbers',
              )?.display
            }
          />
        )}

        {groupedMedication.medicationStatement?.medicationCodeableConcept && (
          <MedicationStatementDetails
            medicationStatementDetails={
              groupedMedication.medicationStatement.medicationCodeableConcept
            }
          />
        )}

        {groupedMedication.medication && (
          <MedicationInfo data={groupedMedication.medication} />
        )}

        {groupedMedication.medicationStatement?.dosage && (
          <DosageDetails
            dosageDetails={groupedMedication.medicationStatement?.dosage}
          />
        )}
      </React.Fragment>
    );
  });
}
