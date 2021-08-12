type DataModel = {
  createdAt: number
  creatorID: string
  creatorName: string
  description: string
  fieldLen: number
  id: string
  source: 1 | 2
  tableID: string
  title: string
  updatedAt: number
}

type DataModelParams = {
  page: number,
  size: number,
  title: string,
}

type DataModelBasicInfo = {
  title: string;
  tableID: string;
  description?: string;
}

type DataModelSchema = {
  tableID: string;
  schema: ISchema & {
    description: string;
    properties: Record<string, ModelFieldSchema>
  }
}

type ModelFieldSchema = ISchema & {
  type: 'string' | 'array' | 'datetime' | 'number' | 'boolean';
  not_null?: boolean;
  isForeignKeys?: boolean;
  format?: string;
  length?: number;
  digits?: number;
  validationRules?: string;
  regular?: string;
  subtype?: 'string' | 'datetime' | 'number' | 'boolean';
}

type ModelField = ModelFieldSchema & {
  id: string
}
