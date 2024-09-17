import { getCodings, getResource, uuid } from '@/app/utils/helpers';
import { EResource, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TImmunization = TType<EResource.Immunization>;

const rows: TRow<TImmunization>[] = [
  {
    type: 'row',
    config: { field: 'occurrenceDateTime', label: 'Occurrence Date Time' },
  },
  {
    type: 'row',
    config: { field: 'status', label: 'Status' },
  },
  {
    type: 'table',
    config: {
      title: 'Immunization Details',
      columns: ['Code', 'Display', 'System'],
      render: ({ row, StyledTableRow, StyledTableCell }) =>
        getCodings({ resource: row }).map(([, { code, display, system }]) => (
          <StyledTableRow key={uuid()}>
            {[code, display, system].map((cell) => (
              <StyledTableCell key={uuid()}>{cell}</StyledTableCell>
            ))}
          </StyledTableRow>
        )),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Performed by',
      render: ({ performer }, references) =>
        getResource<EResource.Organization>(
          references,
          performer?.[0]?.actor.reference,
        )?.name,
    },
  },
  {
    type: 'row',
    config: { field: 'lotNumber', label: 'Lot Number' },
  },
  //TODO: the logic of this field need to be verified
  // {
  //   type: 'row',
  //   config: { label: 'Data origin', value: 'non-primary source' },
  // },
];

export const Immunization = (props: Omit<TTabProps<TImmunization>, 'rows'>) => (
  <TabSection<TImmunization> {...props} rows={rows} />
);
