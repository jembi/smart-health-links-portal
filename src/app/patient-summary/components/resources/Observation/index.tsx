import { getCodings, camelCaseToFlat, uuid } from '@/app/utils/helpers';
import { EResource, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TObservation = TType<EResource.Observation>;

const rows: TRow<TObservation>[] = [
  {
    type: 'row',
    config: { field: 'effectiveDateTime', label: 'Effective Date Time' },
  },
  {
    type: 'row',
    config: {
      field: 'status',
      label: 'Status',
    },
  },
  {
    type: 'table',
    config: {
      title: 'Observation Details',
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
  {
    type: 'row',
    config: {
      label: 'Note',
      renderRow: ({ note }) => note?.map(({ text }) => text).join(', '),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Performed by',
      renderRow: ({ performer }, references) =>
        (
          references[performer[0].reference] as {
            resource: TType<EResource.Organization>;
          }
        ).resource.name,
    },
  },
];

export const Observation = (props: Omit<TTabProps<TObservation>, 'rows'>) => (
  <TabSection<TObservation> {...props} rows={rows} />
);
