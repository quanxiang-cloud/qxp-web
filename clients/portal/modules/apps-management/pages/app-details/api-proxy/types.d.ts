interface APIGroup {
  // todo: missing api doc
  id: string;
  name: string;
  level?: number;
  visible?: boolean;
  pid?: string;
  child?: Array<APIGroup>;
}

type FormDataCreateApiGroup = {
  id?: string;
  pid?: string;
  name: string;
  remark: string; // 标识
  description?: string;
  protocol: string;
  host: string;
} | null;

declare namespace PolyAPI {
  interface ApiInfo {
    id: string;
    owner: string;
    name: string;
    title: string;
    desc: string;
    fullPath: string;
    url: string;
    version: string;
    method: string;
    action: string;
    createAt: string;
    updateAt: string;
  }

  type CreateApiParams={
    version: string;
    namespace: string;
    swagger: string;
  }

  type CreateApiResult={
    id: string; // api uuid
    path: string;
  }
}
