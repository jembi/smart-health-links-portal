import { TableCellProps, TableRowProps } from '@mui/material';
import { ElementType, FC } from 'react';

import { EResource, TSupportedResource } from '@/types/fhir.types';

export type rowConfig<T> = {
  label: string;
  field?: keyof T;
  value?: string | string[];
  renderRow?: (
    row: T,
    references?: Record<string, { resource: TSupportedResource }>,
  ) => string | string[] | JSX.Element | JSX.Element[];
};

export type tableConfig<T> = {
  title: string;
  columns: string[];
  references?: Record<string, { resource: TSupportedResource }>;
  renderRow: ({
    row,
    references,
    StyledTableRow,
    StyledTableCell,
  }: {
    row: T;
    references?: Record<string, { resource: TSupportedResource }>;
    StyledTableRow: FC<TableRowProps>;
    StyledTableCell: FC<TableCellProps & { cellNumber?: number }>;
  }) => JSX.Element[] | JSX.Element[][];
  getResource: (resource: T) => T;
};

type TRowRow<T> = {
  type: 'row';
  config: rowConfig<T>;
};

type TRowTable<T> = {
  type: 'table';
  config: tableConfig<T>;
};

export type TRow<T> = TRowRow<T> | TRowTable<T>;

export type TTabProps<T, R = never> = {
  rows: TRow<T>[];
  title: string;
  resources?: R[];
  references: Record<string, { resource: TSupportedResource }>;
};

export type TComponentMap = Partial<
  Record<`${EResource}`, { title?: string; Component: ElementType }>
>;
