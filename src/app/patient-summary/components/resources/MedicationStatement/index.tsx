import {
  camelCaseToFlat,
  getResource,
  periodUnitToText,
  uuid,
} from '@/app/utils/helpers';
import { EResource, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TMedicationStatement = TType<EResource.MedicationStatement>;

const rows: TRow<TMedicationStatement>[] = [
  {
    type: 'row',
    config: { field: 'effectiveDateTime', label: 'Effective Date Time' },
  },
  {
    type: 'row',
    config: {
      label: 'Effective Period',
      render: ({ effectivePeriod }) =>
        `${effectivePeriod?.start ? `Start: ${effectivePeriod.start}` : ''}${effectivePeriod?.end ? ` - End: ${effectivePeriod.end}` : ''}`,
    },
  },
  {
    type: 'row',
    config: { field: 'status', label: 'Status' },
  },
  {
    type: 'row',
    config: {
      label: 'Medication',
      render: ({ status, medicationReference }, references) =>
        status !== 'unknown'
          ? getResource<EResource.Medication>(
              references,
              medicationReference?.reference,
            )?.code?.coding?.[0].display
          : '',
    },
  },
  {
    type: 'table',
    config: {
      title: 'Medication Details',
      columns: ['Name', 'Code', 'Display', 'System'],
      render: ({ row, references, StyledTableRow, StyledTableCell }) =>
        (row.status !== 'unknown' &&
          getResource<EResource.Medication>(
            references,
            row.medicationReference?.reference,
          )?.code?.coding?.map(({ code, display, system }) => (
            <StyledTableRow key={uuid()}>
              {[camelCaseToFlat('Medication'), code, display, system].map(
                (cell) => (
                  <StyledTableCell key={uuid()}>{cell}</StyledTableCell>
                ),
              )}
            </StyledTableRow>
          ))) ||
        [],
    },
  },
  {
    type: 'table',
    config: {
      title: 'Dosage',
      columns: ['Quantity', 'Dosage', 'Usage'],
      render: ({ row, StyledTableRow, StyledTableCell }) =>
        row.dosage?.map(({ doseAndRate, timing, route }) => (
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {doseAndRate?.[0]?.doseQuantity?.value}{' '}
              {doseAndRate?.[0]?.doseQuantity?.unit}
            </StyledTableCell>
            <StyledTableCell>
              {periodUnitToText(
                timing?.repeat?.periodUnit,
                timing?.repeat?.period || timing?.repeat?.count,
              )}
            </StyledTableCell>
            <StyledTableCell>{route?.coding?.[0].display}</StyledTableCell>
          </StyledTableRow>
        )) || [],
    },
  },
];

export const MedicationStatement = (
  props: Omit<TTabProps<TMedicationStatement>, 'rows'>,
) => <TabSection<TMedicationStatement> {...props} rows={rows} />;
