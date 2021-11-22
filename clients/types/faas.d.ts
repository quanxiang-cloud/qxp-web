type FuncField = {
  id: string,
  alias: string,
  name: string,
  state: FaasProcessStatus,
  description: string,
  creator: string,
  createdAt: number,
  message?: string,
  updatedAt?: number,
  tag?: string,
  language: string,
  versionNum?: number,
}

type VersionField = {
  createdAt: number,
  creator: string,
  describe: string,
  id: string,
  message: string,
  serverMsg: string,
  serverState: FaasProcessStatus;
  state: FaasProcessStatus,
  tag: string,
  updatedAt: number,
  updater: string,
  visibility: FaasVersionServingStatus
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

type FaasProcessStatus = 'Unknown' | 'True' | 'False';

type FaasVersionServingStatus = 'offline' | 'online';

type FaasSoketData = {
  key: string;
  topic: string;
}
