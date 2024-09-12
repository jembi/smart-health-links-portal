import React from 'react';

import { camelCaseToFlat, getCodings } from '@/app/utils/helpers';
import { EResource, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TAllergyIntolerance = TType<EResource.AllergyIntolerance>;

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
        getCodings({ resource: row }).map(
          ([field, { code, display, system }], index) => (
            <StyledTableRow key={`${system}_${index}`}>
              {[camelCaseToFlat(field), code, display, system].map((cell) => (
                <StyledTableCell key={system}>{cell}</StyledTableCell>
              ))}
            </StyledTableRow>
          ),
        ),
      resource: (datum) => datum,
    },
  },
];

export const AllergyIntolerance = (
  props: Omit<TTabProps<TAllergyIntolerance>, 'rows'>,
) => <TabSection<TAllergyIntolerance> {...props} rows={rows} />;
