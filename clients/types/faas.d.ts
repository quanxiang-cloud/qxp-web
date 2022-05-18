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
  size: number,
  page: number,
  alias?: string,
}

type creatFuncParams = {
  type: string;
  id: string;
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
