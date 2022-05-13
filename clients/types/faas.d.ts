type Group = {
  gid?: number,
  name?: string,
  groupId?: string,
  describe?: string,
}

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
  repoUrl?: string,
  tag?: string,
  language: string,
}

type VersionField = {
  // completionTime: number,
  // createdAt: number,
  // creator: string,

  // 报错的文案
  // message: string,

  // serverMsg: string,
  // 上线 下限
  // serverState: FaasProcessStatus;
  // 失败
  // state: FaasProcessStatus,
  // tag: string,
  // updatedAt: number,
  // updater: string,
  // visibility: FaasVersionServingStatus

  describe: string,
  env: string;
  groupID: string;
  id: string;
  name: string;
  projectID: string;
  resourceRef: string;
  status: number;
  version: string;
  createdAt: number;
  updatedAt: number;
  message: string,
  creator: string,
  updater: string,
  completionTime: number,
  docStatus: number,
  builtAt: number,
}

type FuncListParams = {
  // appID: string,
  size: number,
  page: number,
  alias?: string,
}

type creatFuncParams = {
  name: string;
  alias: string;
  language: string;
  description: string;
  version: string;
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
