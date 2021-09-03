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
  interface NamespaceInfo {
    id: string;
    owner: string;
    title: string;
    desc: string;
    active: number; // 是否激活
    createAt: string;
    updateAt: string;
  }

  interface ServiceInfo extends NamespaceInfo {
    namespace: string;
    name: string;
  }

  interface ApiInfo extends NamespaceInfo{
    name: string;
    fullPath: string; // 代理路径
    url: string; // 原始路径
    version: string;
    method: string;
    action: string;
  }

  interface NativeApi {
    id: string;
    url: string;
    namespace: string;
    name: string;
    title: string;
    desc: string;
    active: number;
    service: string;
    schema: string;
    host: string;
    authType: string;
    updateAt: string;
  }

  type CreateApiParams={
    version: string;
    namespace: string;
    swagger: string;
  }

  type UploadApiParams={
    version: string;
    namespace: string;
    file: string;
  }

  type CreateApiResult={
    id: string; // api uuid
    path: string;
  }

  type DocType = 'raw' | 'swag' | 'curl' | 'javascript' | 'python';

  type ApiDocParams={
    docType: DocType;
    titleFirst?: boolean;
    _hide?: Record<string, any>;
    _signature?: {
      timestamp: string;
      version: number;
      method: string;
      access_key_id: string;
    }
  }

  type QueryApiDocResult={
    docType: string;
    name: string;
    id: string;
    doc: Record<string, any>;
  }

  type CreateServiceParams={
    name: string;
    title: string;
    desc: string;
    schema: string;
    host: string;
    authType: string;
    authorize: string;
  }

  type CreateServiceResult = Omit<ServiceInfo, 'owner'>
}
