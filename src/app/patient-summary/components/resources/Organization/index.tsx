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
        row.address?.map((data, index) => (
          <StyledTableRow key={`${JSON.stringify(data)}_${index}`}>
            <StyledTableCell>Address</StyledTableCell>
            <StyledTableCell>{`${data.line},${data.city}, ${data.postalCode}, ${data.country}`}</StyledTableCell>
          </StyledTableRow>
        )),
        row.telecom?.map((data, index) => (
          <StyledTableRow key={`${JSON.stringify(data)}_${index}`}>
            <StyledTableCell>
              {data.use} {data.system}
            </StyledTableCell>
            <StyledTableCell>{data.value}</StyledTableCell>
          </StyledTableRow>
        )),
      ],
      resource: (datum) => datum,
    },
  },
];

export const Organization = (props: Omit<TTabProps<TOrganization>, 'rows'>) => (
  <TabSection<TOrganization> {...props} rows={rows} />
);
