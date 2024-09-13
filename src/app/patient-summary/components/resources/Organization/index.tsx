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
      renderRow: ({ row, StyledTableRow, StyledTableCell }) => [
        row.address?.map((data) => (
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {camelCaseToFlat(`${data.use} address`)}
            </StyledTableCell>
            <StyledTableCell>{`${data.line},${data.city}, ${data.postalCode}, ${data.country}`}</StyledTableCell>
          </StyledTableRow>
        )),
        row.telecom?.map((data) => (
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {camelCaseToFlat(`${data.use} ${data.system}`)}
            </StyledTableCell>
            <StyledTableCell>{data.value}</StyledTableCell>
          </StyledTableRow>
        )),
      ],
    },
  },
];

export const Organization = (props: Omit<TTabProps<TOrganization>, 'rows'>) => (
  <TabSection<TOrganization> {...props} rows={rows} />
);
