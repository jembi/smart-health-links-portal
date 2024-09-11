import React from 'react';

import { EResourceType, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TPractitioner = TType<EResourceType.Practitioner>;

const rows: TRow<TPractitioner>[] = [
  {
    type: 'row',
    config: {
      field: 'name',
      label: 'Name',
      renderRow: (field) =>
        field.name
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
      title: 'Patient Identifiers',
      columns: ['Qualification', 'System'],
      renderRow: ({ row, StyledTableRow, StyledTableCell }) =>
        row.identifier?.map((data, index) => (
          <StyledTableRow key={`${JSON.stringify(data)}_${index}`}>
            <StyledTableCell>{data.value}</StyledTableCell>
            <StyledTableCell>{data.system}</StyledTableCell>
          </StyledTableRow>
        )),
      resource: (datum) => datum,
    },
  },
];

export const Practitioner = (props: Omit<TTabProps<TPractitioner>, 'rows'>) => (
  <TabSection<TPractitioner> {...props} rows={rows} />
);
