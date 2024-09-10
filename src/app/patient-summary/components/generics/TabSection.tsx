import React from 'react';

import { StyledSectionTypography } from '@/app/components/typography/StyledTypography';
import { IResourceType } from '@/types/fhir.types';

import { DetailedTable } from './DetailedTable';
import { TTabProps } from './resource.types';
import InfoRow from '../InfoRow';
import { ALLERGY_INTOLERANCE_ROWS } from '../resources/AllergyIntolerance/AllergyIntoleranceRows';

export const TabSection = <
  K extends keyof IResourceType,
  T extends IResourceType[K],
>({
  data,
  title = '',
}: TTabProps<T>) =>
  data.map((datum, index) => (
    <React.Fragment key={index}>
      <StyledSectionTypography key={index}>
        {title} {index > -1 && `(${index + 1})`}
      </StyledSectionTypography>

      {ALLERGY_INTOLERANCE_ROWS.map(({ type, config }, index) => {
        if (type === 'row') {
          const { field, label, value = '', prefix = '' } = config;
          if (field) {
            const selectedField = datum[field];

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
