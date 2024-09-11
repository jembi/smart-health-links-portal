import React from 'react';

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
      customFields: {
        clinicalStatus: 'Clinical Status',
        verificationStatus: 'Verification Status',
        code: 'Code',
      },
      renderRow: ({ row, customFields, StyledTableRow, StyledTableCell }) =>
        Object.entries(customFields).map(([key, val]) =>
          row[key]?.coding?.map((data, index) => (
            <StyledTableRow key={`${JSON.stringify(data)}_${index}`}>
              <StyledTableCell>{val}</StyledTableCell>
              <StyledTableCell>{data.code}</StyledTableCell>
              <StyledTableCell>{data.display}</StyledTableCell>
              <StyledTableCell>{data.system}</StyledTableCell>
            </StyledTableRow>
          )),
        ),
      resource: (datum) => datum,
    },
  },
];

export const AllergyIntolerance = <T extends TAllergyIntolerance>(
  props: Omit<TTabProps<T>, 'rows'>,
) => <TabSection<TAllergyIntolerance> {...props} rows={rows} />;
