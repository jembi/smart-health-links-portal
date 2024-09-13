import { camelCaseToFlat, getCodings, uuid } from '@/app/utils/helpers';
import { EResource, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TCondition = TType<EResource.Condition>;

const rows: TRow<TCondition>[] = [
  {
    type: 'row',
    config: { field: 'onsetDateTime', label: 'Onset Date Time' },
  },
  {
    type: 'row',
    config: { field: 'recordedDate', label: 'Recorded Date' },
  },
  {
    type: 'row',
    config: {
      label: 'Condition',
      renderRow: ({ code }) =>
        code.coding
          ?.filter((row) => {
            if (row._display) return row;
          })
          .map(({ display }) => display)
          .join(', '),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Severity',
      renderRow: ({ severity }) =>
        severity.coding?.map(({ display }) => display).join(', '),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Status',
      renderRow: ({ clinicalStatus }) =>
        clinicalStatus.coding?.map(({ code }) => code).join(', '),
    },
  },
  {
    type: 'table',
    config: {
      title: 'Connection Details',
      columns: ['Name', 'Code', 'Display', 'System'],
      renderRow: ({ row, StyledTableRow, StyledTableCell }) =>
        getCodings({ resource: row }).map(
          ([field, { code, display, system }]) => (
            <StyledTableRow key={uuid()}>
              {[camelCaseToFlat(field), code, display, system].map((cell) => (
                <StyledTableCell key={uuid()}>{cell}</StyledTableCell>
              ))}
            </StyledTableRow>
          ),
        ),
      getResource: (datum) => datum,
    },
  },
];

export const Condition = (props: Omit<TTabProps<TCondition>, 'rows'>) => (
  <TabSection<TCondition> {...props} rows={rows} />
);
