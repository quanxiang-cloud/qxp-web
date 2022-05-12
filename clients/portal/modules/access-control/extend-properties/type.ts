export interface BaseParams {
  name: string;
  columnName: string;
  len?: number;
  pointLen?: number;
  format?: string;
}

export type FromTypes = 'words' | 'number' | 'boolen' | 'time';
export type TableTypes = 'string' | 'text' | 'longtext' | 'int' | 'float' | 'boolen' | 'time';

export interface FromParams extends BaseParams {
  types: FromTypes;
}

export interface SubmitParams extends BaseParams {
  types: TableTypes;
}

export interface TableParams extends SubmitParams {
  id: string;
  attr: 1 | 2; // 1为系统字段，2为自定义字段
  status: 1 | -1; // 1为可用， -1为不可用
  viewerStatus: 1 | -1; // 1为可见，-1为不可见
}

export interface ColumnInfo {
  columnID: string;
  viewerStatus: number;
}
