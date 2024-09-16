import { TableCellProps, TableRowProps } from '@mui/material';
import { ElementType, FC, JSX } from 'react';

import { EResource, TSupportedResource } from '@/types/fhir.types';

export type TRowData =
  | string
  | JSX.Element
  | JSX.Element[]
  | (string | undefined)[]
  | undefined;

export type rowConfig<T> = {
  label?: string;
  field?: keyof T;
  value?: string | string[];
  render?: (
    row: T,
    references?: Record<string, { resource: TSupportedResource }>,
  ) => TRowData;
};

export type tableConfig<T> = {
  title?: string;
  columns: string[];
  references?: Record<string, { resource: TSupportedResource }>;
  render: ({
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
};

type TRowConfigRow<T> = {
  type: 'row';
  config: rowConfig<T>;
};

type TRowConfigTable<T> = {
  type: 'table';
  config: tableConfig<T>;
};

export type TRow<T> = TRowConfigRow<T> | TRowConfigTable<T>;

export type TTabProps<T, R = never> = {
  rows: TRow<T>[];
  title: string;
  resources?: R[];
  references: Record<string, { resource: TSupportedResource }>;
};

export type TComponentMap = Partial<
  Record<`${EResource}`, { title?: string; Component: ElementType }>
>;
