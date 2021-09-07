export type CustomPageInfo = {
  id: string,
  name?: string,
  type?: number,
  fileSize?: string
  description?: string,
  fileUrl?: string,
  createdBy?: string,
  status?: number,
  updatedAt?: string,
}

export type SchemaPageInfo = {
  tableID?: string,
  fieldLen?: string
  createdBy?: string,
  createdAt?: string,
  updatedBy?: string,
  updatedAt?: string,
}

export type PageFlowInfo = {
  id: string,
  name: string,
  status?: string
}

export type fetchCustomListRes = {
  count: number;
  currentPage: number;
  pageSize: number;
  list: CustomPageInfo[]
}

export type MovePageParams = {
  id: string;
  appID: string;
  fromSort: number;
  Name: string;
  toSort: number;
  fromGroupID: string;
  toGroupID: string;
}

export type CustomPageParams = Partial<CustomPageInfo> & {
  currentPage?: number;
  pageSize?: number;
}

export type CreateCustomPageParams = {
  menuId: string;
  fileSize: string;
  fileUrl: string;
}

export type UpdateCustomPageParams = {
  id: string;
  fileSize: string;
  fileUrl: string;
}

export type Resp = {
  code: number;
  data: { url: string } | null;
  msg?: string;
}

export type FileInfo = {
  url: string;
  size?: number
  filename?: string;
  percentage?: number;
  showProgress?: boolean;
}

export type Description = {
  id: string,
  title: string,
  value: string,
}

export enum MenuType {
  schemaForm = 0,
  group = 1,
  customPage = 2,
}

export enum Status {
  inuse = 1,
  unused = 0,
}
