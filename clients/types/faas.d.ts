
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

type creatFuncParams = {
  name: string;
  alias: string;
  language: string;
  description: string;
}

type VersionListParams = {
  state: string,
  size: number,
  page: number,
}

type ProcessStatus = 'Unknown' | 'True' | 'False';

type FaasSoketData = {
  key: string;
  topic: string;
}
