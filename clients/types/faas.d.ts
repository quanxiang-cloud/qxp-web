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
  completionTime: number,
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

type FaasBuildProcess = {
  runs: string[];
  steps: string[][];
}

type FaasBuildStatus = {
  id: string;
  name: string;
  status: FaasProcessStatus;
  children: FaasBuildStatus[];
}

type FaasProcessSpanProps = {
  title: string;
  isEnd?: boolean;
  isStart?: boolean;
  isChildNode?: boolean;
  hasChild?: boolean;
}

type BuildLog = {
  log: string;
  timestamp: number;
  run: string;
  step: string;
}
