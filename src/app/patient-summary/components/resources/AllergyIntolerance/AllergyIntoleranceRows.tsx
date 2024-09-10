import { TableRow, TableCell } from '@mui/material';

import { EResourceType, IResourceType } from '@/types/fhir.types';

import { TRowInfo } from '../../generics/resource.types';

export const ALLERGY_INTOLERANCE_ROWS: TRowInfo<
  IResourceType[EResourceType.AllergyIntolerance]
>[] = [
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
