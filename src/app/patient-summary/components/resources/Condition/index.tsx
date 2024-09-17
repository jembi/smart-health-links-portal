import {
  camelCaseToFlat,
  getCodings,
  getResource,
  uuid,
} from '@/app/utils/helpers';
import { EResource, TType } from '@/types/fhir.types';

import { TRow, TTabProps } from '../../generics/resource.types';
import { TabSection } from '../../generics/TabSection';

type TCondition = TType<EResource.Condition>;

const rows: TRow<TCondition>[] = [
  {
    type: 'row',
    config: { field: 'onsetDateTime', label: 'Onset Date Time' },
  },
  {
    type: 'row',
    config: { field: 'recordedDate', label: 'Recorded Date' },
  },
  {
    type: 'row',
    config: {
      label: 'Condition',
      render: ({ code }) => code?.coding?.[0].display,
    },
  },
  {
    type: 'row',
    config: {
      label: 'Severity',
      render: ({ severity }) =>
        severity?.coding?.map(({ display }) => display).join(', '),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Status',
      render: ({ clinicalStatus }) =>
        clinicalStatus?.coding?.map(({ code }) => code).join(', '),
    },
  },
  {
    type: 'table',
    config: {
      title: 'Condition Details',
      columns: ['Name', 'Code', 'Display', 'System'],
      render: ({ row, StyledTableRow, StyledTableCell }) =>
        getCodings({ resource: row }).map(
          ([field, { code, display, system }]) => (
            <StyledTableRow key={uuid()}>
              {[camelCaseToFlat(field), code, display, system].map((cell) => (
                <StyledTableCell key={uuid()}>{cell}</StyledTableCell>
              ))}
            </StyledTableRow>
          ),
        ),
    },
  },
  {
    type: 'row',
    config: {
      label: 'Code Text',
      render: ({ code }) => code?.text,
    },
  },
  {
    type: 'row',
    config: {
      label: 'Asserter',
      render: ({ asserter }, references) => {
        const { name, qualification } =
          getResource<EResource.Practitioner>(
            references,
            asserter?.reference,
          ) || {};

        const authorText = [
          name?.[0].given,
          name?.[0].family,
          qualification?.[0].code.coding?.[0]?.display,
        ]
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
];

export const Condition = (props: Omit<TTabProps<TCondition>, 'rows'>) => (
  <TabSection<TCondition> {...props} rows={rows} />
);
