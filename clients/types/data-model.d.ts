type DataModel = {
  createdAt: number
  creatorID: string
  creatorName: string
  editor: string
  description: string
  fieldLen: number
  id: string
  source: SchemaSource
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

type DataModelsParameter = { source?: number, title?: string, page?: number, size?: number };

type DataModelListRes = {
  list: DataModel[];
  total: number;
}

type FormDuplicateParameter = {
  name: string,
  icon: string,
  describe: string,
  groupID: string,
  duplicateTableID: string,
}

declare enum EditorModelFieldStep {
  basic, // 基础信息
  fieldDesign, // 字段设计
}

declare enum SchemaSource {
  Form, // 表单创建
  Model, // 模型创建
}
