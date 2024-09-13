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
      renderRow: ({ name }) => `${name[0].given[0]}, ${name[0].family}`,
    },
  },
  {
    type: 'row',
    config: { field: 'gender', label: 'Gender' },
  },
  { type: 'row', config: { field: 'birthDate', label: 'Birth Date' } },
  {
    type: 'table',
    config: {
      title: 'Patient Identifiers',
      columns: ['Identifier', 'System'],
      renderRow: ({ row, StyledTableRow, StyledTableCell }) =>
        row.identifier?.map((data) => (
          <StyledTableRow key={uuid()}>
            <StyledTableCell>{data.value}</StyledTableCell>
            <StyledTableCell>{data.system}</StyledTableCell>
          </StyledTableRow>
        )),
    },
  },
  {
    type: 'table',
    config: {
      title: 'Connection Details',
      columns: ['Type', 'Info'],
      renderRow: ({ row, StyledTableRow, StyledTableCell }) => [
        row.address?.map((data) => (
          <StyledTableRow key={uuid()}>
            <StyledTableCell>Address</StyledTableCell>
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

export const Patient = (props: Omit<TTabProps<TPatient>, 'rows'>) => (
  <TabSection<TPatient> {...props} rows={rows} />
);
