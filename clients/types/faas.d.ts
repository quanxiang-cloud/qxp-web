
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
  id: string,
  state: FaasProcessStatus,
  message: string,
  creator: string,
  createAt: number,
  updatedAt: number,
  tag: string,
  ServerState: FaasProcessStatus;
  visibility: FaasVersionServingStatus
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

type FaasProcessStatus = 'Unknown' | 'True' | 'False';

type FaasVersionServingStatus = 'offline' | 'online';

type FaasSoketData = {
  key: string;
  topic: string;
}
