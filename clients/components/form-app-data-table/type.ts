import { SizeType } from '@c/table';

export type TableHeaderBtn = {
  key: string;
  text: string;
  action: (data: any) => void;
  iconName: string;
  className?: string;
  type?: 'text' | 'popConfirm';
  popText?: string;
  isBatch?: boolean;
}

export type Ref = {
  refresh: () => void;
  getSelected: () => string[];
  getSchema: () => ISchema | undefined;
}

export type TableConfig = {
  fixedRule?: string;
  order?: string;
  pageSize?: number;
};

export type TableColumnConfig = {
  id: string;
  width?: number;
}

export type TableUserConfig = {
  columnConfig: ColumnConfig;
  tableSize: SizeType;
  widthMap: Record<string, number | string>;
}

export type ColumnConfig = Record<string, FormTableConfig>

export type FormTableConfig = {
  hidden: boolean;
  fixed?: boolean;
}
