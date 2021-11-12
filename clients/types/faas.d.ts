
type FuncField = {
  id: string,
  name: string,
  state: string,
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
type VersionField = {
  id: string,
  state: string,
  message: string,
  creator: string,
  createAt: number,
  updatedAt: number,
  tag: string,
  visibility: string
  describe: string
}

type FuncListParams = {
  appID: string,
  size: number,
  page: number,
  alias?: string,
}

type VersionListParams = {
  state: string,
  size: number,
  page: number,
}

type ProcessStatus = 'SUCCESS' | 'ING' | 'FAILED' | 'ONLINE';
