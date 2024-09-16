import React from 'react';

import { camelCaseToFlat, uuid } from '@/app/utils/helpers';
import { EResource, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TPatient = TType<EResource.Patient>;

const rows: TRow<TPatient>[] = [
  {
    type: 'row',
    config: {
      label: 'Name',
      render: ({ name }) =>
        [name?.[0].given?.flat().join(' '), name?.[0].family]
          .filter((name) => !!name)
          .join(', '),
    },
  },
  {
    type: 'row',
    config: { field: 'gender', label: 'Gender' },
  },
  { type: 'row', config: { field: 'birthDate', label: 'Birth Date' } },
  {
    type: 'row',
    config: {
      field: 'maritalStatus',
      label: 'Marital Status',
      render: ({ maritalStatus }) => maritalStatus?.coding?.[0].display,
    },
  },
  {
    type: 'table',
    config: {
      title: 'Patient Identifiers',
      columns: ['Identifier', 'System'],
      render: ({ row, StyledTableRow, StyledTableCell }) =>
        row.identifier?.map(({ value, system, type }) => (
          <StyledTableRow key={uuid()}>
            <StyledTableCell>{value}</StyledTableCell>
            <StyledTableCell>
              {system}
              {type?.coding?.[0]?.system}
            </StyledTableCell>
          </StyledTableRow>
        )) || [],
    },
  },
  {
    type: 'table',
    config: {
      title: 'Connection Details',
      columns: ['Type', 'Info'],
      render: ({ row, StyledTableRow, StyledTableCell }) => [
        row.address?.map(({ use, line, city, postalCode, country, type }) => (
          <StyledTableRow key={uuid()}>
            <StyledTableCell>
              {camelCaseToFlat(use ? `${use} address` : 'address')}
              {type && ` (${type})`}
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

export const Patient = (props: Omit<TTabProps<TPatient>, 'rows'>) => (
  <TabSection<TPatient> {...props} rows={rows} />
);
