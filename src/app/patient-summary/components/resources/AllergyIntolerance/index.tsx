import { TableRow, TableCell } from '@mui/material';
import React from 'react';

import { EResourceType, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TAllergyIntolerance = TType<EResourceType.AllergyIntolerance>;

export const AllergyIntolerance = <T extends TAllergyIntolerance>(
  props: Omit<TTabProps<T>, 'rows'>,
) => {
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
        renderRows: ({ customFields, row }) =>
          Object.entries(customFields).map(([key, val]) =>
            row[key]?.coding?.map((data, index) => (
              <TableRow key={`${JSON.stringify(data)}_${index}`}>
                <TableCell>{val}</TableCell>
                <TableCell>{data.code}</TableCell>
                <TableCell>{data.display}</TableCell>
                <TableCell>{data.system}</TableCell>
              </TableRow>
            )),
          ),
        resource: (datum) => datum,
      },
    },
  ];

  return <TabSection<TAllergyIntolerance> {...props} rows={rows} />;
};
