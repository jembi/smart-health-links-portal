import { TableCellProps, TableRowProps } from '@mui/material';
import { ElementType, FC } from 'react';

import { IResourceType } from '@/types/fhir.types';

export type rowConfig<T> = {
  field: keyof T;
  label: string;
  value?: string;
  prefix?: string;
  renderRow?: (field: T) => string;
};

export type tableConfig<T> = {
  title: string;
  columns: string[];
  resource: (resource: T) => T;
  renderRow: ({
    row,
    StyledTableRow,
    StyledTableCell,
  }: {
    row: T;
    StyledTableRow: FC<TableRowProps>;
    StyledTableCell: FC<TableCellProps & { cellNumber?: number }>;
  }) => JSX.Element[] | JSX.Element[][];
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

export type TTabProps<T> = {
  data: T[];
  rows: TRow<T>[];
  title: string;
};

export type TComponentMap = Partial<
  Record<keyof IResourceType, { title?: string; Component: ElementType }>
>;
