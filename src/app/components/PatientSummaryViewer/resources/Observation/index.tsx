import {
  uuid,
  getCodings,
  getResource,
  camelCaseToFlat,
} from '@/app/utils/helpers';
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
    config: { field: 'status', label: 'Status' },
  },
  {
    type: 'table',
    config: {
      title: 'Observation Details',
      //TODO: sample/AT_ELGA_GmbH_01.json
      columns: ['Name', 'Code', 'Display', 'System'],
      render: ({ row, StyledTableRow, StyledTableCell }) =>
        getCodings({ resource: row, ignoredFields: ['interpretation'] }).map(
          ([field, { code, display, system }]) => (
            <StyledTableRow key={uuid()}>
              {[camelCaseToFlat(field), code, display, system].map((cell) => (
                <StyledTableCell key={uuid()}>{cell}</StyledTableCell>
              ))}
            </StyledTableRow>
          ),
        ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Note',
      render: ({ note }) => note?.map(({ text }) => text).join(', '),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Performed by',
      render: ({ performer }, references) =>
        getResource<EResource.Organization>(
          references,
          performer?.[0]?.reference,
        )?.name,
    },
  },
];

export const Observation = (props: Omit<TTabProps<TObservation>, 'rows'>) => (
  <TabSection<TObservation> {...props} rows={rows} />
);
