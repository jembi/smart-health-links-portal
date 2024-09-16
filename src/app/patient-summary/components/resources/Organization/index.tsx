import { camelCaseToFlat, uuid } from '@/app/utils/helpers';
import { EResource, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TOrganization = TType<EResource.Organization>;

const rows: TRow<TOrganization>[] = [
  {
    type: 'row',
    config: { field: 'name', label: 'Name' },
  },
  {
    type: 'table',
    config: {
      title: 'Connection Details',
      columns: ['Type', 'Info'],
      render: ({ row, StyledTableRow, StyledTableCell }) => [
        row.address?.map(({ use, line, city, postalCode, country }) => (
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {camelCaseToFlat(use ? `${use} address` : 'address')}
            </StyledTableCell>
            <StyledTableCell>{`${line}, ${city}, ${postalCode}, ${country}`}</StyledTableCell>
          </StyledTableRow>
        )) || [],
        row.telecom?.map(({ use, system, value }) => (
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {camelCaseToFlat(use ? `${use} ${system}` : `${system}`)}
            </StyledTableCell>
            <StyledTableCell>{value}</StyledTableCell>
          </StyledTableRow>
        )) || [],
      ],
    },
  },
];

export const Organization = (props: Omit<TTabProps<TOrganization>, 'rows'>) => (
  <TabSection<TOrganization> {...props} rows={rows} />
);
