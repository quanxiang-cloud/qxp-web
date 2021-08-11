export type CustomPageInfo = {
  id: string,
  name: string,
  type: number,
  description: string,
  fileUrl: string,
  createdBy: string,
  status: number,
  updatedAt: string,
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
