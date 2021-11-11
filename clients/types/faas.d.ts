
type FuncField = {
  id: string,
  name: string,
  state: ProcessStatus,
  description: string,
  creator: string,
  createdAt: number,
  message: string,
  updatedAt: number,
  alias: string,
  tag: string,
  language: string,
  versionNum: number,
}

type FuncListParams = {
  appID: string,
  size: number,
  page: number,
  alias?: string,
}

type ProcessStatus = 'SUCCESS' | 'ING' | 'FAILED' | 'ONLINE';
