type ApiType = 'create' | 'update' | 'delete' | 'search';

type DocType = 'raw' | 'swag' | 'curl' | 'javascript' | 'python'

type getTableSchemaParam = {
  tableID: string;
  action: ApiType
}

type getApiDocParam = {
  name?: string;
  id?: string;
  titleFirst?: boolean
  docType: DocType;
}

type QueryDocRes = {
  doc: APiContent;
  docType: DocType;
  name: string;
  id: string;
}

type APiContent = {
  input: string;
  method: string;
  output: string;
  url: string;
}
