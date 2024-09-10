import { ElementType } from 'react';

import { IResourceType } from '@/types/fhir.types';

export type rowConfig<T> = {
  field: keyof T;
  label: string;
  value?: string;
  prefix?: string;
};

export type tableConfig<T> = {
  title: string;
  columns: string[];
  customFields?: Partial<Record<keyof T, string>>;
  resource: (resource) => T;
  renderRows: ({
    row,
    customFields,
  }: {
    customFields: Partial<Record<keyof T, string>>;
    row: T;
  }) => JSX.Element[];
};

export type TRowInfo<T> =
  | {
      type: 'row';
      config: rowConfig<T>;
    }
  | {
      type: 'table';
      config: tableConfig<T>;
    };

export type TTabProps<T> = {
  data: T[];
  title: string;
};

export type TMapComponent = Partial<
  Record<keyof IResourceType, { title?: string; Component: ElementType }>
>;
