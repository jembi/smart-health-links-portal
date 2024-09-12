import React from 'react';

import { StyledSectionTypography } from '@/app/components/typography/StyledTypography';
import { TSupportedResource } from '@/types/fhir.types';

import { DetailedTable } from './DetailedTable';
import { TTabProps } from './resource.types';
import InfoRow from '../InfoRow';

export const TabSection = <T extends TSupportedResource>({
  rows,
  data,
  title = '',
}: TTabProps<T>) =>
  data.map((datum, index) => (
    <React.Fragment key={index}>
      <StyledSectionTypography key={index}>
        {title} {index > -1 && `(${index + 1})`}
      </StyledSectionTypography>

      {rows.map((row, index) => {
        const { type, config } = row;
        if (type === 'row') {
          const {
            field,
            label,
            value = '',
            prefix = '',
            renderRow = () => {},
          } = config;
          if (field) {
            const selectedField = renderRow(datum) || datum[field];

            if (Array.isArray(selectedField?.['coding'])) {
              return selectedField['coding'].map((item) => {
                const title = item[value] || item.display;

                return title ? (
                  <InfoRow
                    key={title}
                    label={label}
                    value={`${prefix}${title}`}
                  />
                ) : null;
              });
            }
            return selectedField ? (
              <InfoRow
                key={label}
                label={label}
                value={`${prefix}${selectedField}`}
              />
            ) : null;
          }
        } else if (type === 'table') {
          return (
            <DetailedTable
              key={index}
              {...{ ...config, resource: config.resource(datum) }}
            />
          );
        }
      })}
    </React.Fragment>
  ));
