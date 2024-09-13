import React from 'react';

import { camelCaseToFlat, getCodings, uuid } from '@/app/utils/helpers';
import { EResource, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TAllergyIntolerance = TType<EResource.AllergyIntolerance>;

const rows: TRow<TAllergyIntolerance>[] = [
  {
    type: 'row',
    config: {
      label: 'Category',
      renderRow: ({ category }) => category?.[0] && `Allergy to ${category[0]}`,
    },
  },
  {
    type: 'row',
    config: { field: 'onsetDateTime', label: 'Onset Date Time' },
  },
  {
    type: 'row',
    config: {
      label: 'Allergy',
      renderRow: ({ code }) => code.coding.map(({ display }) => display),
    },
  },
  { type: 'row', config: { field: 'criticality', label: 'Criticality' } },
  {
    type: 'row',
    config: {
      label: 'Status',
      renderRow: ({ clinicalStatus }) =>
        clinicalStatus.coding.map(({ code }) => code),
    },
  },
  {
    type: 'table',
    config: {
      title: 'Allergy Details',
      columns: ['Name', 'Code', 'Display', 'System'],
      renderRow: ({ row, StyledTableRow, StyledTableCell }) =>
        getCodings({ resource: row }).map(
          ([field, { code, display, system }]) => (
            <StyledTableRow key={uuid()}>
              {[camelCaseToFlat(field), code, display, system].map((cell) => (
                <StyledTableCell key={uuid()}>{cell}</StyledTableCell>
              ))}
            </StyledTableRow>
          ),
        ),
      getResource: (datum) => datum,
    },
  },
];

export const AllergyIntolerance = (
  props: Omit<TTabProps<TAllergyIntolerance>, 'rows'>,
) => <TabSection<TAllergyIntolerance> {...props} rows={rows} />;
