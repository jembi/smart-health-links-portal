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
      render: ({ name }) => {
        const authorText = [name?.[0].given, name?.[0].family]
          .filter((name) => !!name)
          .join(', ');

        return (
          authorText && (
            <>
              {name?.[0].prefix}
              {authorText}
            </>
          )
        );
      },
    },
  },
  {
    type: 'table',
    config: {
      title: 'Qualifications',
      columns: ['Qualification', 'System'],
      render: ({ row, StyledTableRow, StyledTableCell }) =>
        row.qualification?.[0]
          ? [
              <StyledTableRow key={uuid()}>
                <StyledTableCell>
                  {row.qualification?.[0]?.code?.coding?.[0].display}{' '}
                  {row.qualification?.[0]?.code?.coding?.[0].code &&
                    `(${row.qualification?.[0]?.code?.coding?.[0].code})`}
                </StyledTableCell>
                <StyledTableCell>
                  {row.qualification?.[0]?.code?.coding?.[0].system}
                </StyledTableCell>
              </StyledTableRow>,
            ]
          : [],
    },
  },
];

export const Practitioner = (props: Omit<TTabProps<TPractitioner>, 'rows'>) => (
  <TabSection<TPractitioner> {...props} rows={rows} />
);
