import React from 'react';

import { camelToFlat, getCodings } from '@/app/utils/helpers';
import { EResourceType, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TAllergyIntolerance = TType<EResourceType.AllergyIntolerance>;

const rows: TRow<TAllergyIntolerance>[] = [
  {
    type: 'row',
    config: { field: 'category', label: 'Category', prefix: 'Allergy to ' },
  },
  {
    type: 'row',
    config: { field: 'onsetDateTime', label: 'Onset Date Time' },
  },
  { type: 'row', config: { field: 'code', label: 'Allergy' } },
  { type: 'row', config: { field: 'criticality', label: 'Criticality' } },
  {
    type: 'row',
    config: { field: 'clinicalStatus', label: 'Status', value: 'code' },
  },
  {
    type: 'table',
    config: {
      title: 'Allergy Details',
      columns: ['Name', 'Code', 'Display', 'System'],
      renderRow: ({ row, StyledTableRow, StyledTableCell }) =>
        getCodings({ resource: row }).map((data, index) => {
          const [[key, { code, display, system }]] = Object.entries(data);

          return (
            <StyledTableRow key={`${JSON.stringify(data)}_${index}`}>
              <StyledTableCell>{camelToFlat(key)}</StyledTableCell>
              <StyledTableCell>{code}</StyledTableCell>
              <StyledTableCell>{display}</StyledTableCell>
              <StyledTableCell>{system}</StyledTableCell>
            </StyledTableRow>
          );
        }),
      resource: (datum) => datum,
    },
  },
];

export const AllergyIntolerance = (
  props: Omit<TTabProps<TAllergyIntolerance>, 'rows'>,
) => <TabSection<TAllergyIntolerance> {...props} rows={rows} />;
