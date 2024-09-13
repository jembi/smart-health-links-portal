import React from 'react';

import { uuid } from '@/app/utils/helpers';
import { EResource, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TPractitioner = TType<EResource.Practitioner>;

const rows: TRow<TPractitioner>[] = [
  {
    type: 'row',
    config: {
      label: 'Name',
      renderRow: ({ name }) =>
        name
          .map(
            ({ given, family }) =>
              `${given?.join(' ')}${family && `, ${family}`}`,
          )
          .join(),
    },
  },
  {
    type: 'table',
    config: {
      title: 'Qualifications',
      columns: ['Qualification', 'System'],
      renderRow: ({ row, StyledTableRow, StyledTableCell }) => [
        <StyledTableRow key={uuid()}>
          <StyledTableCell>
            {`${row.qualification[0].code.coding[0].display} (${row.qualification[0].code.coding[0].code})`}
          </StyledTableCell>
          <StyledTableCell>
            {row.qualification[0].code.coding[0].system}
          </StyledTableCell>
        </StyledTableRow>,
      ],
      getResource: (datum) => datum,
    },
  },
];

export const Practitioner = (props: Omit<TTabProps<TPractitioner>, 'rows'>) => (
  <TabSection<TPractitioner> {...props} rows={rows} />
);
