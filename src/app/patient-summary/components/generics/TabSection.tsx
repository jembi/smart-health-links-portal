import React from 'react';

import { StyledSectionTypography } from '@/app/components/typography/StyledTypography';
import { camelCaseToFlat, uuid } from '@/app/utils/helpers';
import { TSupportedResource } from '@/types/fhir.types';

import {
  DetailedTable,
  StyledTableCell,
  StyledTableRow,
} from './DetailedTable';
import { TTabProps } from './resource.types';
import InfoRow from '../InfoRow';

export const SectionTitle = ({ title }: { title: string }) => (
  <StyledSectionTypography>{title}</StyledSectionTypography>
);

export const SectionRow = <T,>({
  data,
  label,
}: {
  data: string | JSX.Element | string[] | JSX.Element[] | T[keyof T];
  label: string;
}) => {
  if (Array.isArray(data)) {
    return data
      .filter((field) => !!field)
      .map((field) => <InfoRow key={uuid()} label={label} value={field} />);
  }
  return data ? <InfoRow key={uuid()} label={label} value={data} /> : null;
};

export const TabSection = <
  T extends TSupportedResource,
  R extends T & TSupportedResource = T & TSupportedResource,
>({
  rows,
  resources,
  references,
}: TTabProps<T, R>) =>
  resources.map((resource, index) => (
    <React.Fragment key={uuid()}>
      <SectionTitle
        title={`${camelCaseToFlat(resource.resourceType)} ${resources.length > 1 ? `(${index + 1})` : ``}`}
      />
      {rows?.map(({ type, config }, index) => {
        if (type === 'row') {
          const { field, label, value = '', renderRow = () => {} } = config;
          const data =
            value || renderRow(resource, references) || resource[field];
          return <SectionRow key={uuid()} data={data} label={label} />;
        } else if (type === 'table') {
          const { title, columns, renderRow } = config;
          const rows = renderRow({
            row: resource,
            references,
            StyledTableRow: (props) => <StyledTableRow {...props} />,
            StyledTableCell: (props) => (
              <StyledTableCell {...props} cellNumber={columns.length} />
            ),
          });

          return (
            <DetailedTable key={index} data={{ rows, columns }} title={title} />
          );
        }
      })}
    </React.Fragment>
  ));
