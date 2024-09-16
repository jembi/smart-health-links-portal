import React from 'react';

import { StyledSectionTypography } from '@/app/components/typography/StyledTypography';
import { camelCaseToFlat, uuid } from '@/app/utils/helpers';
import { TSupportedResource } from '@/types/fhir.types';

import {
  DetailedTable,
  StyledTableCell,
  StyledTableRow,
} from './DetailedTable';
import { TRowData, TTabProps } from './resource.types';
import InfoRow from '../InfoRow';

export const SectionTitle = ({ title }: { title?: string }) =>
  title && <StyledSectionTypography>{title}</StyledSectionTypography>;

export const SectionRow = ({
  data,
  label,
}: {
  data: TRowData;
  label?: string;
}) => {
  if (Array.isArray(data)) {
    return data
      .filter((field) => !!field)
      .map(
        (field) =>
          field && <InfoRow key={uuid()} label={label} value={field} />,
      );
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
  resources?.map((resource, index) => (
    <React.Fragment key={uuid()}>
      <SectionTitle
        title={
          resource.resourceType === 'Composition'
            ? 'General Information'
            : `${camelCaseToFlat(resource.resourceType)} ${resources.length > 1 ? `(${index + 1})` : ``}`
        }
      />
      {rows?.map(({ type, config }, index) => {
        if (type === 'row') {
          const { field, label, value = '', render = () => {} } = config;
          const renderData = render(resource, references);
          const data =
            renderData ||
            value ||
            (field && resource?.[field] ? String(resource?.[field]) : '');

          return <SectionRow key={uuid()} data={data} label={label} />;
        } else if (type === 'table') {
          const { title, columns, render } = config;
          const rows = render({
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
