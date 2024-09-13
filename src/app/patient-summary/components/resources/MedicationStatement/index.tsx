import {
  camelCaseToFlat,
  getCodings,
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
    config: {
      label: 'Effective Period',
      renderRow: ({ effectivePeriod }) => `Start: ${effectivePeriod.start}`,
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
      renderRow: ({ medicationReference }, references) =>
        (
          references[medicationReference.reference] as {
            resource: TType<EResource.Medication>;
          }
        ).resource.code.coding[0].display,
    },
  },
  {
    type: 'table',
    config: {
      title: 'Medication Details',
      columns: ['Name', 'Code', 'Display', 'System'],
      renderRow: ({ row, references, StyledTableRow, StyledTableCell }) =>
        (
          references[row.medicationReference.reference] as {
            resource: TType<EResource.Medication>;
          }
        ).resource.code.coding.map(({ code, display, system }) => (
          <StyledTableRow key={uuid()}>
            {[camelCaseToFlat('Medication'), code, display, system].map(
              (cell) => (
                <StyledTableCell key={uuid()}>{cell}</StyledTableCell>
              ),
            )}
          </StyledTableRow>
        )),
    },
  },
  {
    type: 'table',
    config: {
      title: 'Medication Details',
      columns: ['Quantity', 'Dosage', 'Usage'],
      renderRow: ({ row, StyledTableRow, StyledTableCell }) =>
        row.dosage.map(({ doseAndRate, timing, route }) => (
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {`${doseAndRate?.[0].doseQuantity.value || ''} ${doseAndRate?.[0].doseQuantity.unit || ''}`}
            </StyledTableCell>
            <StyledTableCell>
              {timing?.repeat.count}{' '}
              {periodUnitToText(timing?.repeat.periodUnit)}
            </StyledTableCell>
            <StyledTableCell>{route?.coding?.[0].display}</StyledTableCell>
          </StyledTableRow>
        )),
    },
  },
];

export const MedicationStatement = (
  props: Omit<TTabProps<TMedicationStatement>, 'rows'>,
) => <TabSection<TMedicationStatement> {...props} rows={rows} />;
