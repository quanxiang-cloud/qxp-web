type FuncField = {
  name: string,
  id: string,
  state: ProcessStatus,
  description: string,
  creator: string,
  createdAt: string,
}

type FuncListParams = {
  appID: string,
  size: string,
  page: string,
  alias?: string,
}

type ProcessStatus = 'SUCCESS' | 'ING' | 'FAILED' | 'ONLINE';
